import {
  encodeFrameV1,
  encodeHeaderV1,
  encodeReplayTrailer,
  type ReplayFrame,
  type ReplayManifest,
  type ReplaySummary,
  trailerByteLength
} from "./replay-format"

// streams a v1 .colreplay to a sync handle as frames arrive; an empty file gets a header, a reopened one is appended

// subset of FileSystemSyncAccessHandle we need (fakeable in tests)
export interface ReplayFileHandle {
  write(buffer: Uint8Array, opts?: { at?: number }): number
  getSize(): number
  flush(): void
  close(): void
  // shrink to newSize, rolling back a failed batch write. optional (older fakes lack it)
  truncate?(newSize: number): void
  // read at opts.at; used on resume to detect + strip an EOF trailer. optional (older fakes lack it)
  read?(buffer: Uint8Array, opts?: { at?: number }): number
}

// resume tail-read window; any summary trailer fits (< 1 KB), so no whole-file read
const RESUME_TAIL_SCAN = 64 * 1024

export type ReplayWriterMeta = Pick<
  ReplayManifest,
  "game" | "room" | "viewerUid" | "recordedAt"
>

export class ReplayFileWriter {
  private offset: number
  // threads tDelta across appends; null at open, so the next frame starts at delta 0 and a reopened file resumes its own timeline
  private prevT: number | null = null
  private framesWritten = 0
  private readonly resumed: boolean

  constructor(
    private readonly handle: ReplayFileHandle,
    opts: { meta: ReplayWriterMeta }
  ) {
    const size = handle.getSize()
    if (size === 0) {
      const header = encodeHeaderV1(opts.meta)
      handle.write(header, { at: 0 })
      this.offset = header.length
      this.resumed = false
    } else {
      // a reopened file sealed with an EOF trailer must have it stripped first, or the decoder mis-bounds the appended half and loses it
      this.offset = this.stripResumeTrailer(size)
      this.resumed = true
    }
  }

  // on resume, truncate off an EOF summary trailer so appends land after the last frame. best-effort (needs read + truncate)
  private stripResumeTrailer(size: number): number {
    if (!this.handle.read || !this.handle.truncate) return size
    const tailLen = Math.min(size, RESUME_TAIL_SCAN)
    const tail = new Uint8Array(tailLen)
    let got: number
    try {
      got = this.handle.read(tail, { at: size - tailLen })
    } catch (e) {
      console.error(
        "[colreplay] resume tail read failed; appending without trailer strip",
        e
      )
      return size
    }
    const trailerLen = trailerByteLength(tail.subarray(0, got))
    if (trailerLen == null) return size
    const newSize = size - trailerLen
    try {
      this.handle.truncate(newSize)
    } catch (e) {
      console.error(
        "[colreplay] resume trailer truncate failed; appending without trailer strip",
        e
      )
      return size
    }
    return newSize
  }

  // one atomic write per batch: on a throw/short write, roll back so the caller can safely resend the same batch (no-loss)
  appendFrames(frames: ReplayFrame[]): void {
    if (frames.length === 0) return
    const startOffset = this.offset
    const startPrevT = this.prevT
    let prevT = this.prevT
    let total = 0
    const parts: Uint8Array[] = []
    for (const f of frames) {
      const { bytes, t } = encodeFrameV1(f, prevT)
      parts.push(bytes)
      total += bytes.length
      prevT = t
    }
    const buf = new Uint8Array(total)
    let at = 0
    for (const p of parts) {
      buf.set(p, at)
      at += p.length
    }

    let written: number
    try {
      written = this.handle.write(buf, { at: startOffset })
    } catch (e) {
      this.rollback(startOffset, startPrevT)
      throw e
    }
    if (written !== buf.length) {
      this.rollback(startOffset, startPrevT)
      throw new Error(
        `ReplayFileWriter: short write ${written}/${buf.length} B`
      )
    }
    this.offset = startOffset + buf.length
    this.prevT = prevT
    this.framesWritten += frames.length
  }

  private rollback(offset: number, prevT: number | null): void {
    try {
      this.handle.truncate?.(offset)
    } catch (e) {
      console.error("[colreplay] rollback truncate failed", e)
    }
    this.offset = offset
    this.prevT = prevT
  }

  flush(): void {
    this.handle.flush()
  }

  // EOF match-summary footer, written once at close; guarded so a failure leaves the recording trailer-less rather than lost
  writeTrailer(summary: ReplaySummary): void {
    const at = this.offset
    try {
      // encode inside the try: a malformed summary must not throw here, or close() is skipped and the exclusive OPFS lock leaks
      const bytes = encodeReplayTrailer(summary)
      const written = this.handle.write(bytes, { at })
      if (written !== bytes.length) {
        this.handle.truncate?.(at) // partial footer corrupts the tail read, so drop it
        return
      }
      this.offset += bytes.length
    } catch (e) {
      console.error(
        "[colreplay] trailer write failed (recording kept, no summary)",
        e
      )
      try {
        this.handle.truncate?.(at)
      } catch {
        /* best effort */
      }
    }
  }

  // flush in try/finally so a flush throw still releases the handle, else the OPFS lock leaks for the page session
  close(): void {
    try {
      this.handle.flush()
    } finally {
      this.handle.close()
    }
  }

  get size(): number {
    return this.offset
  }

  // frames appended by this writer (not a resumed prefix)
  get count(): number {
    return this.framesWritten
  }

  get isResumed(): boolean {
    return this.resumed
  }
}
