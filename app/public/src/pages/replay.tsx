import type { Room } from "@colyseus/sdk"
import type { User } from "@firebase/auth-types"
import firebase from "firebase/compat/app"
import { type ReactNode, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { FIREBASE_CONFIG } from "../../../config"
import pkg from "../../../../package.json"
import type GameState from "../../../rooms/states/game-state"
import { GamePhaseState } from "../../../types/enum/Game"
import {
  buildReplayIndex,
  nextPhase,
  nextStage,
  prevPhase,
  prevStage,
  type ReplayIndex
} from "../game/replay-index"
import {
  deleteStoredReplay,
  downloadStoredReplay,
  listReplays,
  loadStoredReplay,
  replaysSupported,
  type ReplayFileInfo
} from "../game/recorder"
import {
  detectBuildSkew,
  loadReplay,
  type ReplayManifest,
  type ReplaySummary
} from "../game/replay-format"
import { ReplayRoom } from "../game/replay-room"
import PokemonPortrait from "./component/pokemon-portrait"
import { useAppDispatch, useAppSelector } from "../hooks"
import { rooms } from "../network"
import { usePreference } from "../preferences"
import { leaveGame, setPlayer } from "../stores/GameStore"
import { logIn } from "../stores/NetworkStore"
import ReplayControls from "./component/replay/replay-controls"
import ReplayEventLog from "./component/replay/replay-event-log"
import ReplayErrorBoundary from "./component/replay/replay-error-boundary"
import "./component/replay/replay-readonly.css"
import "./component/replay/replay-ui.css" // all the viewer's UI styles (controls/overlays/library), imported once here for the replay tree
import Game, { getGameContainer, reattachReplayRoom } from "./game"

// this viewer's build, stamped like recorder.ts GAME_BUILD; compared to the recording to warn on skew.
// serializerId is the SchemaSerializer id the recorder also stamps, so a future serializer swap is caught
const RUNNING_BUILD = {
  version: pkg.version,
  assetsVersion: pkg.assetsVersion,
  serializerId: "schema"
}

// own-POV action controls (lock/reroll/buy xp/buy) hit the no-op ReplayRoom.send, clickable but inert; swallow
// their clicks in the capture phase rather than edit those components (board is already read-only via spectate)
const READONLY_CONTROLS =
  ".game-shop-actions .lock-icon," +
  ".game-shop-actions .refresh-button," +
  ".game-experience .buy-xp-button," +
  ".game-pokemons-store .game-pokemon-portrait.clickable," +
  ".game-choice .clickable"

function installReadonlyGuard(): () => void {
  document.body.classList.add("replay-mode")
  const block = (e: Event) => {
    const target = e.target
    if (target instanceof Element && target.closest(READONLY_CONTROLS)) {
      e.stopPropagation()
      e.preventDefault()
    }
  }
  // suppress native context menu: replay overlays sit outside #game-wrapper (the only node the game blocks), so a capture-phase handler stops right-click escaping to the browser menu
  const blockContextMenu = (e: Event) => e.preventDefault()
  document.addEventListener("click", block, true)
  document.addEventListener("contextmenu", blockContextMenu, true)
  return () => {
    document.body.classList.remove("replay-mode")
    document.removeEventListener("click", block, true)
    document.removeEventListener("contextmenu", blockContextMenu, true)
  }
}

// replay viewer: load a `.colreplay`, present it to <Game/> as a ReplayRoom (no server, no re-sim; the recorded
// stream drives the live renderer). sprites come from one-shot onAdd callbacks dropped if state applies pre-boot, so playback waits for gameScene.board
export default function Replay() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [ready, setReady] = useState(false)
  const [needFile, setNeedFile] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [seeking, setSeeking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buildSkew, setBuildSkew] = useState<string | null>(null) // recording build != running build, set at load; shown in the loading overlay
  const [gen, setGen] = useState(0) // keys the mounted <Game/>; bumps only on initial mount (seeks re-attach in place)
  const [showGame, setShowGame] = useState(false)
  const [seekEpoch, setSeekEpoch] = useState(0) // bumps per (re)boot to (re)run the wait-for-scene then startPlayback effect
  const [eventLogOpen, setEventLogOpen] = useState(false)
  const initialized = useRef(false)
  const aliveRef = useRef(true) // false once the route unmounts; guards the deferred index build (see loadManifest)
  const replayRoom = useRef<ReplayRoom | null>(null)
  const manifestRef = useRef<ReplayManifest | null>(null)
  const indexRef = useRef<ReplayIndex | null>(null) // phase/stage/event index, built per manifest, deferred one paint
  const bootPausedRef = useRef(false)
  // board at seek start; re-attach builds a new BoardManager, so wait for board !== prevBoard (not the outgoing scene)
  const prevBoardRef = useRef<unknown>(null)
  // player being watched, carried across a seek to re-centre the same board (else synced spectatedPlayerId drives it); defaults to recording POV
  const spectateTargetRef = useRef<string | null>(null)
  // during a rebuild room.currentMs is stale so phase/stage skips can't accumulate; navigate relative to this until begin() clears it
  const seekTargetRef = useRef<number | null>(null)
  const navMs = () =>
    seekTargetRef.current ?? replayRoom.current?.currentMs ?? 0
  // serialize seeks: stacking scene.start before the first finishes wedges the renderer, so a seek requested
  // meanwhile coalesces into pendingSeek
  const seekInFlightRef = useRef(false)
  const pendingSeekRef = useRef<number | null>(null)

  const params = new URLSearchParams(window.location.search)
  const speed = Number(params.get("speed") ?? "1")
  const startMs = Number(params.get("startMs") ?? "0") // optional deep-link start offset

  // real signed-in identity, captured before boot overwrites network.uid with the recording's POV uid; restore on
  // unmount or the next live game can't resolve "self" (a live game never re-dispatches logIn), a blank-screen crash
  const realUid = useAppSelector((s) => s.network.uid)
  const realDisplayName = useAppSelector((s) => s.network.displayName)
  const realIdentity = useRef<{ uid: string; displayName: string } | null>(null)
  if (realIdentity.current === null && realUid) {
    realIdentity.current = { uid: realUid, displayName: realDisplayName }
  }

  useEffect(installReadonlyGuard, [])

  // full teardown on any /replay exit: restore real uid, reset GameStore (clears the spectated player's stale shop/board), drop the dead room, else it leaks into the next match
  useEffect(() => {
    // a cold page load at /replay skips the login/auth flow, so nothing has initialized the firebase app
    // yet; init it here (no sign-in) or any firebase.auth() access while watching throws app-compat/no-app
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG)
    }
    // re-arm on (re)mount: StrictMode's setup/cleanup/setup sets aliveRef false and refs persist, so without this every deferred buildAndBoot bails
    aliveRef.current = true
    return () => {
      aliveRef.current = false // stop a deferred index build (loadManifest) from booting into this torn-down page
      // stop the current room's timer on every exit: browser-Back's confirmLeave closure holds the initial room, not replayRoom.current, so after a seek a live timer would re-pollute Redux right after we reset it
      replayRoom.current?.pause()
      // restore the real uid: prefer the captured Redux identity (keeps displayName), else firebase.auth().currentUser
      const captured = realIdentity.current
      const fbUser = firebase.auth().currentUser
      const real = captured?.uid
        ? captured
        : fbUser
          ? { uid: fbUser.uid, displayName: fbUser.displayName ?? "" }
          : null
      if (real?.uid)
        dispatch(
          logIn({ uid: real.uid, displayName: real.displayName } as User)
        )
      dispatch(leaveGame(undefined)) // arity-0 reducer; RTK types it as needing an (ignored) payload
      rooms.game = undefined
    }
  }, [])

  // boot at `atMs`: build a fresh ReplayRoom with its decoder fast-forwarded to the target. initial load mounts
  // <Game/> once; a seek re-attaches the live scene onto the fresh room without tearing down Phaser (forward-only decoder, so a back seek re-fast-forwards)
  const boot = (atMs: number, isSeek: boolean) => {
    const manifest = manifestRef.current
    if (!manifest) return
    const prev = replayRoom.current
    const target = Math.max(0, atMs)
    // a seek is still rebuilding: don't stack a second scene.start; record the latest target, begin() applies it as one clean reboot when the in-flight seek lands
    if (isSeek && seekInFlightRef.current) {
      pendingSeekRef.current = target
      seekTargetRef.current = target
      return
    }
    if (isSeek) seekInFlightRef.current = true
    // carry play/pause across a seek, except restarting after the replay ended (finish() leaves it paused+ended, so without the guard a restart would boot paused)
    bootPausedRef.current = isSeek && !prev?.ended ? !!prev?.paused : false
    seekTargetRef.current = target // navigate relative to this until the seek settles (begin() clears it)
    prev?.pause() // stop the outgoing timer so it can't apply frames into the scene being re-attached

    const room = new ReplayRoom(manifest, {
      speed: prev?.getSpeed() ?? speed,
      startMs: target
    })
    replayRoom.current = room
    rooms.game = room as unknown as Room<GameState>
    // who to watch after this (re)boot: keep the current player across a seek (read the live GameContainer first); default to the recording's POV on initial load
    spectateTargetRef.current = isSeek
      ? (getGameContainer()?.player?.id ??
        spectateTargetRef.current ??
        manifest.viewerUid)
      : manifest.viewerUid
    // pre-set the spectated player so the renderer's map/board callbacks target the right player
    const watched =
      room.state?.players?.get(spectateTargetRef.current) ??
      room.state?.players?.get(manifest.viewerUid)
    if (watched) dispatch(setPlayer(watched))
    // a recording spanning a disconnect has a 2nd handshake mid-stream; crossing it during timed playback would freeze the renderer, so re-attach across it via the seek path
    room.onRebindNeeded((ms) => boot(ms, true))
    setSeeking(isSeek)
    setPlaying(false)

    const gc = getGameContainer()
    if (isSeek && gc?.game) {
      // re-attach: remember the outgoing board (the wait-effect tells the fresh scene apart), then re-point at the new room (Phaser kept alive)
      prevBoardRef.current = gc.gameScene?.board ?? null
      reattachReplayRoom(
        room as unknown as Room<GameState>,
        spectateTargetRef.current ?? undefined
      )
    } else {
      // initial load: log in as the recording's viewer so the page resolves "self", then mount <Game/>
      dispatch(
        logIn({
          uid: manifest.viewerUid,
          displayName: manifest.viewerUid
        } as User)
      )
      prevBoardRef.current = null
      setReady(true)
      setShowGame(true)
      setGen((g) => g + 1)
    }
    setSeekEpoch((n) => n + 1) // (re)run the wait-for-scene effect, startPlayback once the board is ready
  }

  const loadManifest = (manifest: ReplayManifest) => {
    manifestRef.current = manifest
    // warn when the recording's build differs (a structural schema change makes per-frame patches throw and skip).
    // the index build below is a synchronous ~5s main-thread block, so commit the skew notice (flushSync) then build after paint (rAF then setTimeout), else it can't paint until done
    const skew = detectBuildSkew(manifest.game, RUNNING_BUILD)
    flushSync(() =>
      setBuildSkew(skew ? t(`replay.skew.${skew.kind}`, { ...skew }) : null)
    )
    // build the index (phase/stage boundaries, eliminations, event log) for the skip controls + log, then boot.
    // aliveRef guards the post-paint window: a route-exit before the build must not boot into a torn-down page
    const buildAndBoot = () => {
      if (!aliveRef.current) return
      try {
        indexRef.current = buildReplayIndex(manifest.frames, manifest.viewerUid)
      } catch (e) {
        console.error("[replay] failed to build index", e)
        indexRef.current = null
      }
      // boot() is off the promise chain, so a corrupt-handshake throw no longer reaches the load .catch; surface it here, else a fatal boot hangs on the overlay forever
      try {
        boot(startMs, false)
      } catch (e) {
        setError(String((e as Error)?.message ?? e))
      }
    }
    requestAnimationFrame(() => setTimeout(buildAndBoot, 0))
  }

  const seekTo = (ms: number) => boot(ms, true)
  const restart = () => boot(0, true)

  // frame-step: forward applies the next update in place; backward is a reboot-seek (decoder is forward-only, no in-place rewind)
  const stepForward = () => replayRoom.current?.stepForward()
  const stepBackward = () => {
    const room = replayRoom.current
    const frames = manifestRef.current?.frames
    if (!room || !frames) return
    room.pause() // frame-stepping implies paused (mirrors stepForward) so the reboot-seek lands paused
    let prevT = 0
    for (const f of frames) {
      if (f.kind === "message") continue
      if (f.t < room.currentMs) prevT = f.t
      else break
    }
    seekTo(prevT)
  }

  const SPEEDS = [0.125, 0.25, 0.5, 1, 2, 4] // keep in sync with replay-controls.tsx's dropdown
  const cycleSpeed = (dir: number) => {
    const room = replayRoom.current
    if (!room) return
    const i = SPEEDS.indexOf(room.getSpeed())
    room.setSpeed(
      // off-list speed: step from 1× (indexOf, so it stays correct if SPEEDS is reordered)
      SPEEDS[
        Math.max(
          0,
          Math.min(SPEEDS.length - 1, (i < 0 ? SPEEDS.indexOf(1) : i) + dir)
        )
      ]
    )
  }

  // keyboard shortcuts, registered in the capture phase to beat the game's in-scene hotkeys (no-ops here anyway)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const room = replayRoom.current
      if (!room) return
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === "INPUT" || tag === "TEXTAREA") return
      const idx = indexRef.current
      const seekIf = (t: number | null) => t != null && seekTo(t)
      let handled = true
      switch (e.key) {
        case " ":
          room.ended ? restart() : room.togglePause()
          break
        case "ArrowRight":
          seekIf(
            idx &&
              (e.shiftKey ? nextStage(idx, navMs()) : nextPhase(idx, navMs()))
          )
          break
        case "ArrowLeft":
          seekIf(
            idx &&
              (e.shiftKey ? prevStage(idx, navMs()) : prevPhase(idx, navMs()))
          )
          break
        case "ArrowUp":
          cycleSpeed(1)
          break
        case "ArrowDown":
          cycleSpeed(-1)
          break
        case "Home":
          seekTo(0)
          break
        case "End":
          seekTo(room.totalMs)
          break
        case ".":
          stepForward()
          break
        case ",":
          stepBackward()
          break
        default:
          handled = false
      }
      if (handled) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener("keydown", onKey, true)
    return () => window.removeEventListener("keydown", onKey, true)
  }, [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const file = params.get("file")
    if (!file) {
      setNeedFile(true) // no served URL, let the player pick/drop a downloaded recording
      return
    }
    fetch(file)
      .then((r) => {
        if (!r.ok) throw new Error(`failed to load ${file}: ${r.status}`)
        return r.arrayBuffer() // bytes, not .json(); loadReplay decodes the CLRP binary container
      })
      .then((buf) => loadManifest(loadReplay(buf)))
      .catch((e) => setError(String(e?.message ?? e)))
  }, [])

  // after each (re)boot, wait for the fresh scene to be render-ready before starting the playback clock (else it
  // advances over a blank screen). gate on the container belonging to the current room so we don't latch onto the scene we just tore down
  useEffect(() => {
    if (!ready) return
    const room = replayRoom.current
    if (!room) return
    let cancelled = false
    let pending: ReturnType<typeof setTimeout> | null = null // the in-flight poll or grace timer
    const t0 = Date.now()
    const begin = (gc: ReturnType<typeof getGameContainer>) => {
      if (cancelled) return
      seekTargetRef.current = null // seek settled; navigate from the live position again
      // a replay is a spectate session: with spectate on, clicking a portrait switches to that board (playerClick gate)
      if (gc) {
        gc.spectate = true
        if (gc.gameScene) gc.gameScene.spectate = true
      }
      // point the scene at the player to watch: startGame() builds off the signed-in user or players[0], not necessarily the right board, so setPlayer() re-centres here (and re-loads its map on a seek)
      const watched = room.state?.players?.get(
        spectateTargetRef.current ?? manifestRef.current?.viewerUid ?? ""
      )
      if (gc && watched) gc.setPlayer(watched)
      room.startPlayback()
      if (bootPausedRef.current) room.pause() // keep a paused scrub paused at the new time
      // mid-fight seek boots with the simulation already populated, so the one-shot onAdd callbacks never fired: build the sprites from the current simulation (idempotent, FIGHT only)
      if (gc?.gameScene?.battle && room.state?.phase === GamePhaseState.FIGHT) {
        gc.gameScene.battle.buildPokemons()
        gc.gameScene.battle.onSimulationStart()
      }
      setPlaying(true)
      // seek settled; release the gate. a meanwhile-requested seek coalesced into pendingSeek, apply it now as one clean reboot (cleared first so boot doesn't re-queue)
      seekInFlightRef.current = false
      const pendingSeek = pendingSeekRef.current
      if (pendingSeek != null) {
        pendingSeekRef.current = null
        boot(pendingSeek, true)
      }
    }
    const waitReady = () => {
      if (cancelled) return
      const gc = getGameContainer()
      const isCurrent = gc?.room === (room as unknown as Room<GameState>)
      const board = gc?.gameScene?.board
      // wait for the current room's scene to build a fresh board (board !== prevBoard), else we latch onto the one we just left; then a short grace (warm re-attach vs cold load), 25s cap
      if (isCurrent && board && board !== prevBoardRef.current) {
        pending = setTimeout(() => begin(gc), prevBoardRef.current ? 600 : 2000)
      } else if (Date.now() - t0 > 25000) {
        begin(gc)
      } else {
        pending = setTimeout(waitReady, 100)
      }
    }
    waitReady()
    return () => {
      cancelled = true
      if (pending) clearTimeout(pending) // don't let a stale poll/grace timer fire begin() after a re-seek
    }
  }, [ready, seekEpoch])

  if (error)
    return (
      <div className="replay-overlay">
        <div className="my-container replay-overlay-card">
          <div className="replay-overlay-title">{t("replay.error_title")}</div>
          <div className="replay-overlay-sub">{error}</div>
        </div>
      </div>
    )
  if (needFile && !ready)
    return (
      <ReplayLibrary
        // swap the library for the spinner before the async read, so it shows while the synchronous index build blocks the main thread
        onLoadStart={() => setNeedFile(false)}
        onManifest={loadManifest}
        onError={(msg) => setError(msg)}
      />
    )
  if (!ready)
    return (
      <div className="replay-overlay">
        <div className="my-container replay-overlay-card">
          <div className="replay-spinner" />
          <div className="replay-overlay-title">{t("replay.loading")}</div>
          <div className="replay-overlay-sub">{t("replay.loading_sub")}</div>
          {buildSkew && (
            <div className="replay-overlay-skew">⚠ {buildSkew}</div>
          )}
        </div>
      </div>
    )
  return (
    <>
      {/* <Game/> mounts once and stays mounted; seeks re-attach in place, so Phaser and its assets persist; `gen` keys a boundary per mount */}
      {showGame && (
        <ReplayErrorBoundary key={gen}>
          <ReplayGameHost />
        </ReplayErrorBoundary>
      )}
      {/* cover the (re)booting scene until playback starts, so a seek doesn't flash the half-built scene */}
      {!playing && (
        <div className="replay-overlay">
          <div className="my-container replay-overlay-card">
            <div className="replay-spinner" />
            <div className="replay-overlay-title">
              {seeking ? t("replay.seeking") : t("replay.loading")}
            </div>
            <div className="replay-overlay-sub">
              {seeking ? t("replay.seeking_sub") : t("replay.loading_sub")}
            </div>
            {/* initial load only (not seeks, else it'd nag on every scrub): warn when the recording's build differs */}
            {buildSkew && !seeking && (
              <div className="replay-overlay-skew">⚠ {buildSkew}</div>
            )}
          </div>
        </div>
      )}
      {replayRoom.current && (
        <ReplayControls
          room={replayRoom.current}
          index={indexRef.current}
          navMs={navMs}
          onSeek={seekTo}
          onRestart={restart}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          eventLogOpen={eventLogOpen}
          onToggleEventLog={() => setEventLogOpen((o) => !o)}
        />
      )}
      {replayRoom.current && (
        <ReplayEventLog
          room={replayRoom.current}
          index={indexRef.current}
          onSeek={seekTo}
          open={eventLogOpen}
          onClose={() => setEventLogOpen(false)}
        />
      )}
    </>
  )
}

