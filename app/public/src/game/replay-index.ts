import { SchemaSerializer } from "@colyseus/sdk"
import type { Iterator } from "@colyseus/schema"
import type GameState from "../../../rooms/states/game-state"
import type Player from "../../../models/colyseus-models/player"
import { getPokemonData } from "../../../models/precomputed/precomputed-pokemon-data"
import { getLevelUpCost } from "../../../models/colyseus-models/experience-manager"
import { PVEStages } from "../../../models/pve-stages"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../../config/game/board"
import { PortalCarouselStages } from "../../../config/game/stages"
import { SynergyTiersThresholds } from "../../../config/game/synergies"
import {
  BattleResult,
  GamePhaseState,
  Orientation,
  PokemonActionState
} from "../../../types/enum/Game"
import { ItemRecipe } from "../../../types/enum/Item"
import { Pkm, PkmDuos } from "../../../types/enum/Pokemon"
import { Synergy } from "../../../types/enum/Synergy"
import { Weather } from "../../../types/enum/Weather"
import { Transfer } from "../../../types"
import type { ReplayFrame } from "./replay-format"
import {
  type CombatFrameState,
  type EntitySnap,
  scanFrameCombat
} from "./replay-combat-scan"
import type { PickOption, ReplayEventArgs } from "./replay-event-format"

// derived phase/stage/event index over a throwaway decode (raw .colreplay untouched); computed once per manifest (replay.tsx), not per seek

export const REPLAY_INDEX_SCHEMA_VERSION = 2

const PHASE_LABEL: Record<number, string> = {
  [GamePhaseState.PICK]: "PICK",
  [GamePhaseState.FIGHT]: "FIGHT",
  [GamePhaseState.TOWN]: "TOWN"
}

export interface ReplaySegment {
  t: number // absolute ms
  stage: number
  phase: number // GamePhaseState
  phaseLabel: string
}

// band colour by phase: TOWN is "portal" on PortalCarouselStages else "carousel", PICK is "prep"; all FIGHT share one "fight" band (no PvE/PvP split)
export function segmentBandKind(
  seg: ReplaySegment
): "prep" | "fight" | "carousel" | "portal" {
  if (seg.phase === GamePhaseState.FIGHT) return "fight"
  if (seg.phase === GamePhaseState.TOWN)
    return PortalCarouselStages.includes(seg.stage) ? "portal" : "carousel"
  return "prep"
}
interface ReplayStageMark {
  stage: number
  t: number // absolute ms the stage first appears
}
// "elimination" is any player's life crossing 0; the rest are per-player actions diffed from synced state
// @view hides only the shop, so we derive for every player; shop-only signals (reroll/"remove"/buy-vs-gained) fire for the pov alone
export type ReplayEventType =
  | "elimination"
  | "reroll"
  | "buy"
  | "remove" // shop slot cleared via "e" (REMOVE_FROM_SHOP), not a buy
  | "sell"
  | "evolve"
  | "hatch" // egg hatched into a pokemon
  | "egg" // Baby synergy laid an egg
  | "fish" // Water synergy fished onto the bench
  | "berry" // Grass: berry tree ripened to stage 3; harvest surfaces as an item gain
  | "flower" // Flora: a potted flower evolved (mulch-fed)
  | "wanderer" // a catchable wandering pokemon appeared
  | "gained" // a unit appeared on the bench from another effect (wanderer catch, reward…)
  | "round" // a fight resolved: win / loss / draw (player.history)
  | "synergy" // player.synergies crossed a SynergyTiersThresholds threshold
  | "town" // a town-encounter NPC appeared (state.townEncounter; shared)
  | "region" // a player entered a new region (player.map; all players, owner-tagged)
  | "scarf" // Normal tier bump granted a bench scarf (scarvesItems; not a craft)
  | "weather" // a fight started with weather other than NEUTRAL, any board, owner-tagged
  | "berries" // a player's berry-tree species repopulated (berryTreesType; all players)
  | "rule" // special game rule in effect (state.specialGameRule; scribble modes)
  | "status" // a combat status flipped on, any board, owner-tagged (entity.status)
  | "stat" // a combat stat changed, any board, owner-tagged (entity stat field)
  | "item" // item entered player.items with no unit losing it (pve/town/synergy/dig)
  | "craft" // components combined into a completed item (bench-combine or onto a unit)
  | "equip" // item left player.items onto a board unit
  | "unequip" // item returned from a board unit to player.items
  | "move" // a board unit's (x,y) changed (deploy / bench / rearrange); own "positioning" chip
  | "combatmove" // an in-fight unit stepped to a new tile, any board, owner-tagged (scanFrameCombat); own "moves" chip
  | "level"
  | "xp" // bought experience (level-up gold for 4 XP); OnLevelUpCommand
  | "pick"

// added/removed diff of two string multisets; duplicates matter (two of the same component)
function multisetDiff(
  prev: string[],
  cur: string[]
): { added: string[]; removed: string[] } {
  const count = (arr: string[]) => {
    const m = new Map<string, number>()
    for (const x of arr) m.set(x, (m.get(x) ?? 0) + 1)
    return m
  }
  const a = count(prev)
  const b = count(cur)
  const added: string[] = []
  const removed: string[] = []
  b.forEach((n, k) => {
    for (let j = 0; j < n - (a.get(k) ?? 0); j++) added.push(k)
  })
  a.forEach((n, k) => {
    for (let j = 0; j < n - (b.get(k) ?? 0); j++) removed.push(k)
  })
  return { added, removed }
}

// is `evolved` a (divergent-ok) evolution of `base`? distinguishes a real evolution from a coincidental remove+add
function evolvesTo(base: string, evolved: string): boolean {
  const d = getPokemonData(base as Pkm)
  return (
    d?.evolution === evolved ||
    (d?.evolutions?.includes(evolved as Pkm) ?? false)
  )
}

