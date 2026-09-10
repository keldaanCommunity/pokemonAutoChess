import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { phaseWord } from "../../../game/replay-event-format"
import {
  nextPhase,
  nextStage,
  prevPhase,
  prevStage,
  type ReplayIndex,
  segmentAt,
  segmentBandKind
} from "../../../game/replay-index"
import type { ReplayRoom } from "../../../game/replay-room"

// overlay controls for the replay viewer: play/pause, scrub, speed, skip-by-phase/stage, timeline, frame-step.
// polls the ReplayRoom (which owns playback timing), styled with the game's classes; skip buttons/markers/bands come from a derived transcript index (replay-index.ts), else a plain scrubber

// dropdown playback speeds (matches replay.tsx's keyboard-cycle SPEEDS); capped at 4×, higher can't be sustained (render-bound) and a silently-throttling control is worse than none
const SPEEDS = [0.125, 0.25, 0.5, 1, 2, 4]
const POS_KEY = "replay.controls.pos"
const LAYOUT_KEY = "replay.controls.layout" // not POS_KEY: older builds read any object there as a position
const DOCK_GAP = 8 // px gap between the bar's bottom edge and the shop's top when default-docked
const MIN_TRACK_H = 8
const MAX_TRACK_H = 96
const AXIS_DEADZONE = 3 // px, so jitter on a vertical drag doesn't pin the width

// the children can't wrap, so their measured widths are already their minimums
const contentWidth = (el: Element) => {
  const kids = [...el.children]
  const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0
  return (
    kids.reduce((sum, k) => sum + k.getBoundingClientRect().width, 0) +
    gap * Math.max(0, kids.length - 1)
  )
}

// measured, not a constant: it moves with the font-size and the translated labels
const rowFloor = (bar: HTMLElement) => {
  const row = bar.querySelector(".replay-controls-bar")
  if (!row) return 0
  const tracks = [...row.children].map(contentWidth)
  if (tracks.length !== 3) return 0
  const gap = Number.parseFloat(getComputedStyle(row).columnGap) || 0
  const cs = getComputedStyle(bar)
  return Math.ceil(
    2 * Math.max(tracks[0], tracks[2]) + // the 1fr sides are equal, so the wider one sets both
      tracks[1] +
      2 * gap +
      Number.parseFloat(cs.paddingLeft) +
      Number.parseFloat(cs.paddingRight) +
      Number.parseFloat(cs.borderLeftWidth) +
      Number.parseFloat(cs.borderRightWidth)
  )
}

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}
// speed label: sub-1× speeds read as fractions (1/8× not 0.125×); whole multipliers stay N×
const speedLabel = (s: number) => (s < 1 ? `1/${Math.round(1 / s)}×` : `${s}×`)
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v))

type SavedBox = {
  x?: number
  y?: number
  w?: number
  trackH?: number
  minimized?: boolean
}
const readKey = (key: string): SavedBox => {
  try {
    const b = JSON.parse(localStorage.getItem(key) || "null")
    return b && typeof b === "object" && !Array.isArray(b) ? b : {}
  } catch {
    return {}
  }
}
const readBox = (): SavedBox => {
  const { x, y } = readKey(POS_KEY)
  return { ...readKey(LAYOUT_KEY), x, y }
}
const finite = (v: unknown) =>
  typeof v === "number" && Number.isFinite(v) ? v : null
const trackHeight = (v: unknown) => {
  const h = finite(v)
  return h === null ? null : clamp(h, MIN_TRACK_H, MAX_TRACK_H)
}
const saveBox = ({ x, y, ...layout }: SavedBox) => {
  try {
    if (x !== undefined && y !== undefined)
      localStorage.setItem(POS_KEY, JSON.stringify({ x, y }))
    if (Object.keys(layout).length > 0)
      localStorage.setItem(
        LAYOUT_KEY,
        JSON.stringify({ ...readKey(LAYOUT_KEY), ...layout })
      )
  } catch {
    /* ignore quota/availability errors */
  }
}

