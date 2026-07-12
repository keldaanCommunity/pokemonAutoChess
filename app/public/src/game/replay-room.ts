import { SchemaSerializer } from "@colyseus/sdk"
import type { Iterator } from "@colyseus/schema"
import type GameState from "../../../rooms/states/game-state"
import { excludeReplaySerializer } from "./recorder"
import type { ReplayFrame, ReplayManifest } from "./replay-format"
import { REPLAY_ROOM_ID } from "./replay-room-id"

// plays a recorded match through the existing client renderer, no live server: a real SchemaSerializer seeded
// from the recorded handshake frame (schema reflection, so no live connection), initial state applied, then
// patch frames on a timer. fires the same decoder callbacks the renderer subscribes to; implements the subset of the Colyseus Room surface the page reads

type Handler = (...args: any[]) => void

export class ReplayRoom {
  readonly serializer = new SchemaSerializer<GameState>()
  readonly roomId = REPLAY_ROOM_ID
  readonly sessionId = "replay"
  readonly name = "game"
  reconnectionToken = "replay"
  hasJoined = true
  connection = { isOpen: true, close: () => {} }

  readonly manifest: ReplayManifest
  readonly totalMs: number
  // first LOADING_COMPLETE broadcast is roughly game start; re-bases the scrubber so 0:00 is game start not recording start
  readonly gameStartMs: number
  private queue: ReplayFrame[] = []
  private idx = 0
  private timer: ReturnType<typeof setTimeout> | null = null
  private baseSpeed: number // the user-chosen speed (0.5-8×)
  private startMs: number
  private started = false
  private revealed = false
  private revealScheduled = false
  private preloadMapsPayload: unknown = null // PRELOAD_MAPS captured during a seek fast-forward (see above)
  // exposed for the replay-controls UI (polled):
  currentMs = 0
  paused = false
  ended = false
  private endedHandlers = new Set<() => void>()
  // reconnect boundary during playback (2nd handshake mid-stream): the page must re-attach, not apply it, since a 2nd handshake builds a new decoder that orphans the renderer's callbacks
  private rebindHandlers = new Set<(ms: number) => void>()

  // listener registries mirror Colyseus Room emitters
  private messageHandlers = new Map<string | number, Set<Handler>>()
  private stateChangeHandlers = new Set<Handler>()
  private leaveHandlers = new Set<Handler>()
  private errorHandlers = new Set<Handler>()
  private dropHandlers = new Set<Handler>()
  private reconnectHandlers = new Set<Handler>()

  constructor(
    manifest: ReplayManifest,
    opts: { speed?: number; startMs?: number } = {}
  ) {
    // exclude our serializer from the recorder before decoding below, else the fast-forward re-buffers this replay's own bytes
    excludeReplaySerializer(this.serializer)
    this.manifest = manifest
    this.baseSpeed = opts.speed && opts.speed > 0 ? opts.speed : 1
    this.startMs = opts.startMs && opts.startMs > 0 ? opts.startMs : 0
    this.totalMs = manifest.frames.length
      ? manifest.frames[manifest.frames.length - 1].t
      : 0
    this.gameStartMs =
      manifest.frames.find(
        (f) => f.kind === "message" && f.type === "LOADING_COMPLETE"
      )?.t ?? 0

    // apply handshake + initial state synchronously so room.state is populated before the page mounts; everything else queued
    const frames = manifest.frames
    const firstStateIdx = frames.findIndex((f) => f.kind === "state")
    for (let i = 0; i < frames.length; i++) {
      const f = frames[i]
      if (
        i <= firstStateIdx &&
        (f.kind === "handshake" || f.kind === "state")
      ) {
        this.applyFrame(f)
      } else {
        this.queue.push(f)
      }
    }

    // advance the state before the scene boots so startGame() reads the already-advanced map: a seek lands at its target, a fresh load on the opening carousel
    if (this.startMs > 0) this.fastForwardStateTo(this.startMs)
    else this.skipLoadingPhase()
  }

  // constructor-time fast-forward for a seek: advance the decoder state to ms, no renderer attached. pre-t messages
  // are transient except PRELOAD_MAPS; stash its payload to re-emit in startPlayback, else the region map renders black
  private fastForwardStateTo(ms: number) {
    while (this.idx < this.queue.length && this.queue[this.idx].t <= ms) {
      const f = this.queue[this.idx]
      try {
        if (f.kind === "message") {
          if (f.type === "PRELOAD_MAPS") this.preloadMapsPayload = f.payload
        } else {
          this.applyFrame(f)
        }
      } catch (e) {
        // a bad frame must not throw out of the constructor (a seek calls boot() from a UI handler, so a throw dead-ends it silently); skip and keep going
        console.error("[replay] fast-forward frame error (skipped)", e)
      }
      this.currentMs = f.t
      this.idx++
    }
  }