// every PvE opponent name a round can store (PVEStages[*].name): "pkm.<species>" + boss keys ("tower_duo"…); derived from source so new bosses need no edit
const PVE_OPPONENT_NAMES = new Set<string>(
  Object.values(PVEStages).map((s) => s.name)
)

export interface ReplayEvent {
  t: number // absolute ms
  type: ReplayEventType
  // structured args for the formatter (raw enums + numbers, localized by formatReplayEvent); absent when none
  a?: ReplayEventArgs
  uid?: string
  // optional sub-type for the fine-grained filter: stat field ("Speed") or status name ("Burn"); absent when type is already the granularity
  key?: string
}
export interface ReplayIndex {
  schemaVersion: number
  gameStartMs: number // first LOADING_COMPLETE; the controls' 0:00 re-base origin
  durationMs: number
  segments: ReplaySegment[] // phase-within-stage boundaries, anchored at/after gameStartMs
  stages: ReplayStageMark[] // first t per distinct stage
  events: ReplayEvent[] // eliminations sorted by t; drive the scrubber's event markers
  // per-player actions (reroll/buy/sell/…) sorted by t, each carries uid (town/rule rows uid-less); separate from events so they don't flood the scrubber
  actions: ReplayEvent[]
  // in-game name per uid (per-player log column / tab labels)
  playerNames: Record<string, string>
  // per message-frame: caster/target names resolved by tile (keyed by simId,x,y) + owner, the tagged player
  combatUnits: Record<
    number,
    { caster?: string; target?: string; owner?: string }
  >
  // DIG frames (own pov): dig tile (x,y) + post-dig depth, capped at 5 (from state; the payload lacks both)
  digInfo: Record<number, { x: number; y: number; depth: number }>
  // PLAYER_INCOME frames (own pov): round-income base/interest/streak split when it reconciles (else just the total)
  incomeInfo: Record<number, { base: number; interest: number; streak: number }>
  // message-frame indices for another player (room.broadcast leak), hidden from this single-pov log
  foreignFrames: number[]
}

// a proposition entry is Pkm | PkmDuo; expand a duo to its two constituents (PkmDuos) to match the chosen
// entry against the units that appeared; a plain Pkm is its own constituent
const propositionConstituents = (p: string): string[] =>
  // own-key check, not `in`: p comes from the untrusted file, and a hostile "constructor" would resolve up the
  // prototype chain and throw when spread (mirrors the null-proto playerNames hardening below)
  Object.prototype.hasOwnProperty.call(PkmDuos, p)
    ? [...PkmDuos[p as keyof typeof PkmDuos]]
    : [p]

// full slate of a player.choices entry, snapshotted per frame to recover the options when a choice resolves (leaves player.choices)
type ChoiceSlate = { type: string; pokemons: string[]; items: string[] }

// eliminated the frame life first crosses from positive to <= 0; pure so the crossing logic is unit-testable
function isElimination(
  prevLife: number | undefined,
  life: number
): boolean {
  return typeof prevLife === "number" && prevLife > 0 && life <= 0
}

// min shop slots refreshed to non-empty to read as a reroll; a buy empties one and refreshes none, so 3+ signals a roll
const REROLL_MIN_REFRESHED_SLOTS = 3

// unit occupying a tile in a sim; combat messages key units by (simId,x,y) to name a caster/target
function unitAt(
  state: GameState,
  simId: string | undefined,
  x: number | undefined,
  y: number | undefined
): string | undefined {
  if (!simId || x == null || y == null) return undefined
  const sim = state.simulations?.get(simId)
  if (!sim) return undefined
  let name: string | undefined
  const scan = (
    team:
      | {
          forEach?: (
            cb: (e: {
              positionX?: number
              positionY?: number
              name?: string
            }) => void
          ) => void
        }
      | undefined
  ) =>
    team?.forEach?.((e) => {
      if (e?.positionX === x && e?.positionY === y) name = e.name
    })
  scan((sim as { blueTeam?: unknown }).blueTeam as never)
  scan((sim as { redTeam?: unknown }).redTeam as never)
  return name
}

// which player owns a board tile (x,y), for owner-tagging a BOARD_EVENT (payload carries no player): a unit on the tile gives
// its team, else the board half (blue is bottom); returns owner only when its simulationId points back here (drops ghost/PvE)
function simTileOwner(
  state: GameState,
  simId: string | undefined,
  x: number | undefined,
  y: number | undefined
): string | undefined {
  if (!simId || x == null || y == null) return undefined
  const sim = state.simulations?.get(simId) as
    | {
        bluePlayerId?: string
        redPlayerId?: string
        blueTeam?: {
          forEach?: (
            cb: (e: { positionX?: number; positionY?: number }) => void
          ) => void
        }
        redTeam?: {
          forEach?: (
            cb: (e: { positionX?: number; positionY?: number }) => void
          ) => void
        }
      }
    | undefined
  if (!sim) return undefined
  let side: "blue" | "red" | undefined
  sim.blueTeam?.forEach?.((e) => {
    if (e?.positionX === x && e?.positionY === y) side = "blue"
  })
  sim.redTeam?.forEach?.((e) => {
    if (e?.positionX === x && e?.positionY === y) side = "red"
  })
  if (!side) side = y < BOARD_HEIGHT / 2 ? "blue" : "red"
  const owner = side === "blue" ? sim.bluePlayerId : sim.redPlayerId
  return owner && state.players?.get(owner)?.simulationId === simId
    ? owner
    : undefined
}

// TIDAL_WAVE broadcasts both teams at a fixed (0,0) sentinel tile (simulation.ts triggerTidalWave), so simTileOwner(0,0)
// always resolves to blue and mis-files the red wave; resolve owner from orientation (UP blue/bottom, DOWN red/top), validated by the same sim-points-back check (drops ghost/PvE)
function tidalWaveOwner(
  state: GameState,
  simId: string | undefined,
  orientation: string | undefined
): string | undefined {
  if (!simId) return undefined
  const sim = state.simulations?.get(simId) as
    | { bluePlayerId?: string; redPlayerId?: string }
    | undefined
  if (!sim) return undefined
  const owner =
    orientation === Orientation.DOWN ? sim.redPlayerId : sim.bluePlayerId
  return owner && state.players?.get(owner)?.simulationId === simId
    ? owner
    : undefined
}

