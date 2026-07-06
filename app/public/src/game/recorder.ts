import { Room, SchemaSerializer } from "@colyseus/sdk"
import pkg from "../../../../package.json"
import { rooms } from "../network"
import { preference, subscribeToPreference } from "../preferences"
import store from "../stores"
import {
  type CapturedFrame,
  createFlushController
} from "./recorder-flush-core"
import type { ReplayWriterMeta } from "./opfs-replay-writer"
import type { ReplayFileInfo } from "./recorder-worker-core"
import { isReplayRoom } from "./replay-room-id"
import {
  deriveFinalRank,
  ensureReplayTrailer,
  loadReplay,
  type ReplayFrame,
  type ReplayManifest,
  type ReplaySummary
} from "./replay-format"
import type GameState from "../../../rooms/states/game-state"
import { Transfer } from "../../../types"
import { Passive } from "../../../types/enum/Passive"

export type { ReplayFileInfo } from "./recorder-worker-core"

// in-client match recorder: taps the client's inbound Colyseus stream so the match can be saved as a
// .colreplay for the /replay viewer. only own @view-scoped state is captured, never other players' hidden info

const stateCaptures = new WeakMap<object, CapturedFrame[]>()
const msgCaptures = new WeakMap<object, CapturedFrame[]>()
let seq = 0
let installed = false

// recording needs OPFS to persist, so with no OPFS we don't tap or buffer at all
export const replaysSupported =
  typeof navigator !== "undefined" &&
  typeof navigator.storage?.getDirectory === "function"
let recordingEnabled = replaysSupported && preference("recordReplays")

// strong ref to the last game room so its frames survive rooms.game being cleared
let lastGameRoom: Room | null = null
export function getActiveGameRoom(): Room | null {
  return rooms.game ?? lastGameRoom
}
// POV's end-of-game summary, snapshotted at GAME_END while state is still live
let pendingSummary: ReplaySummary | undefined

// release the retained finished-game room and its buffers on lobby return
export async function resetActiveGameRoom() {
  const roomId = lastGameRoom?.roomId ?? rooms.game?.roomId
  // prefer the GAME_END snapshot; fall back to a fresh read for an early leaver
  const summary = pendingSummary ?? captureSummary()
  pendingSummary = undefined
  // drain the in-memory tail before releasing so frames since the last flush aren't lost
  if (roomId) await controller.drain(roomId)
  lastGameRoom = null
  if (roomId) controller.forget(roomId)
  // tell the worker to write the trailer and release the OPFS handle; the file stays on disk
  worker?.postMessage({ type: "close", roomId, summary })
}

// snapshot the POV's end-of-game team and placement for the summary trailer; undefined if unavailable
function captureSummary(): ReplaySummary | undefined {
  try {
    const state = (
      getActiveGameRoom() as unknown as { state?: GameState } | null
    )?.state
    const uid = store.getState().network.uid
    const player = state?.players?.get(uid)
    if (!player) return undefined
    const team: ReplaySummary["team"] = []
    player.board?.forEach((p) => {
      // deployed units only, minus INANIMATE pillars; mirrors the game's doesCountForTeamSize filter
      if (p.positionY > 0 && p.passive !== Passive.INANIMATE)
        team.push({ name: p.name, index: p.index, shiny: p.shiny || undefined })
    })
    const summary: ReplaySummary = {}
    // player.rank is stale for a POV who left before elimination, so derive placement from the alive count
    let aliveCount = 0
    state?.players?.forEach((p) => {
      if (p.alive) aliveCount++
    })
    const rank = deriveFinalRank(player.rank, player.alive, aliveCount)
    if (rank) summary.rank = rank
    if (team.length) summary.team = team
    if (player.name) summary.name = player.name
    return summary.rank || summary.team || summary.name ? summary : undefined
  } catch {
    return undefined
  }
}

// build stamped into each file's header for the viewer's skew warning; assetsVersion discriminates same-version deploys
const GAME_BUILD = {
  version: pkg.version,
  assetsVersion: pkg.assetsVersion,
  serializerId: "schema"
}

