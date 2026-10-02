import type { ReplayWriterMeta } from "./opfs-replay-writer"
import type { ReplayFrame } from "./replay-format"

// render-thread side of the no-loss recorder; browser APIs are injected via FlushDeps so it's testable in isolation.
// a captured frame leaves the buffer only once the worker acks it durable on OPFS. a stop-and-wait loop keeps one
// unacked batch per room: on ack, splice the batch off the front of the buffers, since frames captured mid-flush went
// to the back and survive; on nack, keep it in flight under the same batchId so the worker dedups the resend. frames
// buffer in memory rather than drop, the deliberate no-loss trade.

// buffered captured frame; core only touches `seq` (merges state + message into one ordered batch) + what toFrame() reads
export interface CapturedFrame {
  t: number
  seq: number
  kind: "handshake" | "state" | "patch" | "message"
  offset?: number
  bytes?: Uint8Array
  type?: string | number
  payload?: unknown
}

// a room's live capture arrays: the same instances the taps push into, so onAck splices acked frames out in place
interface FlushBuffers {
  state?: CapturedFrame[]
  msg?: CapturedFrame[]
}

interface FlushDeps {
  buffers(roomId: string): FlushBuffers
  meta(roomId: string, recordedAt: string): ReplayWriterMeta
  // don't transfer the buffers; they must survive in memory for a resend on nack
  postFrames(msg: {
    type: "frames"
    roomId: string
    meta: ReplayWriterMeta
    frames: ReplayFrame[]
    batchId: number
  }): void
  toFrame(frame: CapturedFrame): ReplayFrame
  now(): string // injectable for deterministic tests
}

interface PendingBatch {
  batchId: number
  roomId: string
  sLen: number
  mLen: number
  sBuf?: CapturedFrame[]
  mBuf?: CapturedFrame[]
  frames: ReplayFrame[] // retained verbatim for a resend on nack
  frameCount: number
  firstT: number
  lastT: number
  meta: ReplayWriterMeta
  settle?: (ok: boolean) => void
}

interface Tally {
  frames: number
  firstT: number
  lastT: number
  recordedAt: string
}

export function createFlushController(deps: FlushDeps) {
  // at most one unacked batch per room (stop-and-wait); keyed by roomId so a resend finds the retained batch
  const inFlight = new Map<string, PendingBatch>()
  // after-game indicator tally; counts only durably-acked frames so it never over-reports
  const tally = new Map<string, Tally>()
  let batchSeq = 0
  let flushChain: Promise<void> = Promise.resolve()

  function ensureTally(roomId: string): Tally {
    let t = tally.get(roomId)
    if (!t) {
      t = { frames: 0, firstT: 0, lastT: 0, recordedAt: deps.now() }
      tally.set(roomId, t)
    }
    return t
  }

  async function flushImpl(roomId: string): Promise<void> {
    // a batch already in flight from a prior nack: resend it verbatim under the same batchId so the worker dedups; building a fresh one would reorder or duplicate frames
    let b = inFlight.get(roomId)
    if (!b) {
      const { state, msg } = deps.buffers(roomId)
      const sLen = state?.length ?? 0
      const mLen = msg?.length ?? 0
      if (sLen + mLen === 0) return
      const merged = [
        ...(state ?? []).slice(0, sLen),
        ...(msg ?? []).slice(0, mLen)
      ].sort((x, y) => x.seq - y.seq)
      const frames = merged.map(deps.toFrame)
      const t = ensureTally(roomId)
      b = {
        batchId: ++batchSeq,
        roomId,
        sLen,
        mLen,
        sBuf: state,
        mBuf: msg,
        frames,
        frameCount: frames.length,
        firstT: frames.length ? frames[0].t : 0,
        lastT: frames.length ? frames[frames.length - 1].t : 0,
        meta: deps.meta(roomId, t.recordedAt)
      }
      inFlight.set(roomId, b)
    }
    const settled = new Promise<boolean>((res) => {
      b!.settle = res
    })
    deps.postFrames({
      type: "frames",
      roomId,
      meta: b.meta,
      frames: b.frames,
      batchId: b.batchId
    })
    await settled
  }

  // send or resend one batch, resolving on the worker's ack/nack. serialized through flushChain so only one is in flight; never throws
  function flush(roomId: string): Promise<void> {
    flushChain = flushChain
      .then(() => flushImpl(roomId))
      .catch((e) => console.error("[recorder] flush failed", e))
    return flushChain
  }

  // worker confirmed on disk: splice the batch's frames out of the live buffers + roll the tally
  function onAck(roomId: string, batchId: number): void {
    const b = inFlight.get(roomId)
    if (!b || b.batchId !== batchId) return // stale/duplicate ack
    inFlight.delete(roomId)
    // the batch took the first sLen/mLen; mid-flush frames went to the back, so front-splice drops exactly this batch
    b.sBuf?.splice(0, b.sLen)
    b.mBuf?.splice(0, b.mLen)
    const t = ensureTally(roomId)
    if (t.frames === 0 && b.frameCount) t.firstT = b.firstT
    t.frames += b.frameCount
    if (b.frameCount) t.lastT = b.lastT
    b.settle?.(true)
  }

  // worker rejected the batch (nothing persisted): keep it in flight to resend, splice nothing
  function onNack(roomId: string, batchId: number, error?: string): void {
    const b = inFlight.get(roomId)
    if (!b || b.batchId !== batchId) return
    console.error("[recorder] worker rejected a frame batch; will retry", error)
    const settle = b.settle
    b.settle = undefined
    settle?.(false) // unblock the awaiting flush; b stays in inFlight so the next flush resends it
  }

  // worker died: unblock any awaiting flush so flushChain can't hang. the batch stays in flight, frames stay buffered, nothing lost
  function onWorkerError(): void {
    for (const b of inFlight.values()) {
      const settle = b.settle
      b.settle = undefined
      settle?.(false)
    }
  }

  // flush until everything for roomId is durably acked (before a download). bounded: give up after 50 tries on persistent nack (quota)
  async function drain(roomId: string): Promise<void> {
    for (let i = 0; i < 50; i++) {
      await flush(roomId)
      const { state, msg } = deps.buffers(roomId)
      const remaining = (state?.length ?? 0) + (msg?.length ?? 0)
      if (!inFlight.has(roomId) && remaining === 0) return
    }
    console.warn(
      "[recorder] drain gave up with frames still unacked; download serves what reached disk"
    )
  }

  function captureInfo(roomId: string): { frames: number; ms: number } {
    const t = tally.get(roomId)
    return t
      ? { frames: t.frames, ms: Math.max(0, t.lastT - t.firstT) }
      : { frames: 0, ms: 0 }
  }

  function recordedAt(roomId: string): string | undefined {
    return tally.get(roomId)?.recordedAt
  }

  // drop a finished room's state on lobby return. settle any awaiting batch first: a parked flushImpl sits on `await settled`,
  // so dropping it unsettled wedges flushChain forever and every later flush or drain silently never runs
  function forget(roomId: string): void {
    const b = inFlight.get(roomId)
    if (b) {
      const settle = b.settle
      b.settle = undefined
      settle?.(false)
    }
    inFlight.delete(roomId)
    tally.delete(roomId)
  }

  return {
    flush,
    onAck,
    onNack,
    onWorkerError,
    drain,
    captureInfo,
    recordedAt,
    forget
  }
}