// casts sent with room.broadcast (every client), so the recorded camera doesn't identify their board: owner-tag by the
// payload tile's own sim. currently TIDAL_WAVE + CURSE_EFFECT; other room.broadcast(Transfer.ABILITY) casts resolve the same way
const ROOM_BROADCAST_ABILITIES = new Set(["TIDAL_WAVE", "CURSE_EFFECT"])

// which player's board holds unitId; attributes a room.broadcast DIG/COOK (payload pokemonId) to its owner, undefined if on no board
function playerOwningUnit(
  state: GameState,
  unitId: string
): string | undefined {
  let owner: string | undefined
  state.players?.forEach((p, uid) => {
    if (!owner && p.board?.get(unitId)) owner = uid
  })
  return owner
}

// where the pov's dig landed; depth increments in a deferred setTimeout after the broadcast, so groundHoles[index] is pre-dig (post-dig = min(it+1, 5), Ground caps at 5)
// only the Ground hole-dig touches groundHoles; Pachirisu's berry-dig (passives.ts) also broadcasts DIG but doesn't, so return undefined (no bogus depth)
function digSite(
  state: GameState,
  uid: string,
  unitId: string
): { x: number; y: number; depth: number } | undefined {
  const player = state.players?.get(uid)
  const unit = player?.board?.get(unitId)
  if (!unit || unit.positionX == null || unit.positionY == null)
    return undefined
  if (!unit.types?.has(Synergy.GROUND)) return undefined
  const x = unit.positionX
  const y = unit.positionY
  const holes = player?.groundHoles
  const before = holes ? (holes[(y - 1) * BOARD_WIDTH + x] ?? 0) : 0
  return { x, y, depth: Math.min(before + 1, 5) }
}

// per-player previous frame the diff compares against (refreshed each state frame); shop is empty for non-pov players (@view), so shop branches skip them
interface PlayerSnapshot {
  money: number | undefined
  level: number | undefined
  shop: string[]
  board: Map<string, string> // unit id to name
  choices: Map<string, ChoiceSlate> // choice id to its offered slate
  historyLen: number
  items: string[] // bench items (multiset)
  unitItems: Map<string, string[]> // unit id to pokemon.items
  unitPos: Map<string, { x: number; y: number }> // unit id to (positionX, positionY)
  synSteps: Map<string, number> // synergy to active tier step
  berryStages: number[]
  berryTypes: string[] // filtered species list (for the repopulate diff)
  flowers: string[]
  wandererIds: Set<string>
  map: string | undefined
  scarves: string[]
}

type DeriveCtx = {
  t: number
  specialGameRule: Parameters<typeof getLevelUpCost>[0]
  shinyEncounter: boolean
}