  get state(): GameState {
    return this.serializer.getState()
  }

  private applyFrame(f: ReplayFrame) {
    if (f.kind === "message") {
      this.emitMessage(f.type!, f.payload)
      return
    }
    const bytes = f.bytes ?? new Uint8Array(0)
    const it: Iterator = { offset: f.offset ?? 1 }
    if (f.kind === "handshake") this.serializer.handshake(bytes, it)
    else if (f.kind === "state") this.serializer.setState(bytes, it)
    else if (f.kind === "patch") this.serializer.patch(bytes, it)
  }

  private fire(set: Set<Handler>, ...args: any[]) {
    set.forEach((h) => {
      try {
        h(...args)
      } catch (e) {
        // a renderer callback throwing must not halt playback
        console.error("[replay] handler error", e)
      }
    })
  }

  private emitMessage(type: string | number, payload?: unknown) {
    this.messageHandlers.get(type)?.forEach((h) => {
      try {
        h(payload)
      } catch (e) {
        console.error("[replay] message handler error", e)
      }
    })
  }

  // reveal the game UI without playing: LOADING_COMPLETE lifts the loading overlay and boots the Phaser scene. must
  // run before playing; the scene (gameScene.board, needed for sprites) only exists once revealed
  reveal() {
    if (this.revealed) return
    this.revealed = true
    this.emitMessage("LOADING_COMPLETE")
  }

  // begin playing queued frames at the recorded cadence; idempotent. caller waits until the scene's board exists so one-shot onAdd callbacks land on a live renderer
  startPlayback() {
    if (this.started) return
    this.started = true
    this.reveal()
    // re-emit the stashed PRELOAD_MAPS now that the scene's onMessage handlers exist so the region tilemaps load, then play
    if (this.preloadMapsPayload != null) {
      this.emitMessage("PRELOAD_MAPS", this.preloadMapsPayload)
    }
    this.scheduleNext()
  }

  // constructor-time skip of the pre-game loading wait to the opening carousel, no renderer attached. detect start by
  // the carousel minigame being live (avatars present), not stageLevel, which reaches 1 only after the ~23s carousel; the stageLevel fallback guards a recording that opens past it
  private skipLoadingPhase() {
    let guard = 0
    const gameStarted = () =>
      (this.state?.avatars?.size ?? 0) > 0 || (this.state?.stageLevel ?? 1) >= 1
    while (
      this.idx < this.queue.length &&
      !gameStarted() &&
      guard++ < this.queue.length
    ) {
      const f = this.queue[this.idx]
      try {
        if (f.kind === "message") {
          if (f.type === "PRELOAD_MAPS") this.preloadMapsPayload = f.payload
        } else {
          this.applyFrame(f)
        }
      } catch (e) {
        // as in fastForwardStateTo, a bad frame must not throw out of the constructor; skip and continue
        console.error("[replay] skip-loading frame error (skipped)", e)
      }
      this.currentMs = f.t
      this.idx++
    }
  }

  private applyNext(): boolean {
    if (this.idx >= this.queue.length) return false
    const f = this.queue[this.idx]
    try {
      this.applyFrame(f)
      this.currentMs = f.t
      if (f.kind !== "message") this.fire(this.stateChangeHandlers, this.state)
    } catch (e) {
      // a render callback throws synchronously inside patch; this runs in the playback setTimeout, so an uncaught throw would kill the timer and stop playback. skip and keep going
      console.error("[replay] frame apply error (skipped)", e)
      this.currentMs = f.t
    }
    this.idx++
    return true
  }

  private scheduleNext() {
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
    if (this.paused || this.ended) return
    const next = this.queue[this.idx]
    if (!next) {
      this.finish()
      return
    }
    // reconnect boundary: a queued handshake is a 2nd one, don't apply it; ask the page to re-attach past it, collapsing the outage gap. no handler wired (unit test) falls through and applies
    if (next.kind === "handshake" && this.rebindHandlers.size > 0) {
      this.rebindHandlers.forEach((h) => h(this.rebindTargetAt()))
      return
    }
    const dt = Math.max(0, (next.t - this.currentMs) / this.baseSpeed)
    this.timer = setTimeout(() => {
      if (this.paused || this.ended) return
      if (!this.applyNext()) this.finish()
      else this.scheduleNext()
    }, dt)
  }

