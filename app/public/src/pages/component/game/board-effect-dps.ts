import { BoardEffectDpsId } from "../../../../../types"

// each row's board effect token, which names both its icon file and its i18n
// key. literal types keep the label a known translation key
const BOARD_EFFECT_DPS_TOKENS = {
  [BoardEffectDpsId.TIDAL_WAVE]: "TIDAL_WAVE",
  [BoardEffectDpsId.CURSE]: "CURSE_DAMAGE",
  [BoardEffectDpsId.SANDSTORM]: "SANDSTORM_DAMAGE",
  [BoardEffectDpsId.STORM]: "LIGHTNING_STRIKE",
  [BoardEffectDpsId.SPIKES]: "SPIKES",
  [BoardEffectDpsId.STEALTH_ROCKS]: "STEALTH_ROCKS",
  [BoardEffectDpsId.HAIL]: "HAIL",
  [BoardEffectDpsId.EMBER]: "EMBER",
  [BoardEffectDpsId.POISON_GAS]: "POISON_GAS",
  [BoardEffectDpsId.TOXIC_SPIKES]: "TOXIC_SPIKES"
} as const satisfies Record<BoardEffectDpsId, string>

type BoardEffectToken = (typeof BOARD_EFFECT_DPS_TOKENS)[BoardEffectDpsId]

const tokenOf = (id: string): BoardEffectToken | undefined =>
  BOARD_EFFECT_DPS_TOKENS[id as BoardEffectDpsId]

export const boardEffectDpsIds = Object.keys(BOARD_EFFECT_DPS_TOKENS)

// the damaging effects, the only ones with a row. the other documented tiles
// appear in the glossary only
export const BOARD_EFFECTS_IN_BATTLE_STATS: ReadonlySet<string> = new Set(
  Object.values(BOARD_EFFECT_DPS_TOKENS)
)

export const boardEffectIconPath = (id: string) =>
  `assets/icons/board_effects/${tokenOf(id)}.svg`

export const boardEffectTextureKey = (id: string) => `board-effect-${id}`

export function getBoardEffectDpsDisplay(id: string):
  | { iconPath: string; labelKey: `effect.${BoardEffectToken}` }
  | undefined {
  const token = tokenOf(id)
  if (!token) return undefined
  return { iconPath: boardEffectIconPath(id), labelKey: `effect.${token}` }
}