// derive one player's state-diff events this frame vs the prior snapshot; runs for every player, but shop-only signals need the @view-hidden shop so fire for the pov alone.
// pure (returns events + fresh snapshot); first frame has prev undefined so baseline only; combat (status/stat/weather) stays in buildReplayIndex
function derivePlayerStateEvents(
  p: Player,
  prev: PlayerSnapshot | undefined,
  ctx: DeriveCtx
): {
  events: { t: number; type: ReplayEventType; a: ReplayEventArgs }[]
  snap: PlayerSnapshot
} {
  const events: { t: number; type: ReplayEventType; a: ReplayEventArgs }[] = []
  const push = (type: ReplayEventType, a: ReplayEventArgs) =>
    events.push({ t: ctx.t, type, a })

  // current-frame reads (needed for the snapshot regardless of prev)
  const money = p.money
  const level = p.experienceManager?.level
  const map = p.map
  const scarves = p.scarvesItems
    ? [...(p.scarvesItems as Iterable<string>)]
    : []
  const shop = p.shop ? Array.from(p.shop as ArrayLike<string>) : []
  const board = new Map<string, string>()
  const unitItems = new Map<string, string[]>()
  const unitPos = new Map<string, { x: number; y: number }>()
  p.board?.forEach((u, id) => {
    board.set(id, u.name)
    unitItems.set(id, u.items ? [...(u.items as Iterable<string>)] : [])
    unitPos.set(id, { x: u.positionX ?? 0, y: u.positionY ?? 0 })
  })
  const choices = new Set<string>()
  const choiceSlates = new Map<string, ChoiceSlate>()
  p.choices?.forEach((c) => {
    choices.add(c.id)
    choiceSlates.set(c.id, {
      type: c.type,
      pokemons: c.pokemons ? [...(c.pokemons as Iterable<string>)] : [],
      items: c.items ? [...(c.items as Iterable<string>)] : []
    })
  })
  const items = p.items ? Array.from(p.items as ArrayLike<string>) : []
  const historyLen = p.history?.length ?? 0
  // synergy tier step: how many SynergyTiersThresholds thresholds the current count meets (mirrors getSynergyStep)
  const synSteps = new Map<string, number>()
  p.synergies?.forEach((count, syn) => {
    const triggers = SynergyTiersThresholds[syn as Synergy] ?? []
    let step = 0
    for (const tr of triggers) if ((count ?? 0) >= tr) step++
    if (step > 0) synSteps.set(syn, step)
  })
  const berryStages = p.berryTreesStages
    ? Array.from(p.berryTreesStages as ArrayLike<number>)
    : []
  const berryTypes = p.berryTreesType
    ? Array.from(p.berryTreesType as ArrayLike<string>)
    : []
  const species = berryTypes.filter(Boolean)
  const flowers: string[] = []
  p.flowerPots?.forEach((pot) => flowers.push(pot?.name ?? ""))
  const wandererIds = new Set<string>()
  const wandererPkm = new Map<string, string>()
  p.wanderers?.forEach((w, id) => {
    wandererIds.add(id)
    wandererPkm.set(id, (w as { pkm?: string })?.pkm ?? "")
  })

  if (prev) {
    // region change: player.map is set to the portal's destination when one is taken
    if (prev.map !== undefined && map && map !== prev.map)
      push("region", { map })
    // Normal-synergy scarf grant: a bench scarf via scarvesItems at a tier bump (outside player.items, so the item diff misses it)
    for (const x of multisetDiff(prev.scarves, scarves).added)
      push("scarf", { item: x })

    // choices resolved this frame: present last frame, gone now. the slate is what the pick was made from; timeout auto-pick can resolve several
    const resolved = [...prev.choices]
      .filter(([id]) => !choices.has(id))
      .map(([, slate]) => slate)
    // set by the board branch on a combined pokemon+item pick; the item branch consumes it without re-logging
    let combinedPickItem: string | null = null

    {
      const dMoney =
        typeof money === "number" && typeof prev.money === "number"
          ? money - prev.money
          : 0
      const levelUpCost = getLevelUpCost(ctx.specialGameRule)
      const added = [...board].filter(([id]) => !prev.board.has(id))
      const removed = [...prev.board].filter(([id]) => !board.has(id))
      const choiceResolved = resolved.length > 0
      // a pokemon proposition resolved: match the chosen entry against the units that appeared (a duo adds both); null if no board add matches
      const pokeSlate = resolved.find((s) => s.pokemons.length > 0)
      // structured pick options (chosen + alternatives), formatted at render: each is its constituent pokemon (duo is both) + optional item
      let pokePick: { options: PickOption[]; chosenIdx: number } | null = null
      if (pokeSlate) {
        const addedNames = new Set(added.map(([, n]) => n))
        const chosenIdx = pokeSlate.pokemons.findIndex((pp) =>
          propositionConstituents(pp).some((c) => addedNames.has(c))
        )
        if (chosenIdx >= 0) {
          const withItems = pokeSlate.items.length > 0
          const options: PickOption[] = pokeSlate.pokemons.map((pp, i) => ({
            pkms: propositionConstituents(pp),
            ...(withItems && pokeSlate.items[i]
              ? { item: pokeSlate.items[i] }
              : {})
          }))
          pokePick = { options, chosenIdx }
          if (withItems && pokeSlate.items[chosenIdx])
            combinedPickItem = pokeSlate.items[chosenIdx]
        }
      }
      const boardChanged =
        added.length > 0 || removed.length > 0 || board.size !== prev.board.size
      // slots cleared to Pkm.DEFAULT: a buy (also board.set, so boardChanged) or a "remove" ("e", never touches the board); empty for non-pov (shop not synced)
      const emptied: string[] = []
      for (let s = 0; s < prev.shop.length && s < shop.length; s++) {
        if (prev.shop[s] !== Pkm.DEFAULT && shop[s] === Pkm.DEFAULT)
          emptied.push(prev.shop[s])
      }
      const refreshed = shop.filter(
        (s, k) => s !== prev.shop[k] && s !== Pkm.DEFAULT
      ).length

      // evolution: a board churn where an added unit is the evolution of a removed one (or a same-species combine);
      // detected independently of the shop branch, so a 3-combine on buy emits both a buy and an evolve
      if (added.length && removed.length) {
        if (removed.some(([, n]) => n === Pkm.EGG)) {
          push("hatch", { pkm: added[0][1] })
        } else {
          let pair: [string, string] | undefined
          for (const [, ev] of added) {
            const base = removed.find(([, b]) => evolvesTo(b, ev))?.[1]
            if (base) {
              pair = [base, ev]
              break
            }
          }
          if (!pair && added.length === 1) {
            const counts = new Map<string, number>()
            for (const [, b] of removed) counts.set(b, (counts.get(b) ?? 0) + 1)
            const combinedBase = [...counts].find(([, n]) => n >= 2)?.[0]
            if (combinedBase) pair = [combinedBase, added[0][1]]
          }
          if (pair) push("evolve", { from: pair[0], to: pair[1] })
        }
      }

      // priority so one underlying shop action emits one event (buy/remove/reroll need the shop, so pov only)
      if (emptied.length) {
        const kind = boardChanged ? "buy" : "remove"
        emptied.forEach((name) => {
          const withGold = kind === "buy" && emptied.length === 1 && dMoney < 0
          push(kind, withGold ? { pkm: name, gold: dMoney } : { pkm: name })
        })
      } else if (choiceResolved && added.length) {
        push(
          "pick",
          pokePick ?? { options: [{ pkms: [added[0][1]] }], chosenIdx: 0 }
        )
      } else if (
        removed.length &&
        !added.length &&
        removed.length <= 3 &&
        p.alive !== false
      ) {
        // sell: a board unit leaves with no add and no shop-slot buy (structural, mode-independent)
        push(
          "sell",
          dMoney > 0
            ? { pkm: removed[0][1], gold: dMoney }
            : { pkm: removed[0][1] }
        )
      } else if (!boardChanged && refreshed >= REROLL_MIN_REFRESHED_SLOTS) {
        push("reroll", dMoney < 0 ? { gold: dMoney } : {})
      } else if (
        dMoney === -levelUpCost &&
        !boardChanged &&
        emptied.length === 0 &&
        refreshed === 0
      ) {
        push("xp", { amount: 4, gold: dMoney })
      } else if (added.length && !removed.length) {
        // a unit appeared with no buy/pick/evolution: Baby egg, Water fish, or a free gain (a non-pov real buy lands here too, reads as "Gained")
        for (const [id, name] of added) {
          if (name === Pkm.EGG) {
            const egg = p.board.get(id)
            const hatchPkm =
              egg?.evolution && egg.evolution !== Pkm.DEFAULT
                ? egg.evolution
                : ""
            push("egg", { pkm: hatchPkm, golden: !!egg?.shiny })
          } else if (p.board.get(id)?.action === PokemonActionState.FISH) {
            push("fish", { pkm: name })
          } else {
            push("gained", { pkm: name })
          }
        }
      }
      if (
        typeof level === "number" &&
        typeof prev.level === "number" &&
        level > prev.level
      ) {
        push("level", { level })
      }
    }

    // round results: each new player.history entry is a resolved fight (win/loss/draw vs opponent)
    if (p.history && historyLen > prev.historyLen) {
      for (let h = prev.historyLen; h < historyLen; h++) {
        const hi = p.history.at(h)
        if (!hi) continue
        // PvE opponent names are locale keys ("pkm.MAGIKARP" / boss keys), PvP names display names; isPvE lets the formatter localize only the former; result is a stable token so it needn't import BattleResult
        const isPvE =
          hi.name?.startsWith("pkm.") || PVE_OPPONENT_NAMES.has(hi.name)
        const result =
          hi.result === BattleResult.WIN
            ? "win"
            : hi.result === BattleResult.DEFEAT
              ? "loss"
              : "draw"
        push("round", {
          result,
          opponent: hi.name,
          isPvE: !!isPvE,
          shiny: ctx.shinyEncounter
        })
      }
    }

    // item events: classify the player.items diff against per-unit pokemon.items moves (equip / craft / unequip / sell-return / gain)
    {
      const { added: pAdded, removed: pRemoved } = multisetDiff(
        prev.items,
        items
      )
      type UnitDelta = {
        id: string
        name: string
        item: string
        present: boolean
      }
      const uGained: UnitDelta[] = []
      const uLost: UnitDelta[] = []
      const ids = new Set<string>([
        ...prev.unitItems.keys(),
        ...unitItems.keys()
      ])
      for (const id of ids) {
        // raw pokemon enum value (formatter localizes via pkm.*)
        const name = board.get(id) ?? prev.board.get(id) ?? ""
        const present = board.has(id)
        const d = multisetDiff(
          prev.unitItems.get(id) ?? [],
          unitItems.get(id) ?? []
        )
        for (const it of d.added) uGained.push({ id, name, item: it, present })
        for (const it of d.removed) uLost.push({ id, name, item: it, present })
      }
      const takeStr = (arr: string[], x: string): boolean => {
        const k = arr.indexOf(x)
        if (k < 0) return false
        arr.splice(k, 1)
        return true
      }
      const takeUnit = (
        arr: UnitDelta[],
        pred: (u: UnitDelta) => boolean
      ): UnitDelta | undefined => {
        const k = arr.findIndex(pred)
        return k < 0 ? undefined : arr.splice(k, 1)[0]
      }

      // 0) item proposition pick: a resolved item-slate choice whose chosen item entered player.items; log as a pick and consume it so it isn't re-read as craft/gain
      const itemSlate = resolved.find((s) => s.items.length > 0)
      if (itemSlate) {
        if (itemSlate.pokemons.length > 0) {
          const chosen =
            combinedPickItem ??
            itemSlate.items.find((it) => pAdded.includes(it))
          if (chosen) takeStr(pAdded, chosen)
        } else {
          const chosen = itemSlate.items.find((it) => pAdded.includes(it))
          if (chosen) {
            takeStr(pAdded, chosen)
            // item-only proposition: chosen first (chosenIdx 0), then the alternatives, each an item option
            const options: PickOption[] = [
              chosen,
              ...itemSlate.items.filter((it) => it !== chosen)
            ].map((it) => ({ item: it }))
            push("pick", { options, chosenIdx: 0 })
          }
        }
      }

      // 1) on-unit craft: a unit gained result R and lost component D, player.items lost C, ItemRecipe[R]={C,D}
      for (let g = uGained.length - 1; g >= 0; g--) {
        const R = uGained[g].item
        const recipe = ItemRecipe[R as keyof typeof ItemRecipe]
        if (!recipe || recipe.length !== 2) continue
        const lostD = uLost.find(
          (u) =>
            u.id === uGained[g].id &&
            (u.item === recipe[0] || u.item === recipe[1])
        )
        if (!lostD) continue
        const C = lostD.item === recipe[0] ? recipe[1] : recipe[0]
        if (!pRemoved.includes(C)) continue
        takeStr(pRemoved, C)
        takeUnit(uLost, (u) => u === lostD)
        push("craft", {
          c0: recipe[0],
          c1: recipe[1],
          result: R,
          unit: uGained[g].name
        })
        uGained.splice(g, 1)
      }

      // 2) bench craft (player.items only): a result enters and both its components leave player.items
      for (let a = pAdded.length - 1; a >= 0; a--) {
        const recipe = ItemRecipe[pAdded[a] as keyof typeof ItemRecipe]
        if (!recipe || recipe.length !== 2) continue
        const i0 = pRemoved.indexOf(recipe[0])
        if (i0 < 0) continue
        const rest = [...pRemoved]
        rest.splice(i0, 1)
        if (rest.indexOf(recipe[1]) < 0) continue
        pRemoved.splice(pRemoved.indexOf(recipe[0]), 1)
        pRemoved.splice(pRemoved.indexOf(recipe[1]), 1)
        push("craft", { c0: recipe[0], c1: recipe[1], result: pAdded[a] })
        pAdded.splice(a, 1)
      }

      // 3) equip: player.items lost X and a unit gained X this frame
      for (let i = pRemoved.length - 1; i >= 0; i--) {
        const u = takeUnit(uGained, (g) => g.item === pRemoved[i])
        if (u) {
          push("equip", { item: pRemoved[i], unit: u.name })
          pRemoved.splice(i, 1)
        }
      }

      // 4) remaining player.items additions: unequip return (unit still present), sell return (deleted unit, suppress since sell already fired), else a genuine gain
      for (const x of pAdded) {
        const u = takeUnit(uLost, (l) => l.item === x)
        if (u) {
          if (u.present) push("unequip", { item: x, unit: u.name })
        } else {
          push("item", { item: x })
        }
      }
    }

    // positioning: any board unit whose (x,y) changed (deploy / bench / rearrange); own chip, default off
    unitPos.forEach((pos, id) => {
      const prv = prev.unitPos.get(id)
      if (prv && (prv.x !== pos.x || prv.y !== pos.y)) {
        push("move", { pkm: board.get(id) ?? "", x: pos.x, y: pos.y })
      }
    })

    // synergy thresholds: player.synergies crossing a SynergyTiersThresholds tier (increase only)
    synSteps.forEach((step, syn) => {
      const prv = prev.synSteps.get(syn) ?? 0
      if (step > prv) {
        const triggers = SynergyTiersThresholds[syn as Synergy] ?? []
        for (let s = prv; s < step; s++)
          push("synergy", { synergy: syn, count: triggers[s] })
      }
    })

    // Grass: a berry tree ripened (stage reached 3); berryTypes[i] names the berry (an item.* key)
    for (let i = 0; i < berryStages.length; i++) {
      if ((prev.berryStages[i] ?? 0) < 3 && (berryStages[i] ?? 0) >= 3) {
        push("berry", { berry: berryTypes[i] ?? "" })
      }
    }
    // berry-tree species set: repopulates on each portal (fires alongside a region change)
    if (species.length > 0 && species.join() !== prev.berryTypes.join()) {
      push("berries", { list: species })
    }

    // Flora: a flower in a pot evolved in place (mulch-fed)
    for (let i = 0; i < flowers.length; i++) {
      const prv = prev.flowers[i]
      if (
        prv &&
        flowers[i] &&
        prv !== flowers[i] &&
        evolvesTo(prv, flowers[i])
      ) {
        push("flower", { flower: flowers[i] })
      }
    }

    // wanderer: a catchable pokemon appeared (player.wanderers gains a fresh-uuid entry)
    wandererIds.forEach((id) => {
      if (!prev.wandererIds.has(id))
        push("wanderer", { pkm: wandererPkm.get(id) ?? "" })
    })
  }

  const snap: PlayerSnapshot = {
    money,
    level,
    shop,
    board,
    choices: choiceSlates,
    historyLen,
    items,
    unitItems,
    unitPos,
    synSteps,
    berryStages,
    berryTypes: species,
    flowers,
    wandererIds,
    map,
    scarves
  }
  return { events, snap }
}