// inline SVG control icons (24×24, currentColor to inherit text color + disabled dim); matches the game's own SVG-asset buttons
const RcIcon = ({ d, d2 }: { d: string; d2?: string }) => (
  <svg
    className="replay-controls-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    <path d={d} />
    {d2 ? <path d={d2} /> : null}
  </svg>
)
// skip-stage is bar + triangle; skip-phase a bare triangle; play/pause/restart share the center button
const IC = {
  play: "M8 5l11 7-11 7z",
  triLeft: "M16 5L5 12l11 7z",
  triRight: "M8 5l11 7-11 7z",
  pauseL: "M6 5h4v14H6z",
  pauseR: "M14 5h4v14h-4z",
  skipPrevBar: "M6 6h2v12H6z",
  skipPrevTri: "M18 6L9 12l9 6z",
  skipNextBar: "M16 6h2v12h-2z",
  skipNextTri: "M6 6l9 6-9 6z",
  restart: "M12 5V1L7 6l5 5V7a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z"
}

export default function ReplayControls({
  room,
  index,
  navMs,
  onSeek,
  onRestart,
  onStepForward,
  onStepBackward,
  eventLogOpen,
  onToggleEventLog
}: {
  room: ReplayRoom
  index: ReplayIndex | null
  navMs: () => number
  onSeek: (ms: number) => void
  onRestart: () => void
  onStepForward: () => void
  onStepBackward: () => void
  eventLogOpen: boolean
  onToggleEventLog: () => void
}) {
  const { t } = useTranslation()
  const [, force] = useState(0)

  // scrubber hover preview: re-based time + stage·phase at the cursor (index data only, no render); seeking reboots, so aim first
  const [hover, setHover] = useState<{ xPct: number; ms: number } | null>(null)

  // draggable position; null docks just above the shop (between shop and bench)
  const barRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const resizing = useRef(false)
  // high-water, so the bar doesn't twitch as the stage chip's text changes
  const floorRef = useRef(0)
  const floorFont = useRef("")
  const [floor, setFloor] = useState(0)
  const saved = useMemo(readBox, [])
  const [pos, setPos] = useState(() => {
    const x = finite(saved.x)
    const y = finite(saved.y)
    return x !== null && y !== null ? { x, y } : null
  })
  const [size, setSize] = useState({
    w: finite(saved.w),
    trackH: trackHeight(saved.trackH)
  })
  const [minimized, setMinimized] = useState(saved.minimized === true)
  const toggleMinimized = (next: boolean) => {
    setMinimized(next)
    saveBox({ minimized: next })
    if (next && eventLogOpen) onToggleEventLog() // the log shows times too, and the pill has no ☰
  }

  useEffect(() => {
    if (minimized) return
    const id = setInterval(() => force((n) => (n + 1) % 1e6), 150)
    return () => clearInterval(id)
  }, [minimized])

  // default dock just above the shop: measure the live `.game-shop` + bar width, anchor the bar's upper-left over it.
  // `left` settles once per bar width and thereafter only re-clamps into the viewport; `bottom` re-tracks the shop each measure; a user drag or resize switches to a persisted px position and stops the auto-dock
  const [dock, setDock] = useState<{
    left: number
    bottom: number
    forWidth: number
  } | null>(null)
  useEffect(() => {
    const measure = () => {
      if (resizing.current) return // re-clamping mid-resize walks the bar out from under the cursor
      const el = barRef.current
      const bar = el?.getBoundingClientRect()
      if (!el || !bar || bar.width === 0) return
      const f = rowFloor(el)
      const font = getComputedStyle(el).fontSize
      // 0 while collapsed; the high-water only holds within one font-size
      if (f > 0 && (f > floorRef.current || font !== floorFont.current)) {
        floorRef.current = f
        floorFont.current = font
        setFloor(f)
      }
      if (pos) {
        // a dragged position persisted on a bigger window can sit off-screen here; pull it back in reach
        const x = clamp(pos.x, 0, Math.max(0, window.innerWidth - bar.width))
        const y = clamp(pos.y, 0, Math.max(0, window.innerHeight - bar.height))
        if (x !== pos.x || y !== pos.y) setPos({ x, y })
        return
      }
      const shop = document.querySelector(".game-shop")?.getBoundingClientRect()
      if (shop && shop.height > 0) {
        const bottom = window.innerHeight - shop.top + DOCK_GAP
        setDock((d) => ({
          // clamp every measure (not just the first) so shrinking the window keeps the bar on-screen
          left: clamp(
            d && Math.abs(d.forWidth - bar.width) < 1 // recentre when collapse or restore changes the width
              ? d.left
              : shop.left + (shop.width - bar.width) / 2,
            8,
            Math.max(8, window.innerWidth - bar.width - 8)
          ),
          bottom,
          forWidth: bar.width
        }))
      }
    }
    measure()
    window.addEventListener("resize", measure)
    const id = setInterval(measure, 500)
    return () => {
      window.removeEventListener("resize", measure)
      clearInterval(id)
    }
  }, [pos, minimized]) // minimized changes the bar's width, so re-measure on the toggle

  const onHandleDown = (e: React.MouseEvent) => {
    e.preventDefault()
    const rect = barRef.current!.getBoundingClientRect()
    const dx = e.clientX - rect.left
    const dy = e.clientY - rect.top
    const { width, height } = rect
    const onMove = (ev: MouseEvent) =>
      setPos({
        x: clamp(ev.clientX - dx, 0, window.innerWidth - width),
        y: clamp(ev.clientY - dy, 0, window.innerHeight - height)
      })
    const onUp = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      const r = barRef.current?.getBoundingClientRect()
      if (r) saveBox({ x: r.left, y: r.top })
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  const onResizeDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const bar = barRef.current!
    const rect = bar.getBoundingClientRect()
    const startW = rect.width
    const startH = trackRef.current!.getBoundingClientRect().height
    // narrower than the row's content, the side badges paint over the transport
    const minW = Math.min(
      window.innerWidth - 16,
      Math.max(
        Math.min(360, window.innerWidth - 16),
        Math.max(rowFloor(bar), floorRef.current)
      )
    )
    const startX = e.clientX
    const startY = e.clientY
    // seeded from the overrides, so an axis the drag never moves keeps its css default
    const box: { w: number | null; trackH: number | null } = {
      w: size.w,
      trackH: size.trackH
    }
    let moved = false
    let axisX = false
    let axisY = false
    const onMove = (ev: MouseEvent) => {
      if (ev.buttons === 0) return onUp() // released outside the window, so mouseup never fired
      const dx = ev.clientX - startX
      const dy = ev.clientY - startY
      if (!axisX && Math.abs(dx) >= AXIS_DEADZONE) axisX = true
      if (!axisY && Math.abs(dy) >= AXIS_DEADZONE) axisY = true
      if (!axisX && !axisY) return
      if (!moved) {
        moved = true
        resizing.current = true
        if (!pos) setPos({ x: rect.left, y: rect.top }) // docked is bottom-anchored, so growing would move the top
      }
      if (axisX) {
        const maxW = Math.max(0, window.innerWidth - rect.left - 8)
        box.w = clamp(startW + dx, Math.min(minW, startW, maxW), maxW) // never snap up to the floor
      }
      if (axisY) box.trackH = clamp(startH + dy, MIN_TRACK_H, MAX_TRACK_H)
      setSize({ ...box })
    }
    const onUp = () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
      resizing.current = false
      if (!moved) return // a bare click must not freeze the css defaults into px
      const patch: SavedBox = {}
      if (box.w !== null) patch.w = box.w
      if (box.trackH !== null) patch.trackH = box.trackH
      // the resize pinned the position, so persist it too or a reload moves the bar
      const r = barRef.current?.getBoundingClientRect()
      if (r) {
        patch.x = r.left
        patch.y = r.top
      }
      saveBox(patch)
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  // re-base so 0:00 is game start not recording start: displayed times subtract the offset, but seek targets stay absolute (seeking reboots in-page via boot(), never breaks sprites)
  const base = room.gameStartMs
  const span = Math.max(1, room.totalMs - base)
  const elapsed = Math.max(0, room.currentMs - base)
  const pct = Math.min(100, Math.max(0, (elapsed / span) * 100))
  // dragged uses absolute px; otherwise the left-anchored dock above the shop (bottom-anchored, bar is position:fixed); top-center until the shop + bar are measured
  const posStyle: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y }
    : dock
      ? { left: dock.left, bottom: dock.bottom }
      : { left: "50%", top: 58, transform: "translateX(-50%)" }
  const boxStyle = {
    ...posStyle,
    ...(minimized
      ? {}
      : {
          ...(size.w != null ? { width: Math.max(size.w, floor) } : {}),
          ...(size.trackH != null
            ? { "--replay-controls-track-h": `${size.trackH}px` }
            : {})
        })
  } as React.CSSProperties

  // collapsed: no timeline, clock or stage chip, so nothing gives away the result
  if (minimized)
    return (
      <div
        ref={barRef}
        className="replay-controls my-container minimized"
        style={boxStyle}
      >
        <span className="replay-controls-handle" onMouseDown={onHandleDown}>
          ⠿
        </span>
        <span className="replay-controls-badge">
          {t("replay.controls.badge")}
        </span>
        <button
          className="bubbly replay-controls-minimize"
          title={t("maximize")}
          onClick={() => toggleMinimized(false)}
        >
          ➕
        </button>
      </div>
    )

  // skip-button targets from the index; navigate from the in-flight seek target (navMs) while a seek rebuilds, so rapid skips / a held arrow accumulate instead of recomputing from a frozen position (null means at the end, disabled)
  const navNow = navMs()
  const targets = index
    ? {
        prevStage: prevStage(index, navNow),
        prevPhase: prevPhase(index, navNow),
        nextPhase: nextPhase(index, navNow),
        nextStage: nextStage(index, navNow)
      }
    : null

  const here = index ? segmentAt(index, room.currentMs) : null

  // marker / band fraction along the re-based track [0,1]
  const frac = (t: number) => clamp((t - base) / span, 0, 1)
  const skip = (target: number | null) => target != null && onSeek(target)
  // compute the skip target live at click time (navMs), so two fast clicks accumulate even within one 150ms poll cycle
  const go = (fn: (i: ReplayIndex, ms: number) => number | null) =>
    index && skip(fn(index, navMs()))

  // track hover previews the moment (time + stage·phase) under the cursor
  const onTrackHover = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const xPct = clamp(((e.clientX - r.left) / r.width) * 100, 0, 100)
    setHover({ xPct, ms: base + (xPct / 100) * span })
  }

  return (
    <div ref={barRef} className="replay-controls my-container" style={boxStyle}>
      {/* row 1: timeline spans full width; everything else sits centered below */}
      <div className="replay-controls-track-wrap">
        <div
          ref={trackRef}
          className="replay-controls-track"
          onMouseMove={index ? onTrackHover : undefined}
          onMouseLeave={() => setHover(null)}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            onSeek(base + ((e.clientX - r.left) / r.width) * span)
          }}
        >
          {/* stage-typed bands, colored to match the wiki "Stages" page (see segmentBandKind); behind the fill/markers, the track's own click still seeks */}
          {index?.segments.map((s, i) => {
            const start = frac(s.t)
            const end =
              i + 1 < index.segments.length ? frac(index.segments[i + 1].t) : 1
            return (
              <div
                key={`band-${i}`}
                className={`replay-controls-band ${segmentBandKind(s)}`}
                style={{
                  left: `${start * 100}%`,
                  width: `${Math.max(0, end - start) * 100}%`
                }}
              />
            )
          })}
          <div className="replay-controls-fill" style={{ width: `${pct}%` }} />
          <div
            className="replay-controls-playhead"
            style={{ left: `${pct}%` }}
          />
          {/* stage-start ticks; click-to-seek to the stage. stopPropagation so the tick hits the boundary exactly, not the coarse track click */}
          {index?.stages.map((st, i) => (
            <button
              key={`stage-${i}`}
              className="replay-controls-mark stage"
              // accessible name for the seek tick (reuses the game's own "Stage" key, so no new locale string)
              aria-label={`${t("stage")} ${st.stage}`}
              style={{ left: `${frac(st.t) * 100}%` }}
              onClick={(e) => {
                e.stopPropagation()
                onSeek(st.t)
              }}
            />
          ))}
          {hover && (
            <div
              className="replay-controls-hover-line"
              style={{ left: `${hover.xPct}%` }}
            />
          )}
        </div>
        {hover &&
          (() => {
            const seg = index ? segmentAt(index, hover.ms) : null
            return (
              <div
                className="replay-controls-hover-tip"
                style={{ left: `${clamp(hover.xPct, 7, 93)}%` }}
              >
                <span className="replay-controls-hover-time">
                  {fmt(hover.ms - base)}
                </span>
                {seg ? (
                  <span
                    className={`replay-controls-hover-seg ${segmentBandKind(seg)}`}
                  >
                    {t("replay.controls.pos", {
                      stage: seg.stage,
                      phase: phaseWord(t, seg.phaseLabel)
                    })}
                  </span>
                ) : null}
              </div>
            )
          })()}
      </div>

      {/* row 2: centered 3-column bar: badges · transport · tools; center is `auto` between two `1fr` sides so transport stays pinned to the middle */}
      <div className="replay-controls-bar">
        <div className="replay-controls-side replay-controls-left">
          <span className="replay-controls-handle" onMouseDown={onHandleDown}>
            ⠿
          </span>
          {/* time + stage·phase as small PAC-style HUD pills; replay-controls-pos doubles as the replay / ended badge */}
          <span className="replay-controls-badge replay-controls-time">
            {fmt(elapsed)}/{fmt(span)}
          </span>
          <span
            className={`replay-controls-badge replay-controls-pos${room.ended ? " ended" : ""}`}
          >
            {room.ended
              ? t("replay.controls.ended")
              : here
                ? t("replay.controls.pos", {
                    stage: here.stage,
                    phase: phaseWord(t, here.phaseLabel)
                  })
                : t("replay.controls.badge")}
          </span>
        </div>

        <div className="replay-controls-center">
          {targets && (
            <>
              <button
                className="bubbly replay-controls-skip"
                title={t("replay.controls.prev_stage")}
                disabled={targets.prevStage == null}
                onClick={() => go(prevStage)}
              >
                <RcIcon d={IC.skipPrevTri} d2={IC.skipPrevBar} />
              </button>
              <button
                className="bubbly replay-controls-skip"
                title={t("replay.controls.prev_phase")}
                disabled={targets.prevPhase == null}
                onClick={() => go(prevPhase)}
              >
                <RcIcon d={IC.triLeft} />
              </button>
            </>
          )}

          <button
            className="bubbly blue replay-controls-play"
            title={
              room.ended
                ? t("replay.controls.restart")
                : room.paused
                  ? t("replay.controls.play")
                  : t("replay.controls.pause")
            }
            onClick={() => (room.ended ? onRestart() : room.togglePause())}
          >
            {room.ended ? (
              <RcIcon d={IC.restart} />
            ) : room.paused ? (
              <RcIcon d={IC.play} />
            ) : (
              <RcIcon d={IC.pauseL} d2={IC.pauseR} />
            )}
          </button>

          {targets && (
            <>
              <button
                className="bubbly replay-controls-skip"
                title={t("replay.controls.next_phase")}
                disabled={targets.nextPhase == null}
                onClick={() => go(nextPhase)}
              >
                <RcIcon d={IC.triRight} />
              </button>
              <button
                className="bubbly replay-controls-skip"
                title={t("replay.controls.next_stage")}
                disabled={targets.nextStage == null}
                onClick={() => go(nextStage)}
              >
                <RcIcon d={IC.skipNextTri} d2={IC.skipNextBar} />
              </button>
            </>
          )}
        </div>

        <div className="replay-controls-side replay-controls-right">
          {/* frame-step: pauses first, then advances/rewinds one frame. back is a reboot-seek (decoder is forward-only), so a touch slower than forward */}
          <span className="replay-controls-step">
            <button
              className="bubbly replay-controls-skip"
              title={t("replay.controls.step_back")}
              onClick={onStepBackward}
            >
              −1
            </button>
            <button
              className="bubbly replay-controls-skip"
              title={t("replay.controls.step_forward")}
              onClick={onStepForward}
            >
              +1
            </button>
          </span>

          <select
            className="replay-controls-speed-select"
            title={t("replay.controls.speed")}
            value={room.getSpeed()}
            onChange={(e) => room.setSpeed(Number(e.target.value))}
          >
            {SPEEDS.map((s) => (
              <option key={s} value={s}>
                {speedLabel(s)}
              </option>
            ))}
          </select>

          <button
            className={`bubbly replay-controls-events${eventLogOpen ? " blue" : ""}`}
            title={t("replay.controls.events")}
            onClick={onToggleEventLog}
          >
            ☰
          </button>

          <button
            className="bubbly replay-controls-minimize"
            title={t("minimize")}
            onClick={() => toggleMinimized(true)}
          >
            ➖
          </button>
        </div>
      </div>

      <span
        className="replay-controls-resize"
        aria-hidden="true"
        onMouseDown={onResizeDown}
      />
    </div>
  )
}
