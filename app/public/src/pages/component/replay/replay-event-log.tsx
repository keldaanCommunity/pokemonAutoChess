import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react"
import { useTranslation } from "react-i18next"
import {
  type FrameInfo,
  formatMessageRow,
  formatReplayEvent,
  phaseWord,
  prettyName,
  statLabel,
  statusLabel
} from "../../../game/replay-event-format"
import type { ReplayIndex } from "../../../game/replay-index"
import type { ReplayRoom } from "../../../game/replay-room"
import "./replay-event-log.css"

// combat payloads decoded in replay-event-format: source by species index, other by tile;
// ability targetX/Y lies for self/ally effects (defaults to the caster's attack-enemy)

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v))
// fallback dock when anchors can't be measured; drag/resize override and persist
const DEFAULT_TOP = "57vh"
const DEFAULT_RIGHT = "6vw"

// default box fills the gap right of the playback bar and above the shop (shop.top - bar.bottom, clamped);
// every anchor is stable except fight-only battle-stats (.game-dps-meter), so town falls back to a constant
const clampGap = (v: number) => Math.max(4, Math.min(40, v))
function measureDefaultBox(): {
  left: number
  top: number
  width: number
  height: number
} | null {
  if (typeof document === "undefined") return null
  const rect = (sel: string) =>
    document.querySelector(sel)?.getBoundingClientRect()
  const players = rect("#game-players")
  const controls = rect(".replay-controls")
  const shop = rect(".game-pokemons-store")
  if (!players || !controls || !shop) return null
  const teamInfo = rect("#game-team-info") // board-count pill above the shop bar
  const dps = rect(".game-dps-meter") // battle-stats panel, fight-only
  const gap = clampGap(Math.round(shop.top - controls.bottom))
  const left = Math.round(controls.right + gap)
  const right = Math.round(players.left - gap)
  const top = Math.round(dps ? dps.bottom + gap : window.innerHeight * 0.11)
  const bottom = Math.round((teamInfo ?? shop).top - gap)
  const width = Math.max(240, right - left)
  const height = Math.max(140, bottom - top)
  return { left, top, width, height }
}

// event log for the replay viewer: the frames the replay is rebuilt from, stamped mm:ss + frame; clicking a row seeks.
// filter chips; combat/positioning/engine off by default; filtering hides rows, never drops data

type Category =
  | "combat"
  | "economy"
  | "items"
  | "flow"
  | "synergy"
  | "flavor"
  | "positioning"
  | "engine"
  | "status"
  | "stats"
  | "moves"

// message type to category, traced from game source; unmapped falls to engine (hidden but available)
const CATEGORY_OF: Record<string, Category> = {
  // combat
  ABILITY: "combat",
  POKEMON_DAMAGE: "combat",
  POKEMON_HEAL: "combat",
  DISPLAY_TEXT: "combat",
  // economy
  PLAYER_INCOME: "economy",
  PLAYER_DAMAGE: "economy",
  // flow: match milestones
  FINAL_RANK: "flow",
  GAME_END: "flow",
  LOADING_COMPLETE: "flow",
  // synergy: ground (dig), gourmet (cook)
  DIG: "synergy",
  COOK: "synergy",
  // flavor: cosmetic chatter
  SHOW_EMOTE: "flavor",
  NPC_DIALOG: "flavor",
  // board effect: tile hazard/field, owner-tagged (ghost/PvE hidden); rides the combat chip
  BOARD_EVENT: "combat",
  // engine: board-sim + renderer setup + rare system frames, off by default
  CLEAR_BOARD_EVENT: "engine", // paired expired/cleared firehose, stays engine
  CLEAR_BOARD: "engine",
  SIMULATION_STOP: "engine",
  PRELOAD_MAPS: "engine",
  DRAG_DROP_CANCEL: "engine",
  ALERT: "engine",
  RECONNECT_PROMPT: "engine"
}

const CAT_ORDER: Category[] = [
  "combat",
  "status",
  "stats",
  "economy",
  "items",
  "flow",
  "synergy",
  "flavor",
  "positioning",
  "moves",
  "engine"
]

