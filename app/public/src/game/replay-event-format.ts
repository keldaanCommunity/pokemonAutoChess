// render-time localization of event-log row content. the index + combat scan emit structured descriptors
// ({ type, a, key }) of raw game-data values (enum names) + numbers, localized here. word order + plurals live in
// the replay.eventlog.row.* templates; game-data nouns route through the game's own locale keys, so a bump needs no new strings for them
import type { TFunction } from "i18next"
import { Transfer } from "../../../types"
import { AttackType, HealType, Stat } from "../../../types/enum/Game"
import { PkmByIndex } from "../../../types/enum/Pokemon"
import { Status } from "../../../types/enum/Status"
import { statusName } from "./replay-combat-scan"

// SCREAMING_SNAKE enum value to Title Case (ICE_SPINNER becomes "Ice Spinner"); derived so it survives a bump
export function prettyName(v: string | undefined | null): string {
  if (!v) return ""
  return v
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

// a picked proposition option: constituent pokemon (a duo expands to two) and/or an item
export type PickOption = { pkms?: string[]; item?: string }

// structured params an event carries instead of a pre-built label; loose by design, each type's formatter case is the authority on its shape
export type ReplayEventArgs = {
  [k: string]: string | number | boolean | string[] | PickOption[] | undefined
}

// a dynamic t(`pkm.${v}`) widens to ${string} and fails the typed t; route runtime-keyed game-data namespaces through this escape hatch, static keys keep the typed t
type TD = (key: string, opts?: Record<string, unknown>) => string
const typedT = (t: TFunction): TD => t as unknown as TD

export const pkmName = (t: TFunction, v: string): string => typedT(t)(`pkm.${v}`)
const abilityName = (t: TFunction, v: string): string =>
  typedT(t)(`ability.${v}`)
export const itemName = (t: TFunction, v: string): string => typedT(t)(`item.${v}`)
export const mapName = (t: TFunction, v: string): string =>
  typedT(t)(`map.${v}`, { defaultValue: prettyName(v) })
export const synergyName = (t: TFunction, v: string): string =>
  typedT(t)(`synergy.${v}`)
const weatherLabel = (t: TFunction, v: string): string =>
  typedT(t)(`weather.${v}`)
const effectLabel = (t: TFunction, v: string): string =>
  typedT(t)(`effect.${v}`, { defaultValue: prettyName(v) })
// SpecialGameRule (scribble mode) to its canonical scribble.* label; derived-English fallback for an unknown rule
const ruleName = (t: TFunction, v: string): string =>
  typedT(t)(`scribble.${v}`, { defaultValue: prettyName(v) })
// AttackType (numeric enum) reverse-lookup into the damage.* locale keys ("physical damage", …), so a reorder tracks automatically
const damageType = (t: TFunction, n: number | undefined): string =>
  typedT(t)(`damage.${AttackType[n ?? AttackType.PHYSICAL] ?? "PHYSICAL"}`)

// camelCase status field to the game's Status enum value (also its status.* label key); typed to Status so a renamed
// member fails tsc. names diverge from fields (armorReduction is ARMOR_BREAK, poisonStacks is POISONNED, enraged is
// RAGE). the other ~11 fields have no status.* label key (some, like spikeArmor/magicBounce/reflect, have a Status
// member but no label string) and fall back to statusName()
const STATUS_LOCALE_KEY: Record<string, Status> = {
  burn: Status.BURN,
  silence: Status.SILENCE,
  fatigue: Status.FATIGUE,
  poisonStacks: Status.POISONNED,
  freeze: Status.FREEZE,
  protect: Status.PROTECT,
  sleep: Status.SLEEP,
  confusion: Status.CONFUSION,
  wound: Status.WOUND,
  resurrection: Status.RESURRECTION,
  paralysis: Status.PARALYSIS,
  pokerus: Status.POKERUS,
  possessed: Status.POSSESSED,
  locked: Status.LOCKED,
  blinded: Status.BLINDED,
  armorReduction: Status.ARMOR_BREAK,
  runeProtect: Status.RUNE_PROTECT,
  charm: Status.CHARM,
  flinch: Status.FLINCH,
  electricField: Status.ELECTRIC_FIELD,
  psychicField: Status.PSYCHIC_FIELD,
  grassField: Status.GRASS_FIELD,
  fairyField: Status.FAIRY_FIELD,
  curse: Status.CURSE,
  enraged: Status.RAGE
}
// camelCase stat field to the game's Stat enum value (also the stat.* locale key); typed to Stat so a renamed member fails tsc. maxHP has no Stat member (only HP / MAX_PP exist), derived-English fallback
const STAT_LOCALE_KEY: Record<string, Stat> = {
  atk: Stat.ATK,
  def: Stat.DEF,
  speDef: Stat.SPE_DEF,
  ap: Stat.AP,
  speed: Stat.SPEED,
  range: Stat.RANGE,
  critChance: Stat.CRIT_CHANCE,
  critPower: Stat.CRIT_POWER,
  luck: Stat.LUCK,
  maxPP: Stat.MAX_PP,
  hp: Stat.HP,
  pp: Stat.PP,
  shield: Stat.SHIELD
}

// localized status/stat label; also feeds the sub-filter chips (chip localizes, stored token stays the field name)
export const statusLabel = (t: TFunction, field: string): string => {
  const k = STATUS_LOCALE_KEY[field]
  return k ? typedT(t)(`status.${k}`) : statusName(field)
}
export const statLabel = (t: TFunction, field: string): string => {
  const k = STAT_LOCALE_KEY[field]
  return k
    ? typedT(t)(`stat.${k}`)
    : field === "maxHP"
      ? "Max HP"
      : prettyName(field)
}

// phase token (PICK / FIGHT / TOWN) to localized word; reuses the game's own "Fight" / "Town", only "Pick" needs a replay key. unknown values pass through
const PHASE_KEY: Record<
  string,
  "replay.eventlog.phase.pick" | "fight" | "wiki.nav.town_label"
> = {
  PICK: "replay.eventlog.phase.pick",
  FIGHT: "fight",
  TOWN: "wiki.nav.town_label"
}
export const phaseWord = (t: TFunction, label: string): string => {
  const k = PHASE_KEY[label]
  return k ? t(k) : label
}

// signed gold delta with the in-game "g" unit, e.g. "+2g" / "-3g"
const goldStr = (n: number): string => `${n > 0 ? "+" : ""}${n}g`

// one picked option to its display string: "Pkm (+ Pkm) (Item)" or, item-only, "Item"
const pickOption = (t: TFunction, o: PickOption): string => {
  if (o.pkms && o.pkms.length) {
    const base = o.pkms.map((p) => pkmName(t, p)).join(" + ")
    return o.item ? `${base} (${itemName(t, o.item)})` : base
  }
  return o.item ? itemName(t, o.item) : ""
}

// localize a structured per-player / elimination / combat-scan event. defensive wrapper: a malformed or foreign-capture
// descriptor yields "" instead of throwing; the event-log memo runs eagerly outside the error boundary, so a throw here white-screens the viewer
export function formatReplayEvent(
  t: TFunction,
  ev: { type: string; a?: ReplayEventArgs; key?: string }
): string {
  try {
    return formatReplayEventRow(t, ev)
  } catch {
    return ""
  }
}

function formatReplayEventRow(
  t: TFunction,
  ev: { type: string; a?: ReplayEventArgs; key?: string }
): string {
  const a = ev.a ?? {}
  const ROW_KEY = "replay.eventlog.row"
  switch (ev.type) {
    case "elimination":
      return t(`${ROW_KEY}.elimination`, { player: String(a.player ?? "") })
    case "round": {
      // PvE opponents (a.isPvE) are themselves locale keys that t() resolves; PvP opponents are the display name verbatim. shiny PvE wraps the name
      const opp = a.isPvE
        ? typedT(t)(String(a.opponent))
        : String(a.opponent || "opponent")
      const opponent =
        a.isPvE && a.shiny ? t(`${ROW_KEY}.shiny_opponent`, { opponent: opp }) : opp
      return a.result === "win"
        ? t(`${ROW_KEY}.round_win`, { opponent })
        : a.result === "loss"
          ? t(`${ROW_KEY}.round_loss`, { opponent })
          : t(`${ROW_KEY}.round_draw`, { opponent })
    }
    case "region":
      return t(`${ROW_KEY}.region`, { region: mapName(t, String(a.map)) })
    // a Normal-synergy scarf grant reads like any bench pickup, so reuse the shared "Got {{item}}" copy
    case "scarf":
      return t(`${ROW_KEY}.got_item`, { item: itemName(t, String(a.item)) })
    case "hatch":
      return t(`${ROW_KEY}.hatch`, { pkm: pkmName(t, String(a.pkm)) })
    case "evolve":
      return t(`${ROW_KEY}.evolve`, {
        from: pkmName(t, String(a.from)),
        to: pkmName(t, String(a.to))
      })
    case "buy":
      return a.gold != null
        ? t(`${ROW_KEY}.shop_gold`, {
            pkm: pkmName(t, String(a.pkm)),
            gold: goldStr(Number(a.gold))
          })
        : pkmName(t, String(a.pkm))
    case "remove":
      return pkmName(t, String(a.pkm))
    case "sell":
      return a.gold != null
        ? t(`${ROW_KEY}.shop_gold`, {
            pkm: pkmName(t, String(a.pkm)),
            gold: goldStr(Number(a.gold))
          })
        : pkmName(t, String(a.pkm))
    case "reroll":
      return a.gold != null
        ? t(`${ROW_KEY}.reroll`, { gold: goldStr(Number(a.gold)) })
        : t(`${ROW_KEY}.shop_refresh`)
    case "xp":
      return t(`${ROW_KEY}.xp`, {
        amount: Number(a.amount),
        gold: goldStr(Number(a.gold))
      })
    case "egg":
      return a.golden
        ? t(`${ROW_KEY}.egg_golden`, { pkm: pkmName(t, String(a.pkm)) })
        : t(`${ROW_KEY}.egg_named`, { pkm: pkmName(t, String(a.pkm)) })
    case "fish":
      return t(`${ROW_KEY}.fish`, { pkm: pkmName(t, String(a.pkm)) })
    case "gained":
      return t(`${ROW_KEY}.gained`, { pkm: pkmName(t, String(a.pkm)) })
    case "item":
      return t(`${ROW_KEY}.got_item`, { item: itemName(t, String(a.item)) })
    case "equip":
      return t(`${ROW_KEY}.equip`, {
        item: itemName(t, String(a.item)),
        unit: pkmName(t, String(a.unit))
      })
    case "unequip":
      return t(`${ROW_KEY}.unequip`, {
        item: itemName(t, String(a.item)),
        unit: pkmName(t, String(a.unit))
      })
    case "craft": {
      const c0 = itemName(t, String(a.c0))
      const c1 = itemName(t, String(a.c1))
      const result = itemName(t, String(a.result))
      return a.unit != null
        ? t(`${ROW_KEY}.craft_on`, {
            c0,
            c1,
            result,
            unit: pkmName(t, String(a.unit))
          })
        : t(`${ROW_KEY}.craft`, { c0, c1, result })
    }
    case "move":
      return t(`${ROW_KEY}.move`, {
        pkm: pkmName(t, String(a.pkm)),
        x: Number(a.x),
        y: Number(a.y)
      })
    case "combatmove":
      return t(`${ROW_KEY}.combatmove`, {
        unit: pkmName(t, String(a.unit)),
        fromX: Number(a.fromX),
        fromY: Number(a.fromY),
        x: Number(a.x),
        y: Number(a.y)
      })
    case "level":
      return t(`${ROW_KEY}.level`, { level: Number(a.level) })
    case "synergy":
      return t(`${ROW_KEY}.synergy`, {
        synergy: synergyName(t, String(a.synergy)),
        count: Number(a.count)
      })
    case "berry":
      return t(`${ROW_KEY}.berry_ripe`, { berry: itemName(t, String(a.berry)) })
    case "berries": {
      const list = (a.list as string[] | undefined) ?? []
      return t(`${ROW_KEY}.berry_trees`, {
        list: list.map((b) => itemName(t, b)).join(", ")
      })
    }
    case "flower":
      return t(`${ROW_KEY}.flower`, { flower: pkmName(t, String(a.flower)) })
    case "wanderer":
      return t(`${ROW_KEY}.wanderer`, { pkm: pkmName(t, String(a.pkm)) })
    case "pick": {
      const options = (a.options as PickOption[] | undefined) ?? []
      const idx = Number(a.chosenIdx ?? 0)
      const chosen = pickOption(t, options[idx] ?? {})
      const alts = options
        .filter((_, i) => i !== idx)
        .map((o) => pickOption(t, o))
      return alts.length
        ? t(`${ROW_KEY}.pick_over`, { chosen, alternatives: alts.join(", ") })
        : t(`${ROW_KEY}.pick`, { chosen })
    }
    case "town":
      return t(`${ROW_KEY}.town`, { npc: prettyName(String(a.npc)) })
    case "rule":
      return t(`${ROW_KEY}.rule`, { rule: ruleName(t, String(a.rule)) })
    case "weather":
      return t(`${ROW_KEY}.weather`, { weather: weatherLabel(t, String(a.weather)) })
    case "status":
      return a.field === "poisonStacks"
        ? t(`${ROW_KEY}.status_poison`, {
            unit: pkmName(t, String(a.unit)),
            count: Number(a.count)
          })
        : t(`${ROW_KEY}.status`, {
            unit: pkmName(t, String(a.unit)),
            status: statusLabel(t, String(a.field))
          })
    case "stat": {
      const d = Number(a.delta)
      return t(`${ROW_KEY}.stat`, {
        unit: pkmName(t, String(a.unit)),
        stat: statLabel(t, String(a.field)),
        delta: `${d > 0 ? "+" : ""}${d}`
      })
    }
    default:
      return ""
  }
}

// render-time info threaded from the index for a message row: combat caster/target unit names, the camera owner (ignored here), dig-site / income breakdowns
export type FrameInfo = {
  caster?: string
  target?: string
  owner?: string
  dig?: { x: number; y: number; depth: number }
  income?: { base: number; interest: number; streak: number }
}

// localize a ROOM_DATA message frame (camera-scoped combat rows + POV economy/flavor): every noun routes through the
// game locale, every sentence through a replay.eventlog.row.* template. defensive: an unknown payload yields "", never throws
export function formatMessageRow(
  t: TFunction,
  type: string,
  payload: unknown,
  info?: FrameInfo
): string {
  const p = payload as Record<string, unknown> | number | null
  const ROW_KEY = "replay.eventlog.row"
  try {
    switch (type) {
      case Transfer.ABILITY: {
        // caster + skill only: broadcastAbility defaults targetX/Y to the caster's attack-enemy, so a self/ally effect would
        // mis-render as hitting an enemy; the real target is the adjacent damage/heal row's
        const o = p as {
          skill?: string
          positionX?: number
          positionY?: number
        }
        const skill = abilityName(t, String(o?.skill))
        if (info?.caster)
          return t(`${ROW_KEY}.cast`, { caster: pkmName(t, info.caster), skill })
        // no resolved caster: a caster-less / team-wide cast (e.g. TIDAL_WAVE's (0,0) sentinel) has no meaningful tile, so render the skill alone
        if (o?.positionX == null || (o.positionX === 0 && o.positionY === 0))
          return skill
        return t(`${ROW_KEY}.cast_at`, { skill, x: o.positionX, y: o.positionY })
      }
      case Transfer.POKEMON_DAMAGE: {
        const o = p as {
          index?: string
          amount?: number
          type?: number
          x?: number
          y?: number
        }
        const src = o?.index ? pkmName(t, PkmByIndex[o.index]) : "?"
        const target = info?.target
          ? pkmName(t, info.target)
          : `(${o?.x},${o?.y})`
        return t(`${ROW_KEY}.dmg`, {
          src,
          amount: o?.amount ?? "?",
          type: damageType(t, o?.type),
          target
        })
      }
      case Transfer.POKEMON_HEAL: {
        const o = p as {
          index?: string
          amount?: number
          type?: number
          x?: number
          y?: number
        }
        const src = o?.index ? pkmName(t, PkmByIndex[o.index]) : "?"
        const target = info?.target
          ? pkmName(t, info.target)
          : `(${o?.x},${o?.y})`
        return o?.type === HealType.SHIELD
          ? t(`${ROW_KEY}.heal_shield`, { src, amount: o?.amount ?? "?", target })
          : t(`${ROW_KEY}.heal`, { src, amount: o?.amount ?? "?", target })
      }
      case Transfer.BOARD_EVENT: {
        const o = p as { effect?: string; x?: number; y?: number }
        return t(`${ROW_KEY}.board_effect`, {
          effect: effectLabel(t, String(o?.effect)),
          x: o?.x,
          y: o?.y
        })
      }
      case Transfer.DISPLAY_TEXT: {
        // DisplayText is either ability.<ABILITY> (a big cast) or a snake_case status key, both valid locale keys t() resolves; unknown values fall back to derived English
        const o = p as { text?: string }
        const text = String(o?.text ?? "")
        return typedT(t)(text, {
          defaultValue: prettyName(text.replace(/^ability\./, ""))
        })
      }
      case Transfer.PLAYER_DAMAGE: {
        const n =
          typeof p === "number" ? p : ((p as { value?: number })?.value ?? 0)
        return t(`${ROW_KEY}.life_lost`, { count: n })
      }
      case Transfer.PLAYER_INCOME: {
        const total =
          typeof p === "number" ? p : (p as { value?: number })?.value
        if (total == null) return t(`${ROW_KEY}.income_plain`, { total: "?" })
        const b = info?.income
        if (b) {
          const parts = [t(`${ROW_KEY}.income_base`, { n: b.base })]
          if (b.interest)
            parts.push(t(`${ROW_KEY}.income_interest`, { n: b.interest }))
          if (b.streak) parts.push(t(`${ROW_KEY}.income_streak`, { n: b.streak }))
          return t(`${ROW_KEY}.income`, { total, parts: parts.join(" + ") })
        }
        return t(`${ROW_KEY}.income_plain`, { total })
      }
      case Transfer.FINAL_RANK:
        return t(`${ROW_KEY}.placed`, {
          rank:
            typeof p === "number"
              ? p
              : ((p as { value?: number })?.value ?? "?")
        })
      case Transfer.PRELOAD_MAPS:
        return Array.isArray(payload)
          ? t(`${ROW_KEY}.region_maps`, { count: payload.length })
          : ""
      case Transfer.LOADING_COMPLETE:
        return t(`${ROW_KEY}.game_start`)
      case Transfer.GAME_END:
        return t(`${ROW_KEY}.game_over`)
      case Transfer.COOK: {
        // COOK is only broadcast when the chef produced at least one dish, so always list them
        const o = p as { dishes?: string[] }
        return t(`${ROW_KEY}.cooked`, {
          dishes: (Array.isArray(o?.dishes) ? o.dishes : [])
            .map((d) => itemName(t, d))
            .join(", ")
        })
      }
      case Transfer.DIG: {
        // one composable "dig" row (income-style fragments): optional site + optional treasure
        const o = p as { buriedItem?: string | null }
        const d = info?.dig
        const where = d
          ? t(`${ROW_KEY}.dig_site`, { x: d.x, y: d.y, depth: d.depth })
          : ""
        const found = o?.buriedItem
          ? t(`${ROW_KEY}.dig_treasure`, { item: itemName(t, o.buriedItem) })
          : ""
        return t(`${ROW_KEY}.dig`, { where, found })
      }
      case Transfer.NPC_DIALOG: {
        const o = p as { npc?: string; dialog?: string }
        return t(`${ROW_KEY}.npc_dialog`, {
          npc: prettyName(String(o?.npc)),
          dialog: o?.dialog ?? ""
        }).trim()
      }
      case Transfer.SHOW_EMOTE:
        return t(`${ROW_KEY}.emote`)
      default:
        return ""
    }
  } catch {
    return ""
  }
}