// durable flush: capture on the render thread, file I/O to the worker's OPFS ${roomId}.colreplay every ~1s; persists across reconnects
const FLUSH_MS = 1000

let worker: Worker | null = null
let opSeq = 0
// resolver by op id for a request/reply worker op
const pendingOps = new Map<
  number,
  (r: { buf?: ArrayBuffer; files?: ReplayFileInfo[]; error?: string }) => void
>()
// resolver with a hard timeout so a hung worker can't leave the caller's promise pending
const OP_TIMEOUT_MS = 15000
function setPendingOp(
  id: number,
  cb: (r: {
    buf?: ArrayBuffer
    files?: ReplayFileInfo[]
    error?: string
  }) => void
): void {
  const timer = setTimeout(() => {
    if (pendingOps.delete(id)) cb({ error: "recording worker timed out" })
  }, OP_TIMEOUT_MS)
  pendingOps.set(id, (r) => {
    clearTimeout(timer)
    cb(r)
  })
}
function getWorker(): Worker {
  if (!worker) {
    // own esbuild entry at /recorder.worker.js; stable url (new URL(..., import.meta.url) is empty under es2016); classic non-module worker
    worker = new Worker("/recorder.worker.js")
    worker.onmessage = (e: MessageEvent) => {
      const m = e.data
      if (
        m?.type === "downloaded" ||
        m?.type === "listed" ||
        m?.type === "deleted"
      ) {
        const cb = pendingOps.get(m.id)
        if (cb) {
          pendingOps.delete(m.id)
          cb(m)
        }
      } else if (m?.type === "ack") {
        controller.onAck(m.roomId, m.batchId) // batch durable on OPFS, free its frames
      } else if (m?.type === "nack") {
        controller.onNack(m.roomId, m.batchId, m.error) // write failed, keep and resend
      }
    }
    worker.onerror = (e) => {
      console.error("[recorder] worker error", e.message)
      // fail any in-flight op so its UI surfaces an error instead of hanging
      for (const cb of pendingOps.values())
        cb({ error: `recording worker error: ${e.message}` })
      pendingOps.clear()
      controller.onWorkerError() // unblock any awaiting flush so the flush chain can't hang
      // drop the dead worker so the next getWorker() respawns it and resends the in-flight batch
      worker = null
    }
    // seed the retention cap here on spawn, not at install, so recording-off never spawns a worker
    worker.postMessage({ type: "config", keep: preference("keepReplays") })
  }
  return worker
}