// chip label to i18n key; some reuse game strings
const CAT_LABEL_KEY = {
  combat: "replay.eventlog.cat.combat",
  status: "status_label",
  stats: "stats",
  economy: "replay.eventlog.cat.economy",
  items: "wiki.nav.items_label",
  flow: "replay.eventlog.cat.flow",
  synergy: "synergies",
  flavor: "replay.eventlog.cat.flavor",
  positioning: "replay.eventlog.cat.positioning",
  moves: "replay.eventlog.cat.moves",
  engine: "replay.eventlog.cat.engine"
} as const satisfies Record<Category, string>

// combat-family categories share one chip; drill-down splits by source then type
const COMBAT_CATS: Category[] = ["combat", "status", "stats", "moves"]
// combat message types to drill-down sub-keys (unlisted uses prettyName)
type CombatSubKey =
  | "casts"
  | "damage"
  | "heals"
  | "text"
  | "board_effects"
  | "weather"
const COMBAT_SUBKEY: Record<string, CombatSubKey> = {
  ABILITY: "casts",
  POKEMON_DAMAGE: "damage",
  POKEMON_HEAL: "heals",
  DISPLAY_TEXT: "text",
  BOARD_EVENT: "board_effects",
  WEATHER: "weather"
}
const SUB_LABEL_KEY = {
  casts: "wiki.pokemons.ability_label",
  damage: "replay.eventlog.sub.damage",
  heals: "replay.eventlog.sub.heals",
  text: "replay.eventlog.sub.text",
  board_effects: "replay.eventlog.sub.board_effects",
  weather: "wiki.nav.weather_label"
} as const satisfies Record<CombatSubKey, string>
// drill-down sections for the merged combat chip. single-pov gap: casts/damage/heal/text are camera-scoped
// (broadcastToSpectators, only the recorder's board), while board effects/weather/status/stats are recovered for every board
type SectionKey =
  | "casts_pov"
  | "board_weather"
  | "status_all"
  | "stats_all"
  | "moves_all"
const COMBAT_SECTIONS: {
  cat: Category
  labelKey: SectionKey
  only?: string[]
}[] = [
  {
    cat: "combat",
    labelKey: "casts_pov",
    only: ["ABILITY", "POKEMON_DAMAGE", "POKEMON_HEAL", "DISPLAY_TEXT"]
  },
  {
    cat: "combat",
    labelKey: "board_weather",
    only: ["BOARD_EVENT", "WEATHER"]
  },
  { cat: "status", labelKey: "status_all" },
  { cat: "stats", labelKey: "stats_all" },
  { cat: "moves", labelKey: "moves_all" }
]
const SECTION_LABEL_KEY = {
  casts_pov: "replay.eventlog.section.casts_pov",
  board_weather: "replay.eventlog.section.board_weather",
  status_all: "status_label",
  stats_all: "stats",
  moves_all: "replay.eventlog.section.moves_all"
} as const satisfies Record<SectionKey, string>

const DEFAULT_ON: Record<Category, boolean> = {
  combat: false, // ~92% of rows (per-tick ability/damage/heal), opt-in
  status: false, // combat status effects, opt-in
  stats: false, // combat stat changes, a firehose, opt-in
  economy: true,
  items: true,
  flow: true,
  synergy: true,
  flavor: true,
  positioning: false, // every unit move, high-frequency, opt-in
  moves: false, // in-fight stepping, recovered for every board, opt-in
  engine: false // board/sim plumbing, opt-in
}

// derived pov-action types to category; defaults to economy
const ACTION_CAT: Record<string, Category> = {
  pick: "flow",
  round: "flow",
  town: "flow",
  region: "flow",
  rule: "flow",
  scarf: "items",
  weather: "combat", // fight property (owner-tagged), grouped under combat not synergy
  berries: "synergy",
  status: "status",
  stat: "stats",
  item: "items",
  craft: "items",
  equip: "items",
  unequip: "items",
  egg: "synergy",
  fish: "synergy",
  hatch: "synergy",
  synergy: "synergy",
  berry: "synergy",
  flower: "synergy",
  wanderer: "synergy",
  move: "positioning",
  combatmove: "moves"
}

