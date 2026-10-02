import {
  ReplayFileWriter,
  type ReplayFileHandle,
  type ReplayWriterMeta
} from "./opfs-replay-writer"
import {
  readReplayHeader,
  readReplayTrailer,
  type ReplayFrame,
  type ReplaySummary
} from "./replay-format"

// pure logic of the recorder worker, browser api injected via WorkerDeps
// owns one open recording at a time; a new roomId closes the old file and opens the new

// sync handle that can also be read back for download (opfs sync handle has read())
export interface ReplayReadWriteHandle extends ReplayFileHandle {
  read(buffer: Uint8Array, opts?: { at?: number }): number
}

// raw stored-recording entry for list: stem + header-prefix read (parsed, no whole multi-mb read) + file stats
export interface RawReplayEntry {
  roomId: string
  header: Uint8Array
  // trailing bytes (small tail read); core parses the match-summary footer from it, omit and summary is null
  tail?: Uint8Array
  bytes: number
  mtime: number
}

// stored recording summarised for the library list; header fields null on a foreign/corrupt file, still listable by mtime+size
export interface ReplayFileInfo {
  roomId: string
  recordedAt: string | null
  mtime: number
  bytes: number
  game: { version: string; assetsVersion: string } | null
  viewerUid: string | null
  // pov final team + placement from the trailer footer; null on old/foreign files
  summary: ReplaySummary | null
}

interface WorkerDeps {
  // open (create if needed) the opfs file for roomId; a reconnect after a reload reopens the same file so the writer appends
  openHandle(roomId: string): Promise<ReplayReadWriteHandle>
  // read the whole file read-only to download one that isn't the active handle (e.g. after a reload); null if absent, optional
  readFile?(roomId: string): Promise<Uint8Array | null>
  // keep the `keep` most-recent recordings plus `protect` (the in-progress one), delete the rest
  prune?(keep: number, protect: string): Promise<void>
  // enumerate stored recordings in any order, core sorts; optional
  list?(): Promise<RawReplayEntry[]>
  remove?(roomId: string): Promise<void>
  post(message: unknown, transfer?: Transferable[]): void
}

type RecorderInMessage =
  | {
      type: "frames"
      roomId: string
      meta: ReplayWriterMeta
      frames: ReplayFrame[]
      batchId?: number
    }
  | { type: "flush" }
  | { type: "download"; roomId: string; id: number }
  | { type: "list"; id: number }
  | { type: "delete"; roomId: string; id: number }
  | { type: "config"; keep: number }
  | { type: "close"; roomId?: string; summary?: ReplaySummary }

// sealed recordings kept on a new-game prune (in-progress one always protected); overridden by "config"
const DEFAULT_KEEP_RECENT = 2

const errMsg = (e: unknown): string => String((e as Error)?.message ?? e)
const isQuotaError = (e: unknown): boolean =>
  e instanceof Error &&
  (e.name === "QuotaExceededError" || /quota/i.test(e.message))

// parse a raw entry's header into the list summary; foreign/corrupt headers degrade to nulls, still listed
function summariseEntry(e: RawReplayEntry): ReplayFileInfo {
  const meta = readReplayHeader(e.header)
  return {
    roomId: e.roomId,
    recordedAt: meta?.recordedAt ?? null,
    mtime: e.mtime,
    bytes: e.bytes,
    game: meta
      ? { version: meta.game.version, assetsVersion: meta.game.assetsVersion }
      : null,
    viewerUid: meta?.viewerUid ?? null,
    summary: e.tail ? readReplayTrailer(e.tail) : null
  }
}

// newest-first sort key: header recordedAt when parseable, else file mtime
const sortKey = (f: ReplayFileInfo): number =>
  (f.recordedAt ? Date.parse(f.recordedAt) : Number.NaN) || f.mtime