// browser download of the .colreplay bytes; filename from recordedAt
function triggerBrowserDownload(buf: BufferSource, recordedAt: string): void {
  const blob = new Blob([buf], { type: "application/octet-stream" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `replay-${recordedAt.replace(/[:.]/g, "-")}.colreplay`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// the whole on-disk ${roomId}.colreplay; shared by download and watch
function fetchReplayBytes(roomId: string): Promise<ArrayBuffer> {
  const id = ++opSeq
  return new Promise<ArrayBuffer>((resolve, reject) => {
    setPendingOp(id, (r) =>
      r.error || !r.buf
        ? reject(new Error(r.error ?? "read failed"))
        : resolve(r.buf)
    )
    getWorker().postMessage({ type: "download", roomId, id })
  })
}

const toReplayFrame = (f: CapturedFrame): ReplayFrame =>
  f.kind === "message"
    ? { t: f.t, kind: "message", type: f.type, payload: f.payload }
    : { t: f.t, kind: f.kind, offset: f.offset, bytes: f.bytes }

// the no-loss flush state machine (ack-before-splice; see recorder-flush-core.ts); we inject the buffers, it owns the bookkeeping
const controller = createFlushController({
  buffers(roomId) {
    // only the active game room is flushed; buffers keyed by serializer/room identity
    const room = getActiveGameRoom()
    if (!room || room.roomId !== roomId) return {}
    const ser = (room as unknown as { serializer?: object }).serializer
    return {
      state: ser ? stateCaptures.get(ser) : undefined,
      msg: msgCaptures.get(room)
    }
  },
  meta(_roomId, recordedAt): ReplayWriterMeta {
    return {
      game: { ...GAME_BUILD },
      room: "game",
      viewerUid: store.getState().network.uid,
      recordedAt
    }
  },
  postFrames(msg) {
    // no transfer: buffers must stay valid if a write fails and the batch resends, so postMessage clones them
    getWorker().postMessage(msg)
  },
  toFrame: toReplayFrame,
  now: () => new Date().toISOString()
})

// flush the active game's new frames; no-op for non-game or replay rooms
function flushRoom(room: Room | null): Promise<void> {
  if (!room || isReplayRoom(room)) return Promise.resolve()
  return controller.flush(room.roomId)
}

const push = (
  map: WeakMap<object, CapturedFrame[]>,
  key: object,
  frame: CapturedFrame
) => {
  let arr = map.get(key)
  if (!arr) map.set(key, (arr = []))
  arr.push(frame)
}

// a ROOM_DATA_BYTES payload is a Uint8Array the SDK may reuse, so slice-copy it; others pass as-is
const serializePayload = (m: unknown): unknown =>
  m instanceof Uint8Array ? m.slice() : m

// taps exclude ReplayRoom's serializer (registered at construction, before rooms.game) for life; else a
// seek's prefix frames buffer into stateCaptures forever, duplicating the replay in RAM
const replaySerializers = new WeakSet<object>()
export function excludeReplaySerializer(ser: object): void {
  replaySerializers.add(ser)
}

// exclude the non-game rooms rather than include only rooms.game: the game handshake decodes during
// client.joinById before joinGame sets rooms.game, so an include test would drop it
const replayRoom = (): object | undefined =>
  isReplayRoom(rooms.game) ? rooms.game : undefined
const isExcludedRoom = (room: object): boolean =>
  room === rooms.lobby ||
  room === rooms.preparation ||
  room === rooms.after ||
  room === replayRoom()
const serializerOf = (room: object | undefined) =>
  (room as unknown as { serializer?: object } | undefined)?.serializer
const isExcludedSerializer = (ser: object): boolean =>
  replaySerializers.has(ser) ||
  ser === serializerOf(rooms.lobby) ||
  ser === serializerOf(rooms.preparation) ||
  ser === serializerOf(rooms.after)

// install the inbound-stream taps; idempotent, call once at app startup before any game join
export function installRecorder() {
  if (installed) return
  // no OPFS means a recording can never persist, so don't patch the SDK prototypes at all
  if (!replaysSupported) return
  installed = true

  const S = SchemaSerializer.prototype as unknown as {
    handshake: (b: Uint8Array, it?: { offset: number }) => unknown
    setState: (b: Uint8Array, it?: { offset: number }) => unknown
    patch: (b: Uint8Array, it?: { offset: number }) => unknown
  }
  // check the decode seam before wrapping: a future SDK rename of these prototype methods would silently detach the taps, so log and skip
  const R0 = Room.prototype as unknown as { dispatchMessage?: unknown }
  if (
    typeof S.handshake !== "function" ||
    typeof S.setState !== "function" ||
    typeof S.patch !== "function" ||
    typeof R0.dispatchMessage !== "function"
  ) {
    console.error(
      "[recorder] Colyseus decode seam not found (SchemaSerializer.handshake/setState/patch or Room.dispatchMessage). Recording disabled; the SDK likely changed its decode path."
    )
    return
  }
  const tap = (
    orig: (b: Uint8Array, it?: { offset: number }) => unknown,
    kind: CapturedFrame["kind"],
    defaultOffset: number
  ) =>
    function (this: object, bytes: Uint8Array, it?: { offset: number }) {
      // best-effort; a failure must never break the live decode, so it falls through to the original
      try {
        if (recordingEnabled && !isExcludedSerializer(this))
          push(stateCaptures, this, {
            t: Date.now(),
            seq: seq++,
            kind,
            offset: it?.offset ?? defaultOffset,
            bytes: bytes.slice() // copy; the SDK reuses the underlying buffer for later messages
          })
      } catch (e) {
        console.error("[recorder] capture failed (live decode unaffected)", e)
      }
      return orig.call(this, bytes, it)
    }
  S.handshake = tap(S.handshake, "handshake", 0)
  S.setState = tap(S.setState, "state", 1)
  S.patch = tap(S.patch, "patch", 1)

  const R = Room.prototype as unknown as {
    dispatchMessage: (t: string | number, m: unknown) => unknown
  }
  const origDispatch = R.dispatchMessage
  R.dispatchMessage = function (
    this: object,
    type: string | number,
    message: unknown
  ) {
    try {
      if (recordingEnabled && rooms.game) lastGameRoom = rooms.game // retain for the after-game download
      if (recordingEnabled && !isExcludedRoom(this))
        push(msgCaptures, this, {
          t: Date.now(),
          seq: seq++,
          kind: "message",
          type,
          payload: serializePayload(message)
        })
      // snapshot the POV's team and placement at GAME_END while state is still live, for the close trailer
      if (recordingEnabled && type === Transfer.GAME_END)
        pendingSummary = captureSummary()
    } catch (e) {
      console.error(
        "[recorder] message capture failed (live dispatch unaffected)",
        e
      )
    }
    return origDispatch.call(this, type, message)
  }

  // keep the capture gate in sync with the options-panel toggle
  subscribeToPreference(
    "recordReplays",
    (v) => {
      recordingEnabled = replaysSupported && v
    },
    true
  )

  // keep the worker's retention cap in sync with keepReplays; don't spawn one for it
  subscribeToPreference(
    "keepReplays",
    (v) => {
      worker?.postMessage({ type: "config", keep: v })
    },
    false
  )

  // ask the browser to persist OPFS so a recording isn't evicted mid-game (best effort)
  void navigator.storage?.persist?.().catch(() => {})

  // periodically flush so a crash can't lose frames; skipped while recording is off
  setInterval(() => {
    if (recordingEnabled) void flushRoom(getActiveGameRoom())
  }, FLUSH_MS)
}

// durably-acked frame count and span for the after-game indicator; may undercount after a crash
export async function getStoredReplayInfo(
  room: Room | undefined
): Promise<{ frames: number; ms: number }> {
  if (!room || isReplayRoom(room)) return { frames: 0, ms: 0 }
  return controller.captureInfo(room.roomId)
}

// flush the in-memory tail, fetch the assembled OPFS file, and download it; no main-thread encode
export async function downloadReplay(
  room: Room,
  _viewerUid: string
): Promise<void> {
  if (!room || isReplayRoom(room)) return
  await controller.drain(room.roomId) // persist and ack every captured frame before reading the file
  const buf = await fetchReplayBytes(room.roomId)
  const recordedAt =
    controller.recordedAt(room.roomId) ?? new Date().toISOString()
  // the OPFS trailer is only written at lobby-return, so append it in-memory here to keep the file self-contained (ensureReplayTrailer no-ops if present)
  const bytes = ensureReplayTrailer(
    new Uint8Array(buf),
    pendingSummary ?? captureSummary()
  )
  triggerBrowserDownload(bytes, recordedAt)
}

// list OPFS recordings newest first; resolves [] if the worker can't enumerate
export function listReplays(): Promise<ReplayFileInfo[]> {
  const id = ++opSeq
  return new Promise<ReplayFileInfo[]>((resolve) => {
    setPendingOp(id, (r) => {
      if (r.error) console.warn("[recorder] listReplays:", r.error)
      resolve(r.files ?? [])
    })
    getWorker().postMessage({ type: "list", id })
  })
}

// load a stored recording into a manifest the viewer plays; the watch path, no file pick
export async function loadStoredReplay(
  roomId: string
): Promise<ReplayManifest> {
  return loadReplay(await fetchReplayBytes(roomId))
}

export async function downloadStoredReplay(
  roomId: string,
  recordedAt: string | null
): Promise<void> {
  triggerBrowserDownload(
    await fetchReplayBytes(roomId),
    recordedAt ?? new Date().toISOString()
  )
}

// delete a stored recording; rejects if it's the active one or the remove fails
export function deleteStoredReplay(roomId: string): Promise<void> {
  const id = ++opSeq
  return new Promise<void>((resolve, reject) => {
    setPendingOp(id, (r) => (r.error ? reject(new Error(r.error)) : resolve()))
    getWorker().postMessage({ type: "delete", roomId, id })
  })
}