// wraps <Game/> and destroys its Phaser game on unmount (the game's own teardown only runs on the live leave flow, which a replay skips)
function ReplayGameHost() {
  useEffect(
    () => () => {
      try {
        getGameContainer()?.game?.destroy(true)
      } catch {
        /* already gone */
      }
    },
    []
  )
  return <Game />
}

// format a recording's timestamp: header recordedAt (real match time), else fallback wall-clock (file mtime); viewer locale
function formatWhen(recordedAt: string | null, fallbackMs: number): string {
  const ms = recordedAt ? Date.parse(recordedAt) : Number.NaN
  return new Date(Number.isFinite(ms) ? ms : fallbackMs).toLocaleString(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  )
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

// a library row's rich summary from the file trailer: placement badge + team portraits; absent on old/foreign recordings (f.summary null)
function RowSummary({ summary }: { summary: ReplaySummary }) {
  const { t } = useTranslation()
  const pkmName = (n: string) => (t as (k: string) => string)(`pkm.${n}`)
  // summary can come from an untrusted file (only guaranteed an object), so coerce every field: a non-array team or non-primitive rank/name would throw in render, a white-screen outside the boundary
  const rank = typeof summary.rank === "number" ? summary.rank : null
  const team = Array.isArray(summary.team) ? summary.team : []
  return (
    <span className="replay-row-summary">
      {rank != null && (
        // placement styled like the profile match history ("Top 1", "Top 7"); reuses the game's own `top` key
        <span className="replay-rank">
          {t("top")} {rank}
        </span>
      )}
      {team.map((u, i) => (
        <PokemonPortrait
          key={`${String(u?.index)}-${i}`}
          className="replay-row-portrait"
          portrait={{ index: String(u?.index ?? ""), shiny: !!u?.shiny }}
          title={pkmName(String(u?.name ?? ""))}
        />
      ))}
    </span>
  )
}

// one recording's summary, shown the same in a library row and the file-picker preview; only the actions differ (passed as `actions`)
function RecordingSummary({
  name,
  recordedAt,
  fallbackMs,
  bytes,
  game,
  summary,
  actions
}: {
  name?: string
  recordedAt: string | null
  fallbackMs: number
  bytes: number
  game?: {
    version: string
    assetsVersion?: string
    serializerId?: string
  } | null
  summary?: ReplaySummary | null
  actions: ReactNode
}) {
  const { t } = useTranslation()
  const skew = game ? detectBuildSkew(game, RUNNING_BUILD) : null
  return (
    <div className="replay-row my-box">
      {/* team portraits go on their own full-width line below so they don't compete with the actions for width */}
      <div className="replay-row-top">
        <div className="replay-row-info">
          {typeof name === "string" && name && (
            <span className="replay-row-name">{name}</span>
          )}
          <span className="replay-row-meta">
            {formatWhen(recordedAt, fallbackMs)} · {formatSize(bytes)}
            {game?.version ? ` · ${game.version}` : ""}
            {skew ? (
              <span className="replay-row-skew">
                {t("replay.library.other_build")}
              </span>
            ) : null}
          </span>
        </div>
        <div className="replay-row-actions">{actions}</div>
      </div>
      {summary ? (
        <RowSummary summary={summary} />
      ) : (
        // same reserved height as a team row so a summary-less recording isn't a short/mismatched row
        <span className="replay-row-meta replay-row-summary">
          {t("replay.library.no_summary")}
        </span>
      )}
    </div>
  )
}

// the /replay landing screen: a library of browser-stored (OPFS) recordings plus open an external `.colreplay`.
// rows watch/download/delete; "keep most recent N" edits the retention pref the recorder's prune honors
function ReplayLibrary({
  onLoadStart,
  onManifest,
  onError
}: {
  onLoadStart: () => void
  onManifest: (m: ReplayManifest) => void
  onError: (msg: string) => void
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [files, setFiles] = useState<ReplayFileInfo[] | null>(null) // null while still listing
  const [busy, setBusy] = useState(false) // a watch/download is in flight; disable row actions
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null) // roomId pending inline confirm
  const [over, setOver] = useState(false) // drag-over highlight for the external-file dropzone
  // two-step external open: choosing/dropping decodes the file (loadReplay) and holds the manifest for a preview; Play then boots it
  const [preview, setPreview] = useState<{
    manifest: ReplayManifest
    name: string
    size: number
    lastModified: number
  } | null>(null)
  const [reading, setReading] = useState(false)
  const [keep, setKeep] = usePreference("keepReplays")
  const [recording] = usePreference("recordReplays")
  const fail = (e: unknown) => onError(String((e as Error)?.message ?? e))

  const refresh = () =>
    listReplays()
      .then(setFiles)
      .catch(() => setFiles([]))
  useEffect(() => {
    void refresh()
  }, [])

  const watchStored = (roomId: string) => {
    onLoadStart()
    loadStoredReplay(roomId).then(onManifest).catch(fail)
  }
  const previewFile = (f: File) => {
    setReading(true)
    f.arrayBuffer()
      .then((b) => {
        setPreview({
          manifest: loadReplay(b),
          name: f.name,
          size: f.size,
          lastModified: f.lastModified
        })
        setReading(false)
      })
      .catch((e) => {
        setReading(false)
        fail(e)
      })
  }
  const playPreview = () => {
    if (!preview) return
    onLoadStart()
    onManifest(preview.manifest)
  }
  const download = (f: ReplayFileInfo) => {
    setBusy(true)
    downloadStoredReplay(f.roomId, f.recordedAt)
      .catch(fail)
      .finally(() => setBusy(false))
  }
  const remove = (roomId: string) => {
    setConfirmDelete(null)
    deleteStoredReplay(roomId).then(refresh).catch(fail)
  }

  return (
    <div className="replay-overlay replay-landing-overlay">
      <div
        className="my-container replay-overlay-card replay-library-card"
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          const f = e.dataTransfer.files?.[0]
          if (f) previewFile(f)
        }}
      >
        <div className="replay-landing-header">
          <button
            className="bubbly blue replay-back-btn"
            onClick={() => navigate("/lobby")}
          >
            {t("back_to_lobby")}
          </button>
          <div className="replay-overlay-title">
            {t("replay.library.title")}
          </div>
        </div>

        <div className="replay-landing-cols">
          <div className="replay-landing-right">
            <div className="replay-library">
              <div className="replay-library-head">
                <span className="replay-library-label">
                  {t("replay.library.saved_here")}
                </span>
                <label className="replay-keep">
                  {t("replay.library.keep_before")}&nbsp;
                  <select
                    value={keep}
                    onChange={(e) => setKeep(Number(e.target.value))}
                  >
                    {[1, 2, 3, 5, 10, 20].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  &nbsp;{t("replay.library.keep_after")}
                </label>
              </div>

              {files === null ? (
                <div className="replay-library-empty">
                  {t("replay.library.loading")}
                </div>
              ) : files.length === 0 ? (
                <div className="replay-library-empty">
                  {!replaysSupported ? (
                    t("replay.library.empty_unsupported")
                  ) : (
                    <>
                      {t("replay.library.empty")}{" "}
                      {recording
                        ? t("replay.library.empty_on")
                        : t("replay.library.empty_off")}
                    </>
                  )}
                </div>
              ) : (
                <ul className="replay-library-list">
                  {files.map((f) => (
                    <li key={f.roomId}>
                      <RecordingSummary
                        name={f.summary?.name}
                        recordedAt={f.recordedAt}
                        fallbackMs={f.mtime}
                        bytes={f.bytes}
                        game={f.game}
                        summary={f.summary}
                        actions={
                          confirmDelete === f.roomId ? (
                            <>
                              <span className="replay-confirm-q">
                                {t("replay.library.delete_q")}
                              </span>
                              <button
                                className="bubbly red replay-row-btn"
                                onClick={() => remove(f.roomId)}
                              >
                                {t("yes")}
                              </button>
                              <button
                                className="bubbly replay-row-btn"
                                onClick={() => setConfirmDelete(null)}
                              >
                                {t("no")}
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="bubbly blue replay-row-btn"
                                disabled={busy}
                                onClick={() => watchStored(f.roomId)}
                              >
                                ▶ {t("replay.library.watch")}
                              </button>
                              <button
                                className="bubbly replay-row-btn"
                                disabled={busy}
                                title={t("replay.library.download_tip")}
                                onClick={() => download(f)}
                              >
                                ⬇
                              </button>
                              <button
                                className="bubbly replay-row-btn"
                                title={t("delete")}
                                onClick={() => setConfirmDelete(f.roomId)}
                              >
                                🗑
                              </button>
                            </>
                          )
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="replay-landing-left">
            {/* mirrors the right column's head so the picker/preview top lines up with the first library row */}
            <div className="replay-library-head">
              <span className="replay-library-label">
                {t("replay.library.open_file")}
              </span>
            </div>
            {/* fixed-height slot so swapping dropzone and preview doesn't jitter the card */}
            <div className="replay-pick-slot">
              {preview ? (
                // name falls back to the filename when the file has no trailer
                <RecordingSummary
                  name={preview.manifest.summary?.name ?? preview.name}
                  recordedAt={preview.manifest.recordedAt ?? null}
                  fallbackMs={preview.lastModified}
                  bytes={preview.size}
                  game={preview.manifest.game}
                  summary={preview.manifest.summary}
                  actions={
                    <>
                      <button
                        className="bubbly blue replay-row-btn"
                        onClick={playPreview}
                      >
                        ▶ {t("replay.library.watch")}
                      </button>
                      <button
                        className="bubbly replay-row-btn"
                        onClick={() => setPreview(null)}
                      >
                        {t("replay.library.choose_another")}
                      </button>
                    </>
                  }
                />
              ) : (
                <div className={`replay-dropzone${over ? " over" : ""}`}>
                  <div className="replay-overlay-sub">
                    {reading ? (
                      t("replay.library.reading")
                    ) : (
                      <>
                        {t("replay.library.dropzone_pre")}{" "}
                        <code>.colreplay</code>{" "}
                        {t("replay.library.dropzone_post")}
                      </>
                    )}
                  </div>
                  <label className="bubbly blue replay-file-label">
                    {t("replay.library.choose_file")}
                    <input
                      type="file"
                      accept=".json,.colreplay,application/json"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) previewFile(f)
                      }}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* inline emphasis is flattened into translation values (one key per paragraph/li): PAC has no <Trans> in app UI */}
            <div className="replay-limitations">
              <div className="replay-limitations-title">
                {t("replay.about.title")}
              </div>
              {/* storage/download heads-up leads on purpose: a saved list looks cloud-stored, so "these live in your browser" goes first */}
              <p className="replay-limitations-lead">
                {t("replay.about.storage")}
              </p>
              <p>{t("replay.about.storage_detail")}</p>
              <div className="replay-limitations-subtitle">
                {t("replay.about.recording_title")}
              </div>
              <p>{t("replay.about.rec_intro")}</p>
              <ul>
                <li>{t("replay.about.rec_shop")}</li>
                <li>{t("replay.about.rec_combat")}</li>
                <li>{t("replay.about.rec_income")}</li>
                <li>{t("replay.about.rec_gap")}</li>
              </ul>
              <div className="replay-limitations-subtitle">
                {t("replay.about.playback_title")}
              </div>
              <p>{t("replay.about.play_rebuild")}</p>
              <ul>
                <li>{t("replay.about.play_sound")}</li>
                <li>{t("replay.about.play_speed")}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