  // graceful end: stop and notify; don't fire onLeave (would trigger the client's "connection failed" disconnect UI)
  private finish() {
    if (this.ended) return
    this.ended = true
    this.paused = true
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
    this.endedHandlers.forEach((h) => h())
  }

  // replay controls (driven by ReplayControls)
  pause() {
    if (this.ended) return
    this.paused = true
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
  }

  resume() {
    if (this.ended || !this.paused) return
    this.paused = false
    this.scheduleNext()
  }

  togglePause() {
    this.paused ? this.resume() : this.pause()
  }

  setSpeed(speed: number) {
    if (speed > 0) this.baseSpeed = speed
    if (!this.paused && !this.ended) this.scheduleNext()
  }

  getSpeed() {
    return this.baseSpeed
  }

  // frame-step forward one visible update while paused: apply frames until one state/patch lands. backward stepping is a reboot-seek (decoder is forward-only) in replay.tsx
  stepForward(): boolean {
    if (this.ended) return false
    this.pause()
    let advanced = false
    while (this.idx < this.queue.length) {
      const kind = this.queue[this.idx].kind
      if (kind === "handshake" && this.rebindHandlers.size > 0) {
        this.rebindHandlers.forEach((h) => h(this.rebindTargetAt())) // reconnect boundary, re-attach
        break
      }
      if (!this.applyNext()) break
      advanced = true
      if (kind !== "message") break // stop after one real state update
    }
    return advanced
  }

  // seek target for a reconnect boundary: the t of the reconnect's full-state frame, so a re-attach fast-forwards through handshake2+state2 (no renderer) and resumes just after it
  private rebindTargetAt(): number {
    for (let j = this.idx; j < this.queue.length; j++) {
      if (this.queue[j].kind === "state") return this.queue[j].t
    }
    return this.queue[this.idx]?.t ?? this.currentMs
  }

  onRebindNeeded(cb: (ms: number) => void) {
    this.rebindHandlers.add(cb)
    return () => this.rebindHandlers.delete(cb)
  }

  // seeking is handled by replay.tsx rebooting a fresh ReplayRoom at the target (both directions); no in-place seek, the decoder is forward-only and rewinding would desync the bound renderer

  onEnded(cb: () => void) {
    this.endedHandlers.add(cb)
    if (this.ended) cb()
    return () => this.endedHandlers.delete(cb)
  }

  // once game.tsx has registered its onMessage handlers, reveal the UI next tick so the scene can boot; playback starts later, after the board exists
  private maybeReveal() {
    if (this.revealed || this.revealScheduled) return
    this.revealScheduled = true
    setTimeout(() => this.reveal(), 0)
  }

  // Colyseus Room API subset
  onMessage(type: string | number, cb: Handler) {
    if (!this.messageHandlers.has(type))
      this.messageHandlers.set(type, new Set())
    this.messageHandlers.get(type)!.add(cb)
    this.maybeReveal()
    return () => this.messageHandlers.get(type)?.delete(cb)
  }

  onStateChange(cb: Handler) {
    this.stateChangeHandlers.add(cb)
    return () => this.stateChangeHandlers.delete(cb)
  }

  onLeave(cb: Handler) {
    this.leaveHandlers.add(cb)
    return () => this.leaveHandlers.delete(cb)
  }

  onError(cb: Handler) {
    this.errorHandlers.add(cb)
    return () => this.errorHandlers.delete(cb)
  }

  onDrop(cb: Handler) {
    this.dropHandlers.add(cb)
    return () => this.dropHandlers.delete(cb)
  }

  onReconnect(cb: Handler) {
    this.reconnectHandlers.add(cb)
    return () => this.reconnectHandlers.delete(cb)
  }

  // inbound player commands are meaningless in a replay, so swallow them except LOADING_COMPLETE: the GameScene sends
  // it once assets load; mirror the server's broadcast so startGame() runs on every (re)mount, else a seek-remount renders nothing
  send(type: string | number, _message?: unknown) {
    if (type === "LOADING_COMPLETE") this.emitMessage("LOADING_COMPLETE")
  }
  sendBytes(_type: string | number, _bytes?: unknown) {}

  removeAllListeners() {
    this.messageHandlers.clear()
    this.stateChangeHandlers.clear()
    this.leaveHandlers.clear()
    this.errorHandlers.clear()
    this.dropHandlers.clear()
    this.reconnectHandlers.clear()
  }

  async leave(_consented = true): Promise<number> {
    if (this.timer) clearTimeout(this.timer)
    this.timer = null
    this.connection.isOpen = false
    this.fire(this.leaveHandlers, 1000)
    return 1000
  }
}
