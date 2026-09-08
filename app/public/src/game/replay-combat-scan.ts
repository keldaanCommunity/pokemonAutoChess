// combat-entity status/stat diff, run for every board by buildReplayIndex. status and stats are synced @type
// fields on each PokemonEntity, so they're recoverable for every board and owner-tagged; cast/damage/heal are
// not here (broadcastToSpectators, POV-only, the single-POV gap)
import { Metadata } from "@colyseus/schema"
import type { ReplayEventArgs } from "./replay-event-format"

// the Status schema's @type fields, read off the decoded status instance (Metadata.getFields) rather than
// hand-listed, so a new upstream status auto-tracks. the field type drives the diff: number fields are counters
// (poisonStacks), booleans flip false-to-true when applied. cached per constructor, re-derived if the class
// changes (a different build's replay in the same session)
let statusFieldsCtor: unknown = null
let statusFields: [string, string][] = []
function getStatusFields(status: object): [string, string][] {
  const ctor = (status as { constructor: unknown }).constructor
  if (ctor !== statusFieldsCtor) {
    statusFieldsCtor = ctor
    try {
      const f = Metadata.getFields(ctor) as Record<string, string> | undefined
      statusFields = f ? Object.entries(f) : []
    } catch {
      statusFields = []
    }
  }
  return statusFields
}
// PokemonEntity's numeric @type stats. not duplicates of damage/heal: a POKEMON_DAMAGE can come off shield or hp
// without saying which, and pp/cast-charge has no other event. localized label in replay-event-format
const STAT_FIELDS = [
  "atk",
  "def",
  "speDef",
  "ap",
  "speed",
  "range",
  "critChance",
  "critPower",
  "luck",
  "maxHP",
  "maxPP",
  "hp",
  "pp",
  "shield"
] as const
// camelCase status field to readable label; English fallback for the ~11 combat-internal flags with no status.* locale key
export const statusName = (k: string): string => {
  const s = k.replace(/([a-z])([A-Z])/g, "$1 $2")
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// one entity's last-seen status/stat/position values, the diff baseline; caller keys it by entity
export interface EntitySnap {
  status: Record<string, unknown>
  stats: Record<string, number>
  px?: number
  py?: number
}

// a status/stat/movement change row, structurally a subset of ReplayEvent so it pushes into actions[] without conversion; carries structured args, formatReplayEvent localizes at render
interface CombatScanEvent {
  t: number
  type: "status" | "stat" | "combatmove"
  a: ReplayEventArgs
  uid?: string
  key?: string
}

// push-only sink for scan output, typed as a sink so callers collect into a wider ReplayEvent[]: the contravariant push makes the wider array assignable, no cast
type CombatSink = { push: (e: CombatScanEvent) => void }

// diff one combat entity vs its previous snapshot; push status flips and stat changes (tagged ownerUid) into out, return the new snapshot. name is the raw pokemon enum value
function scanCombatEntity(
  e: Record<string, unknown>,
  prev: EntitySnap | undefined,
  t: number,
  name: string,
  ownerUid: string | undefined,
  out: CombatSink
): EntitySnap {
  const st = e.status as Record<string, unknown> | undefined
  const statusSnap: Record<string, unknown> = {}
  if (st) {
    for (const [k, ty] of getStatusFields(st)) {
      const cur = st[k]
      statusSnap[k] = cur
      const was = prev?.status?.[k]
      // first-sight guard (was != null, like the stat branch): was is undefined the frame an entity first appears, so
      // without it an already-set status false-fires as a fresh application. many statuses are set in the Simulation constructor before the first sync: fight-start baselines, not applications
      if (ty === "number") {
        // a counter status (poisonStacks); fires on any change above zero
        if (typeof cur === "number" && cur > 0 && was != null && cur !== was)
          out.push({
            t,
            type: "status",
            a: { unit: name, field: k, count: cur },
            uid: ownerUid,
            key: k
          })
      } else if (cur === true && was != null && was !== true) {
        out.push({
          t,
          type: "status",
          a: { unit: name, field: k },
          uid: ownerUid,
          key: k
        })
      }
    }
  }
  const statsSnap: Record<string, number> = {}
  for (const k of STAT_FIELDS) {
    const cur = e[k]
    if (typeof cur !== "number") continue
    statsSnap[k] = cur
    const was = prev?.stats?.[k]
    if (was != null && cur !== was) {
      const d = cur - was
      out.push({
        t,
        type: "stat",
        a: { unit: name, field: k, delta: d },
        uid: ownerUid,
        key: k
      })
    }
  }
  // combat movement: the unit stepped to a new tile (one row per step, from and to coalesced). distinct from the
  // prep-phase "move" event (player.board rearrange); this is the in-fight PokemonEntity position, recovered for
  // every board like status/stats. first-sight guarded so the fight-start placement is not a move
  const px = e.positionX
  const py = e.positionY
  if (typeof px === "number" && typeof py === "number") {
    if (
      prev?.px != null &&
      prev?.py != null &&
      (px !== prev.px || py !== prev.py)
    )
      out.push({
        t,
        type: "combatmove",
        a: { unit: name, fromX: prev.px, fromY: prev.py, x: px, y: py },
        uid: ownerUid
      })
  }
  return {
    status: statusSnap,
    stats: statsSnap,
    px: typeof px === "number" ? px : undefined,
    py: typeof py === "number" ? py : undefined
  }
}

type TeamSchema = {
  forEach?: (cb: (e: Record<string, unknown>, id: string) => void) => void
}
type SimSchema = {
  bluePlayerId?: string
  redPlayerId?: string
  blueTeam?: TeamSchema
  redTeam?: TeamSchema
}
// decoded GameState fields scanFrameCombat reads, loosely typed so this module stays game-import-free
export interface CombatFrameState {
  simulations?: { forEach?: (cb: (sim: SimSchema, id: string) => void) => void }
  players?: { get?: (uid: string) => { simulationId?: string } | undefined }
}

// scan one decoded state frame: emit owner-tagged status/stat changes for every simulation's units, diffing against
// prevBySim (persists across frames; a new round's sim is a fresh baseline). owner-tag rule: a team's units belong to
// its player only when that player's simulationId points back to this sim, dropping ghost teams; exception: the PvE opponent side (redValid false) is scanned under blue, and "pve" lives in one sim so no double-count
export function scanFrameCombat(
  state: CombatFrameState,
  prevBySim: Map<string, Map<string, EntitySnap>>,
  t: number,
  out: CombatSink
): void {
  const players = state.players
  state.simulations?.forEach?.((sim, simId) => {
    const blueOwner = sim.bluePlayerId
    const redOwner = sim.redPlayerId
    const blueValid =
      !!blueOwner && players?.get?.(blueOwner)?.simulationId === simId
    const redValid =
      !!redOwner && players?.get?.(redOwner)?.simulationId === simId
    if (!blueValid && !redValid) return
    let prev = prevBySim.get(simId)
    if (!prev) {
      prev = new Map<string, EntitySnap>()
      prevBySim.set(simId, prev)
    }
    const prevMap = prev
    const scanTeam = (team: TeamSchema | undefined, owner: string) => {
      team?.forEach?.((e, id) => {
        // raw pokemon enum value, localized by the formatter via pkm.*
        const nm = (e.name as string) ?? ""
        prevMap.set(id, scanCombatEntity(e, prevMap.get(id), t, nm, owner, out))
      })
    }
    if (blueValid) scanTeam(sim.blueTeam, blueOwner as string)
    if (redValid) scanTeam(sim.redTeam, redOwner as string)
    // PvE opponent side (redPlayerId "pve") scanned under blue; ghost red teams (real player id) stay excluded, no double-count
    else if (blueValid && redOwner === "pve")
      scanTeam(sim.redTeam, blueOwner as string)
  })
}
