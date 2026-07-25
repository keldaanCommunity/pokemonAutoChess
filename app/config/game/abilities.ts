import { Ability } from "../../types/enum/Ability"

export type AbilityConfigValue = number | readonly number[]
export type AbilityConfig = Readonly<Record<string, AbilityConfigValue>>

export const AbilityConfigs = {
  [Ability.AQUA_RING]: {
    heal: [20, 40, 80, 160]
  },
  [Ability.BLIZZARD]: {
    damage: [10, 20, 40, 80],
    freezeDuration: 1.5,
    radius: 4,
    frozenTargetBonusPercent: 30
  },
  [Ability.FREEZING_GLARE]: {
    damage: [20, 40, 80, 160],
    freezeChance: 50,
    freezeDuration: [3, 3, 3, 6]
  },
  [Ability.PROTECT]: {
    duration: [0.5, 1.5, 2.5, 4]
  },
  [Ability.STRUGGLE_BUG]: {
    damage: [10, 20, 30, 60],
    abilityPowerReduction: 30
  }
} as const satisfies Partial<Record<Ability, AbilityConfig>>

export function getAbilityConfig(ability: Ability): AbilityConfig | undefined {
  return (AbilityConfigs as Partial<Record<Ability, AbilityConfig>>)[ability]
}

export const InimitableAbilities: Ability[] = [
  Ability.ASSIST,
  Ability.AURA_WHEEL,
  Ability.ENCORE,
  Ability.HIDDEN_POWER_A,
  Ability.HIDDEN_POWER_B,
  Ability.HIDDEN_POWER_C,
  Ability.HIDDEN_POWER_D,
  Ability.HIDDEN_POWER_E,
  Ability.HIDDEN_POWER_EM,
  Ability.HIDDEN_POWER_F,
  Ability.HIDDEN_POWER_G,
  Ability.HIDDEN_POWER_H,
  Ability.HIDDEN_POWER_I,
  Ability.HIDDEN_POWER_J,
  Ability.HIDDEN_POWER_K,
  Ability.HIDDEN_POWER_L,
  Ability.HIDDEN_POWER_M,
  Ability.HIDDEN_POWER_N,
  Ability.HIDDEN_POWER_O,
  Ability.HIDDEN_POWER_P,
  Ability.HIDDEN_POWER_Q,
  Ability.HIDDEN_POWER_QM,
  Ability.HIDDEN_POWER_R,
  Ability.HIDDEN_POWER_S,
  Ability.HIDDEN_POWER_T,
  Ability.HIDDEN_POWER_U,
  Ability.HIDDEN_POWER_V,
  Ability.HIDDEN_POWER_W,
  Ability.HIDDEN_POWER_X,
  Ability.HIDDEN_POWER_Y,
  Ability.HIDDEN_POWER_Z,
  Ability.KNOWLEDGE_THIEF,
  Ability.MAGNET_PULL,
  Ability.METRONOME,
  Ability.MIMIC,
  Ability.SHADOW_FORCE,
  Ability.SKETCH,
  Ability.SKILL_SWAP,
  Ability.SWARM
]