export function createRecorderWorker(deps: WorkerDeps) {
  let keepRecent = DEFAULT_KEEP_RECENT
  let current: {
    roomId: string
    handle: ReplayReadWriteHandle
    writer: ReplayFileWriter
    // highest batchId durably appended to this file; a frames with batchId <= this is a resend, skip the write but still ack (idempotent); reset per file
    lastBatchId: number
  } | null = null

  async function ensureOpen(roomId: string, meta: ReplayWriterMeta) {
    if (current?.roomId === roomId) return
    if (current) {
      try {
        current.writer.close()
      } catch (e) {
        console.error("[recorder.worker] closing previous file", e)
      }
      current = null
    }
    const handle = await deps.openHandle(roomId)
    let writer: ReplayFileWriter
    try {
      // ctor writes the header synchronously; if that first write throws (io/quota) close the just-opened exclusive handle or we leak the lock forever (NoModificationAllowedError)
      writer = new ReplayFileWriter(handle, { meta })
    } catch (e) {
      try {
        handle.close()
      } catch {
        // ignore
      }
      throw e
    }
    current = { roomId, handle, writer, lastBatchId: 0 }
    if (deps.prune) await deps.prune(keepRecent, roomId)
  }

  // process one inbound message; caller serializes calls (await each) so the async open can't race a duplicate handle
  async function handleMessage(msg: RecorderInMessage): Promise<void> {
    switch (msg.type) {
      case "frames": {
        const batchId = msg.batchId ?? 0
        // open (or reopen) the file; on failure nack so the main thread keeps the frames buffered and resends
        try {
          await ensureOpen(msg.roomId, msg.meta)
        } catch (e) {
          deps.post({
            type: "nack",
            roomId: msg.roomId,
            batchId,
            error: errMsg(e)
          })
          break
        }
        const cur = current
        if (!cur) {
          deps.post({
            type: "nack",
            roomId: msg.roomId,
            batchId,
            error: "no active file after open"
          })
          break
        }
        if (batchId !== 0 && batchId <= cur.lastBatchId) {
          // already on disk from a resend after a missed ack: skip the write but ack so the main thread frees the frames
          deps.post({ type: "ack", roomId: msg.roomId, batchId })
          break
        }
        try {
          cur.writer.appendFrames(msg.frames) // atomic: fully appended, or rolled back + throws
        } catch (e) {
          // rollback wrote nothing, so nack and the main thread resends; on a quota error first hard-prune sealed recordings (keep 0, active protected) so the resend can succeed
          if (deps.prune && isQuotaError(e)) {
            try {
              await deps.prune(0, msg.roomId)
            } catch {
              // best effort; if it can't reclaim, the resend nacks again and frames stay buffered
            }
          }
          deps.post({
            type: "nack",
            roomId: msg.roomId,
            batchId,
            error: errMsg(e)
          })
          break
        }
        // on disk now; advance lastBatchId before flushing so a flush throw can't make a resend re-append (a dup); a flush failure is logged not nacked (bytes already appended, a later flush/close retries the fsync)
        cur.lastBatchId = batchId
        try {
          cur.writer.flush()
        } catch (e) {
          console.error("[recorder.worker] flush after append failed", e)
        }
        deps.post({ type: "ack", roomId: msg.roomId, batchId })
        break
      }
      case "flush":
        current?.writer.flush()
        break
      case "download": {
        // always reply (even on failure) so the main-thread download promise can't hang forever
        if (current && current.roomId === msg.roomId) {
          try {
            current.writer.flush()
            const size = current.writer.size
            const buf = new Uint8Array(size)
            current.handle.read(buf, { at: 0 })
            deps.post(
              { type: "downloaded", id: msg.id, buf: buf.buffer, bytes: size },
              [buf.buffer]
            )
          } catch (e) {
            deps.post({ type: "downloaded", id: msg.id, error: errMsg(e) })
          }
          break
        }
        // not the active file (e.g. download after a reload, before the reconnect flush reopened it); read the whole .colreplay directly, read-only
        try {
          const bytes = deps.readFile ? await deps.readFile(msg.roomId) : null
          if (!bytes || bytes.length === 0) {
            deps.post({
              type: "downloaded",
              id: msg.id,
              error: "no recording for room"
            })
          } else {
            // hand off a standalone arraybuffer (transferable) so the read bytes aren't copied again
            const ab =
              bytes.byteOffset === 0 &&
              bytes.byteLength === bytes.buffer.byteLength
                ? bytes.buffer
                : bytes.slice().buffer
            deps.post(
              { type: "downloaded", id: msg.id, buf: ab, bytes: bytes.length },
              [ab]
            )
          }
        } catch (e) {
          deps.post({ type: "downloaded", id: msg.id, error: errMsg(e) })
        }
        break
      }
      case "config":
        // clamp to >= 1: 0 would prune away the game that just finished (active file protected separately)
        keepRecent = Math.max(1, Math.floor(msg.keep))
        break
      case "list": {
        // enumerate stored recordings; always replies (even on failure) so the promise can't hang, empty is valid
        try {
          const raw = deps.list ? await deps.list() : []
          const files = raw
            .map(summariseEntry)
            .sort((a, b) => sortKey(b) - sortKey(a))
          deps.post({ type: "listed", id: msg.id, files })
        } catch (e) {
          deps.post({ type: "listed", id: msg.id, files: [], error: errMsg(e) })
        }
        break
      }
      case "delete": {
        // never delete the file we're actively writing; it would orphan the open sync handle and lose the recording (library only deletes sealed files, but guard defensively)
        if (current?.roomId === msg.roomId) {
          deps.post({
            type: "deleted",
            id: msg.id,
            error: "cannot delete the active recording"
          })
          break
        }
        try {
          if (deps.remove) await deps.remove(msg.roomId)
          deps.post({ type: "deleted", id: msg.id, roomId: msg.roomId })
        } catch (e) {
          deps.post({ type: "deleted", id: msg.id, error: errMsg(e) })
        }
        break
      }
      case "close":
        // only seal the file this close targets: a next game may have opened its own writer during the drain before close, and without the guard a delayed close would trailer + release that writer mid-recording; roomId null keeps the legacy no-game-context close
        if (current && (msg.roomId == null || current.roomId === msg.roomId)) {
          try {
            if (msg.summary) current.writer.writeTrailer(msg.summary)
            current.writer.close()
          } catch (e) {
            console.error("[recorder.worker] close", e)
          }
          current = null
        }
        break
    }
  }

  return { handleMessage }
}