const FILTER_KEY = "replay.eventlog.filters"
const BOX_KEY = "replay.eventlog.box" // { x, y, w, h }

type SavedBox = { x?: number; y?: number; w?: number; h?: number }
// read the persisted box fresh so an in-session resize wins over the default
function readBox(): SavedBox {
  try {
    const b = JSON.parse(localStorage.getItem(BOX_KEY) || "null")
    if (b && typeof b === "object") return b as SavedBox
  } catch {
    /* ignore */
  }
  return {}
}

type LogEvent = {
  t: number // ms since first frame (transcript clock)
  frame: number // manifest frame index (-1 for derived phase/elim)
  type: string
  summary: string
  cat: Category
  kind: "msg" | "phase" | "elim" | "action" | "pick"
  // owning player; per-player filter slices on it. uid-less rows are game-level milestones and always show.
  // combat messages are camera-scoped, carrying the watched board's uid (single-pov gap)
  uid?: string
  // optional sub-type for the fine-grained filter; absent means the type column is the granularity
  key?: string
}

// filter sub-type: explicit key else display type, namespaced by category
const subKey = (e: { key?: string; type: string }) => e.key ?? e.type
const subId = (cat: Category, sub: string) => `${cat}:${sub}`

const SUBOFF_KEY = "replay.eventlog.suboff" // sub-types turned off within an enabled category
const PLAYERON_KEY = "replay.eventlog.playeron" // players shown in the per-player filter (default: pov only)

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`
}

// rows localized at render; the raw type column + sub-filter tokens stay english

function loadFilters(): Record<Category, boolean> {
  try {
    const saved = JSON.parse(localStorage.getItem(FILTER_KEY) || "null")
    if (saved && typeof saved === "object") return { ...DEFAULT_ON, ...saved }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_ON }
}

export default function ReplayEventLog({
  room,
  index,
  onSeek,
  open,
  onClose
}: {
  room: ReplayRoom
  index: ReplayIndex | null
  onSeek: (ms: number) => void
  // open/close owned by parent; renders only the panel
  open: boolean
  onClose: () => void
}) {
  const { t } = useTranslation()
  const viewerUid = room.manifest.viewerUid
  const [enabled, setEnabled] = useState<Record<Category, boolean>>(loadFilters)
  // sub-types turned off within a category; expanded is the open drill-down
  const [subOff, setSubOff] = useState<Set<string>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SUBOFF_KEY) || "[]")
      if (Array.isArray(saved)) return new Set<string>(saved)
    } catch {
      /* ignore */
    }
    return new Set<string>()
  })
  const [expanded, setExpanded] = useState<Category | null>(null)
  // per-player filter; defaults to the recording player, stored as the on-set so it survives a reload
  const [playerOn, setPlayerOn] = useState<Set<string>>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(PLAYERON_KEY) || "null")
      if (Array.isArray(saved)) return new Set<string>(saved)
    } catch {
      /* ignore */
    }
    return new Set<string>([viewerUid])
  })
  // auto-follow the playhead; a manual wheel-scroll unlocks it
  const [follow, setFollow] = useState(true)
  const [, force] = useState(0)
  // virtualized row list: render only rows near the viewport (else a firehose category mounts tens of thousands of dom nodes)
  // scrollTop + viewportH window the slice; rowH is the measured row height
  const [scrollTop, setScrollTop] = useState(0)
  const [rowH, setRowH] = useState(18)
  const [viewportH, setViewportH] = useState(400)
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null) // scroll container; active-row class applied here imperatively
  // hold onSeek in a ref so its identity churn doesn't invalidate the memoized rows
  const onSeekRef = useRef(onSeek)
  onSeekRef.current = onSeek
  // restore the saved box; position via posStyle, size imperatively
  const saved = useMemo<SavedBox>(() => readBox(), [])
  const [pos, setPos] = useState<{ x: number; y: number } | null>(
    saved.x != null && saved.y != null ? { x: saved.x, y: saved.y } : null
  )
  // measured default box for dimensions the user hasn't overridden (drag wins position, resize wins size)
  const [autoBox, setAutoBox] = useState<{
    left: number
    top: number
    width: number
    height: number
  } | null>(null)
  const fullyPlaced = saved.x != null && saved.w != null
  // measure the default box before paint so it doesn't jump from the fallback anchor
  useLayoutEffect(() => {
    if (!open || fullyPlaced) return
    const measure = () => setAutoBox(measureDefaultBox())
    measure()
    window.addEventListener("resize", measure)
    return () => {
      window.removeEventListener("resize", measure)
    }
  }, [open, fullyPlaced])

  // drag by the header, hand-rolled to dodge the shared hook's mount-time clamp
  const onHeadDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, label, input")) return
    e.preventDefault()
    const rect = panelRef.current!.getBoundingClientRect()
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
      const r = panelRef.current?.getBoundingClientRect()
      if (r) {
        try {
          const b = JSON.parse(localStorage.getItem(BOX_KEY) || "{}")
          localStorage.setItem(
            BOX_KEY,
            JSON.stringify({ ...b, x: r.left, y: r.top })
          )
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
  }

  // poll the room clock while open to keep the playhead cursor live
  useEffect(() => {
    if (!open) return
    const id = setInterval(() => force((n) => (n + 1) % 1e6), 200)
    return () => clearInterval(id)
  }, [open])

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(FILTER_KEY, JSON.stringify(enabled))
    } catch {
      /* ignore */
    }
  }, [enabled])

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(SUBOFF_KEY, JSON.stringify([...subOff]))
    } catch {
      /* ignore */
    }
  }, [subOff])

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(PLAYERON_KEY, JSON.stringify([...playerOn]))
    } catch {
      /* ignore */
    }
  }, [playerOn])

  // reconcile the persisted on-set against this recording's roster: stored under one global key but keyed by
  // per-recording uids, so a stale selection from another replay matches nothing. prune to players that exist here
  useEffect(() => {
    if (!index) return
    const roster = index.playerNames
    const pruned = [...playerOn].filter((u) => roster[u] !== undefined)
    if (pruned.length === playerOn.size) return
    // guard a re-run loop: if even the pov uid isn't in this roster (truncated/foreign file), Set([viewerUid])
    // re-prunes to empty every run, an unbounded setState that white-screens the route (renders outside the error boundary)
    const next = pruned.length ? new Set(pruned) : new Set<string>([viewerUid])
    if (next.size === playerOn.size && [...next].every((u) => playerOn.has(u)))
      return
    setPlayerOn(next)
  }, [index, viewerUid, playerOn])

  // restore the saved size, persist on resize
  useEffect(() => {
    if (!open) return
    const el = panelRef.current
    if (!el) return
    // re-read the box fresh (not the mount-time saved memo): once resized the observer persists w/h, so a later
    // re-run applies that not autoBox (else autoBox clobbers the user's size)
    const box = readBox()
    // saved size wins, else the measured default; set imperatively for the css resize handle
    if (box.w) el.style.width = `${box.w}px`
    else if (autoBox) el.style.width = `${autoBox.width}px`
    if (box.h) el.style.height = `${box.h}px`
    else if (autoBox) el.style.height = `${autoBox.height}px`
    // ResizeObserver fires an initial callback immediately, reflecting the size we just applied (not a user resize);
    // persisting it would freeze the default into localStorage as if dragged. skip persistence on the first fire, still sync viewportH
    let initialFire = true
    const ro = new ResizeObserver(() => {
      // keep the virtualization viewport synced with the panel height (else new space stays blank until re-measure)
      const lh = listRef.current?.clientHeight
      if (lh) setViewportH(lh)
      if (initialFire) {
        initialFire = false
        return
      }
      try {
        const b = JSON.parse(localStorage.getItem(BOX_KEY) || "{}")
        localStorage.setItem(
          BOX_KEY,
          JSON.stringify({ ...b, w: el.offsetWidth, h: el.offsetHeight })
        )
      } catch {
        /* ignore */
      }
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [open, autoBox])

  const playerNames = index?.playerNames ?? {}

  // build the event list once per recording, tagged by category + owning uid
  const events = useMemo<LogEvent[]>(() => {
    const out: LogEvent[] = []
    // DIG/COOK/SHOW_EMOTE are room-broadcast, so a pov capture holds other players' too; the index flags the non-pov to hide.
    // combat messages are camera-scoped, tagged with the recorder's camera; non-combat have no owner, so the viewer uid
    const foreign = new Set(index?.foreignFrames ?? [])
    room.manifest.frames.forEach((f, i) => {
      if (f.kind === "message" && !foreign.has(i)) {
        const type = String(f.type)
        const info: FrameInfo = {
          ...index?.combatUnits?.[i],
          dig: index?.digInfo?.[i],
          income: index?.incomeInfo?.[i]
        }
        out.push({
          t: f.t,
          frame: i,
          type,
          summary: formatMessageRow(t, type, f.payload, info),
          cat: CATEGORY_OF[type] ?? "engine",
          kind: "msg",
          uid: info.owner ?? viewerUid
        })
      }
    })
    // game-level milestones carry no uid, always show
    index?.segments.forEach((s) =>
      out.push({
        t: s.t,
        frame: -1,
        type: "PHASE",
        summary: t("replay.eventlog.row.phase", {
          stage: s.stage,
          phase: phaseWord(t, s.phaseLabel)
        }),
        cat: "flow",
        kind: "phase"
      })
    )
    index?.events
      .filter((e) => e.type === "elimination")
      .forEach((e) =>
        out.push({
          t: e.t,
          frame: -1,
          type: "ELIMINATION",
          summary: formatReplayEvent(t, e),
          cat: "flow",
          kind: "elim"
        })
      )
    // per-player actions to categories (ACTION_CAT); uid carries the owner, uid-less rows are game-level
    index?.actions.forEach((a) =>
      out.push({
        t: a.t,
        frame: -1,
        type: a.type.toUpperCase(),
        summary: formatReplayEvent(t, a),
        cat: ACTION_CAT[a.type] ?? "economy",
        kind: a.type === "pick" ? "pick" : "action",
        uid: a.uid,
        key: a.key
      })
    )
    return out.sort((a, b) => a.t - b.t || a.frame - b.frame)
    // key on the stable manifest not room: boot() makes a new ReplayRoom per seek
  }, [room.manifest, index, viewerUid, t])

  // sub-types per category through the player filter; drives the chips
  const subtypesByCat = useMemo(() => {
    const m = new Map<Category, Set<string>>()
    for (const e of events) {
      if (!(e.uid == null || playerOn.has(e.uid))) continue
      if (!m.has(e.cat)) m.set(e.cat, new Set())
      m.get(e.cat)!.add(subKey(e))
    }
    return m
  }, [events, playerOn])

  // player chip order: recording player first, then alphabetical
  const playerOrder = useMemo(() => {
    const names = index?.playerNames ?? {}
    return Object.keys(names).sort((a, b) =>
      a === viewerUid
        ? -1
        : b === viewerUid
          ? 1
          : (names[a] || "").localeCompare(names[b] || "")
    )
  }, [index, viewerUid])
  const multiPlayer = playerOn.size > 1

  const base = index?.gameStartMs ?? 0
  // row shows when its (sub-)category is enabled and it's uid-less or owner-selected
  const visible = useMemo(
    () =>
      events.filter(
        (e) =>
          enabled[e.cat] &&
          !subOff.has(subId(e.cat, subKey(e))) &&
          (e.uid == null || playerOn.has(e.uid))
      ),
    [events, enabled, subOff, playerOn]
  )

  // visible row at the playhead: last one with t <= currentMs
  const cur = room.currentMs
  let activeIdx = -1
  for (let i = 0; i < visible.length; i++) {
    if (visible[i].t <= cur) activeIdx = i
    else break
  }

  // virtualization window: the slice of visible to render plus overscan; a 15k-row firehose category mounts ~50 nodes not 15k
  const OVERSCAN = 12
  const total = visible.length
  const startIdx = Math.max(0, Math.floor(scrollTop / rowH) - OVERSCAN)
  const endIdx = Math.min(
    total,
    Math.ceil((scrollTop + viewportH) / rowH) + OVERSCAN
  )
  const windowRows = open ? visible.slice(startIdx, endIdx) : []

  // measure real row height + viewport once rows exist; keeps spacers accurate
  useEffect(() => {
    if (!open) return
    const list = listRef.current
    if (!list) return
    if (list.clientHeight) setViewportH(list.clientHeight)
    const firstRow = list.querySelector<HTMLElement>(".replay-eventlog-row")
    if (firstRow && firstRow.offsetHeight > 0) setRowH(firstRow.offsetHeight)
  }, [open, multiPlayer, total])

  // follow the playhead: scroll the active row into view (may be unmounted, so compute its position).
  // a manual wheel unlocks follow; programmatic scrollTop only fires scroll, so it won't
  useEffect(() => {
    if (!open || !follow) return
    const list = listRef.current
    if (!list || activeIdx < 0) return
    const top = activeIdx * rowH
    if (
      top < list.scrollTop ||
      top + rowH > list.scrollTop + list.clientHeight
    ) {
      list.scrollTop = Math.max(0, top - list.clientHeight / 2)
    }
  }, [activeIdx, open, follow, rowH])

  if (!open) return null
  const toggle = (k: Category) => setEnabled((e) => ({ ...e, [k]: !e[k] }))
  // one sub-type toggle; label may differ from the stored sub key
  const renderSubchip = (cat: Category, sub: string, label: string) => {
    const id = subId(cat, sub)
    const on = !subOff.has(id)
    return (
      <button
        key={id}
        className={`replay-eventlog-sub-chip${on ? " on" : ""}`}
        onClick={() =>
          setSubOff((s) => {
            const n = new Set(s)
            if (on) n.add(id)
            else n.delete(id)
            return n
          })
        }
      >
        {label}
      </button>
    )
  }
  const posStyle: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y }
    : autoBox
      ? { left: autoBox.left, top: autoBox.top }
      : { right: DEFAULT_RIGHT, top: DEFAULT_TOP }
  return (
    <div
      ref={panelRef}
      className={`replay-eventlog my-container${multiPlayer ? " multi-player" : ""}`}
      style={posStyle}
    >
      <header className="replay-eventlog-head" onMouseDown={onHeadDown}>
        <span className="replay-eventlog-title">{t("replay.eventlog.title")}</span>
        <span className="replay-eventlog-count">
          {visible.length} / {events.length}
        </span>
        <button
          className={`replay-eventlog-follow${!follow ? " on" : ""}`}
          onClick={() => setFollow((f) => !f)}
        >
          {t("replay.eventlog.free_scroll")}
        </button>
        <button className="replay-eventlog-close" title={t("close")} onClick={onClose}>
          ×
        </button>
      </header>
      <div className="replay-eventlog-filters">
        {/* merged combat chip; toggles casts/status/stats together, shown only if combat events exist */}
        {COMBAT_CATS.some((c) => subtypesByCat.has(c)) &&
          (() => {
            const anyOn = COMBAT_CATS.some((c) => enabled[c])
            return (
              <span className="replay-eventlog-chip-wrap has-caret">
                <button
                  className={`replay-eventlog-chip replay-eventlog-chip-combat${anyOn ? " on" : ""}`}
                  onClick={() =>
                    setEnabled((e) => {
                      const v = !COMBAT_CATS.some((c) => e[c])
                      return { ...e, combat: v, status: v, stats: v, moves: v }
                    })
                  }
                >
                  {t("replay.eventlog.cat.combat")}
                </button>
                <button
                  className={`replay-eventlog-caret${expanded === "combat" ? " open" : ""}`}
                  onClick={() =>
                    setExpanded((x) => (x === "combat" ? null : "combat"))
                  }
                >
                  ▾
                </button>
              </span>
            )
          })()}
        {/* other categories: one chip each, only when events exist */}
        {CAT_ORDER.filter(
          (key) => !COMBAT_CATS.includes(key) && subtypesByCat.has(key)
        ).map((key) => {
          const drillable = (subtypesByCat.get(key)?.size ?? 0) > 1
          const label = t(CAT_LABEL_KEY[key])
          return (
            <span
              key={key}
              className={`replay-eventlog-chip-wrap${drillable ? " has-caret" : ""}`}
            >
              <button
                className={`replay-eventlog-chip replay-eventlog-chip-${key}${enabled[key] ? " on" : ""}`}
                onClick={() => toggle(key)}
              >
                {label}
              </button>
              {drillable && (
                <button
                  className={`replay-eventlog-caret${expanded === key ? " open" : ""}`}
                  onClick={() => setExpanded((x) => (x === key ? null : key))}
                >
                  ▾
                </button>
              )}
            </span>
          )
        })}
      </div>
      {expanded && (
        // per-type drill-down: toggle sub-types without losing the rest; the combat chip splits into three
        // sections (casts/damage, status, stats), others are a flat list
        <div className="replay-eventlog-sub-filters">
          {expanded === "combat"
            ? COMBAT_SECTIONS.map((sec) => {
                let subs = [...(subtypesByCat.get(sec.cat) ?? [])].sort()
                const only = sec.only
                if (only) subs = subs.filter((s) => only.includes(s))
                if (!subs.length) return null
                return (
                  <Fragment key={sec.labelKey}>
                    <span className="replay-eventlog-sub-header">
                      {t(SECTION_LABEL_KEY[sec.labelKey])}
                    </span>
                    {subs.map((sub) =>
                      renderSubchip(
                        sec.cat,
                        sub,
                        // status/stats sub-keys localized; combat sub-keys use replay.* else prettyName
                        sec.cat === "status"
                          ? statusLabel(t, sub)
                          : sec.cat === "stats"
                            ? statLabel(t, sub)
                            : sec.cat === "moves"
                              ? t("replay.eventlog.cat.moves")
                              : COMBAT_SUBKEY[sub]
                                ? t(SUB_LABEL_KEY[COMBAT_SUBKEY[sub]])
                                : prettyName(sub)
                      )
                    )}
                  </Fragment>
                )
              })
            : [...(subtypesByCat.get(expanded) ?? [])]
                .sort()
                .map((sub) => renderSubchip(expanded, sub, sub))}
        </div>
      )}
      {playerOrder.length > 0 && (
        // per-player filter; defaults to the recording player
        <div className="replay-eventlog-players">
          {playerOrder.map((uid) => {
            const on = playerOn.has(uid)
            return (
              <button
                key={uid}
                className={`replay-eventlog-player-chip${on ? " on" : ""}${uid === viewerUid ? " pov" : ""}`}
                onClick={() =>
                  setPlayerOn((s) => {
                    const n = new Set(s)
                    if (on) n.delete(uid)
                    else n.add(uid)
                    return n
                  })
                }
              >
                {playerNames[uid] || uid}
              </button>
            )
          })}
        </div>
      )}
      <div
        className="replay-eventlog-list"
        ref={listRef}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        onWheel={() => follow && setFollow(false)}
      >
        {/* full-height sizer sets the scrollbar; only windowed rows mount, absolutely positioned by index */}
        <div className="replay-eventlog-sizer" style={{ height: total * rowH }}>
          {windowRows.map((e, k) => {
            const i = startIdx + k
            return (
              <div
                key={`${e.frame}:${e.t}:${i}`}
                data-i={i}
                className={`replay-eventlog-row replay-eventlog-${e.kind} replay-eventlog-cat-${e.cat}${i === activeIdx ? " active" : ""}`}
                style={{ top: i * rowH }}
                onClick={() => onSeekRef.current(e.t)}
              >
                <span className="replay-eventlog-t">{fmt(e.t - base)}</span>
                {multiPlayer ? (
                  // the player this event belongs to (uid-less rows show blank)
                  <span
                    className="replay-eventlog-player"
                    title={e.uid ? playerNames[e.uid] : ""}
                  >
                    {e.uid ? (playerNames[e.uid] ?? "") : ""}
                  </span>
                ) : (
                  <span className="replay-eventlog-frame">
                    {e.frame >= 0 ? `#${e.frame}` : "·"}
                  </span>
                )}
                <span className="replay-eventlog-type">{e.type}</span>
                <span className="replay-eventlog-sum">{e.summary}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