export function buildReplayIndex(
  frames: ReplayFrame[],
  viewerUid?: string
): ReplayIndex {
  const ser = new SchemaSerializer<GameState>()
  let hasState = false
  let gameStartMs: number | null = null
  let durationMs = 0

  const segments: ReplaySegment[] = []
  const events: ReplayEvent[] = [] // eliminations only (scrubber markers + log)
  const actions: ReplayEvent[] = [] // pov reroll/buy/sell/level/pick (log only)
  const combatUnits: Record<
    number,
    { caster?: string; target?: string; owner?: string }
  > = {}
  const digInfo: Record<number, { x: number; y: number; depth: number }> = {} // pov digs: tile + depth
  const incomeInfo: Record<
    number,
    { base: number; interest: number; streak: number }
  > = {} // round income
  const foreignFrames: number[] = [] // non-pov DIG/COOK/SHOW_EMOTE message frames (room.broadcast leak)
  // in-game name per uid, accumulated across all frames: a leaver is dropped from state.players but their owner-tagged rows remain, so keep the name for their filter chip.
  // null-proto: viewerUid/uids come from an untrusted file, so a hostile "__proto__" reads as undefined
  // (a plain {} would hit Object.prototype, render as a React child, and crash the log)
  const playerNames: Record<string, string> = Object.create(null)

  let prevPhase: number | undefined
  let prevStage: number | undefined
  let prevTownEncounter: string | null | undefined // state.townEncounter (shared town NPC)
  let prevRule: string | null | undefined // state.specialGameRule (scribble mode; set once at start)
  // combat-entity tracking (status + stats) for every board, owner-tagged (scanFrameCombat). prevBySim:
  // simId to (entity id to last snapshot), persists across frames (a new round's sim id is a fresh baseline); all 8 players (no @view)
  const prevBySim = new Map<string, Map<string, EntitySnap>>()
  const lifePrev = new Map<string, number>()
  const eliminated = new Set<string>()

  // a PLAYER_INCOME message awaiting its breakdown, resolved on the next PICK-phase frame (once this round's interest/streak have patched in)
  let pendingIncome: { idx: number; total: number } | null = null
  // per-player previous-frame snapshot keyed by uid; the diff baseline for derivePlayerStateEvents, undefined until a player's first state frame
  const prevByPlayer = new Map<string, PlayerSnapshot>()
  const prevWeatherBySim = new Map<string, string>() // simId to its last non-NEUTRAL weather (all boards)

  for (let i = 0; i < frames.length; i++) {
    const f = frames[i]
    durationMs = Math.max(durationMs, f.t)

    if (f.kind === "message") {
      if (f.type === Transfer.LOADING_COMPLETE && gameStartMs === null)
        gameStartMs = f.t
      // ABILITY/POKEMON_DAMAGE/POKEMON_HEAL/DISPLAY_TEXT are broadcastToSpectators (only the camera's clients), so tag by the recorded camera (owner);
      // a scouted fight shows under that player. unit names still resolve against the message's simId
      if (
        hasState &&
        (f.type === Transfer.ABILITY ||
          f.type === Transfer.POKEMON_DAMAGE ||
          f.type === Transfer.POKEMON_HEAL ||
          f.type === Transfer.DISPLAY_TEXT)
      ) {
        const state = ser.getState()
        const pl = f.payload as {
          id?: string
          skill?: string
          positionX?: number
          positionY?: number
          targetX?: number
          targetY?: number
          x?: number
          y?: number
          orientation?: string
        }
        const pov = viewerUid ? state.players?.get(viewerUid) : undefined
        const owner = pov?.spectatedPlayerId
        // death/leave force spectatedPlayerId back to self without resetting the server broadcast filter, so a dead/left pov still receives
        // the last-scouted board's combat while the schema reads self; tagging by owner would mis-file it, so drop as foreign (a re-spectating pov, spectatedPlayerId not self, is kept)
        const cameraSelfForced = owner === viewerUid && pov?.alive === false
        if (f.type === Transfer.ABILITY) {
          // only the caster: the ABILITY target (targetX/Y) is the attack-enemy by default, so it mis-names self/ally effects; the log drops it
          const caster = unitAt(state, pl?.id, pl?.positionX, pl?.positionY)
          if (pl?.skill && ROOM_BROADCAST_ABILITIES.has(pl.skill)) {
            // a room.broadcast cast: tag by the payload tile's own sim, else hide (unresolved / ghost-PvE go to foreignFrames).
            // TIDAL_WAVE excepted: its (0,0) sentinel is identical for both teams, so resolve owner from orientation and drop the (0,0) caster
            const isTidal = pl.skill === "TIDAL_WAVE"
            const boardOwner = isTidal
              ? tidalWaveOwner(state, pl?.id, pl?.orientation)
              : simTileOwner(state, pl?.id, pl?.positionX, pl?.positionY)
            if (boardOwner)
              combatUnits[i] = isTidal
                ? { owner: boardOwner }
                : { caster, owner: boardOwner }
            else foreignFrames.push(i)
          } else if (cameraSelfForced) {
            foreignFrames.push(i)
          } else {
            combatUnits[i] = { caster, owner }
          }
        } else if (cameraSelfForced) {
          foreignFrames.push(i)
        } else if (f.type === Transfer.DISPLAY_TEXT) {
          combatUnits[i] = { owner } // no tile to name; just carry the camera owner
        } else {
          const target = unitAt(state, pl?.id, pl?.x, pl?.y)
          combatUnits[i] = { target, owner }
        }
      }
      // owner-tag the room.broadcast player events (every client gets all of them): DIG/COOK by the unit's owner (payload.pokemonId),
      // SHOW_EMOTE by payload.id, BOARD_EVENT by the tile's sim side (simTileOwner); unresolved / ghost-PvE hidden (foreignFrames)
      if (viewerUid) {
        if (f.type === Transfer.SHOW_EMOTE) {
          const id = (f.payload as { id?: string })?.id
          // fail-hidden: an unresolved owner must not fall through to the pov (would attribute another player's emote), so hide the frame
          if (id) combatUnits[i] = { owner: id }
          else foreignFrames.push(i)
        } else if (hasState && (f.type === Transfer.DIG || f.type === Transfer.COOK)) {
          const pid = (f.payload as { pokemonId?: string })?.pokemonId
          const owner = pid ? playerOwningUnit(ser.getState(), pid) : undefined
          if (owner) {
            combatUnits[i] = { owner }
            if (f.type === Transfer.DIG && pid) {
              const site = digSite(ser.getState(), owner, pid)
              if (site) digInfo[i] = site
            }
          } else {
            foreignFrames.push(i) // owner unresolved, hide rather than mis-attribute to the pov
          }
        } else if (hasState && f.type === Transfer.BOARD_EVENT) {
          const bp = f.payload as {
            simulationId?: string
            x?: number
            y?: number
          }
          const owner = simTileOwner(
            ser.getState(),
            bp?.simulationId,
            bp?.x,
            bp?.y
          )
          if (owner) combatUnits[i] = { owner }
          else foreignFrames.push(i)
        }
      }
      // round-income breakdown: PLAYER_INCOME (pov-only client.send) carries just the total; income = base + interest + streak (computeIncome).
      // the message arrives before this round's interest/streak patch, so defer the breakdown to the next PICK-phase frame (resolved below)
      if (hasState && viewerUid && f.type === Transfer.PLAYER_INCOME) {
        const total =
          typeof f.payload === "number"
            ? f.payload
            : (f.payload as { value?: number })?.value
        if (typeof total === "number") pendingIncome = { idx: i, total }
      }
      continue
    }

    try {
      const bytes = f.bytes ?? new Uint8Array(0)
      const it: Iterator = { offset: f.offset ?? 1 }
      if (f.kind === "handshake") ser.handshake(bytes, it)
      else if (f.kind === "state") {
        ser.setState(bytes, it)
        hasState = true
      } else ser.patch(bytes, it)
    } catch {
      continue // a bad frame shouldn't sink the index; ReplayRoom drives the actual playback
    }
    if (!hasState) continue

    const state = ser.getState()
    const ph = state.phase
    const st = state.stageLevel
    if (
      typeof ph === "number" &&
      typeof st === "number" &&
      (ph !== prevPhase || st !== prevStage)
    ) {
      segments.push({
        t: f.t,
        stage: st,
        phase: ph,
        phaseLabel: PHASE_LABEL[ph] ?? String(ph)
      })
      prevPhase = ph
      prevStage = st
    }

    // town encounter: a shared game-level NPC (state.townEncounter), not pov-specific; its rewards land in player state separately
    const te = state.townEncounter ?? null
    if (prevTownEncounter !== undefined && te && te !== prevTownEncounter) {
      actions.push({ t: f.t, type: "town", a: { npc: te } })
    }
    prevTownEncounter = te

    // special game rule (scribble modes), set once at game start, never changes; log its first sighting
    const rule = state.specialGameRule ?? null
    if (rule && rule !== prevRule) {
      actions.push({ t: f.t, type: "rule", a: { rule } })
    }
    prevRule = rule

    state.players?.forEach((p, uid) => {
      if (p?.name) playerNames[uid] = p.name
      const life = p.life
      if (typeof life !== "number") return
      if (isElimination(lifePrev.get(uid), life) && !eliminated.has(uid)) {
        eliminated.add(uid)
        events.push({ t: f.t, type: "elimination", uid, a: { player: p.name } })
      }
      lifePrev.set(uid, life)
    })

    // pov-only income breakdown: resolve PLAYER_INCOME's base/interest/streak split now that this PICK frame's interest/streak have landed
    const pov = viewerUid ? state.players?.get(viewerUid) : undefined
    if (pov && pendingIncome && ph === GamePhaseState.PICK) {
      // base = total - interest - streak; the PICK-phase gate rejects combat/kill gold (same message, during FIGHT).
      // real base is always a positive multiple of 5, so show the breakdown only when it works out to that (also rejects a not-yet-patched loss-streak reset, base 2-4)
      const interest = typeof pov.interest === "number" ? pov.interest : 0
      const streak = Math.min(
        typeof pov.streak === "number" ? pov.streak : 0,
        5
      )
      const base = pendingIncome.total - interest - streak
      if (base >= 5 && base % 5 === 0)
        incomeInfo[pendingIncome.idx] = { base, interest, streak }
      pendingIncome = null
    }

    // all-boards weather: sim.weather syncs for every sim (no @view); emit owner-tagged to each real player when a fight first turns non-NEUTRAL (low-volume)
    const simsForWeather = state.simulations as unknown as
      | {
          forEach?: (
            cb: (
              sim: {
                weather?: string
                bluePlayerId?: string
                redPlayerId?: string
              },
              id: string
            ) => void
          ) => void
        }
      | undefined
    simsForWeather?.forEach?.((sim, simId) => {
      const weather = sim.weather
      if (
        !weather ||
        weather === Weather.NEUTRAL ||
        weather === prevWeatherBySim.get(simId)
      )
        return
      prevWeatherBySim.set(simId, weather)
      for (const owner of [sim.bluePlayerId, sim.redPlayerId]) {
        if (owner && state.players?.get(owner)?.simulationId === simId)
          actions.push({ t: f.t, type: "weather", a: { weather }, uid: owner })
      }
    })

    // all-boards combat (status + stats + movement): diff every sim's units, owner-tagged (scanFrameCombat handles ghost/PvE); feeds the default-off Status/Stats/Moves categories
    scanFrameCombat(
      state as unknown as CombatFrameState,
      prevBySim,
      f.t,
      actions
    )

    // per-player state-diff events, run for every player and tagged with uid; shop-only signals (reroll/"remove"/buy-vs-gained) fire for the pov alone
    const deriveCtx: DeriveCtx = {
      t: f.t,
      specialGameRule: state.specialGameRule,
      shinyEncounter: !!state.shinyEncounter
    }
    state.players?.forEach((p, uid) => {
      const { events: playerEvents, snap } = derivePlayerStateEvents(
        p,
        prevByPlayer.get(uid),
        deriveCtx
      )
      for (const e of playerEvents)
        actions.push({ t: e.t, type: e.type, a: e.a, uid })
      prevByPlayer.set(uid, snap)
    })
  }

  // collapse everything before game start (a phantom loading-screen TOWN/stage-0) into one carousel segment at gameStartMs so "seek to start" lands on the carousel (mirrors ReplayRoom.gameStartMs)
  const origin = gameStartMs ?? segments[0]?.t ?? 0
  const opener = segments.filter((s) => s.t <= origin).at(-1)
  const indexedSegments: ReplaySegment[] = [
    ...(opener ? [{ ...opener, t: origin }] : []),
    ...segments.filter((s) => s.t > origin)
  ]

  const stages: ReplayStageMark[] = []
  const seen = new Set<number>()
  for (const s of indexedSegments) {
    if (!seen.has(s.stage)) {
      seen.add(s.stage)
      stages.push({ stage: s.stage, t: s.t })
    }
  }

  return {
    schemaVersion: REPLAY_INDEX_SCHEMA_VERSION,
    gameStartMs: origin,
    durationMs,
    segments: indexedSegments,
    stages,
    events: events.sort((a, b) => a.t - b.t),
    actions: actions.sort((a, b) => a.t - b.t),
    combatUnits,
    digInfo,
    incomeInfo,
    foreignFrames,
    playerNames
  }
}

// navigation helpers (pure; used by ReplayControls)
// EPS is a grace window so "prev" near a boundary goes to the previous one (iPod behaviour); "next" never re-selects the current segment
const EPS = 500

const marks = (index: ReplayIndex, kind: "segments" | "stages"): number[] =>
  (kind === "segments" ? index.segments : index.stages).map((m) => m.t)

// first boundary strictly after the current time (+grace), or null if already at/after the last
function nextMark(ts: number[], currentMs: number): number | null {
  return ts.find((t) => t > currentMs + EPS) ?? null
}
// last boundary strictly before the current time (-grace), or null if already at/before the first
function prevMark(ts: number[], currentMs: number): number | null {
  return [...ts].reverse().find((t) => t < currentMs - EPS) ?? null
}

export const nextPhase = (i: ReplayIndex, ms: number) =>
  nextMark(marks(i, "segments"), ms)
export const prevPhase = (i: ReplayIndex, ms: number) =>
  prevMark(marks(i, "segments"), ms)
export const nextStage = (i: ReplayIndex, ms: number) =>
  nextMark(marks(i, "stages"), ms)
export const prevStage = (i: ReplayIndex, ms: number) =>
  prevMark(marks(i, "stages"), ms)

// the segment live at a given time (for labelling "you are here")
export function segmentAt(
  index: ReplayIndex,
  ms: number
): ReplaySegment | null {
  let cur: ReplaySegment | null = null
  for (const s of index.segments) {
    if (s.t <= ms + EPS) cur = s
    else break
  }
  return cur ?? index.segments[0] ?? null
}
