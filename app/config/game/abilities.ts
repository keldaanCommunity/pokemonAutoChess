import { Ability } from "../../types/enum/Ability"
import type { BalanceConfig } from "./balance"

export type AbilityConfig = BalanceConfig

export const AbilityConfigs = {
  [Ability.AQUA_RING]: {
    heal: {
      valuePerTier: [20, 40, 80, 160],
      apScaling: 1
    }
  },
  [Ability.BLIZZARD]: {
    damage: {
      valuePerTier: [10, 20, 40, 80],
      apScaling: 1
    },
    freezeDuration: 1.5,
    radius: 4,
    frozenTargetBonusPercent: 30
  },
  [Ability.FIERY_WRATH]: {
    damage: {
      valuePerTier: [30, 40, 50, 80],
      apScaling: 1
    },
    radius: 4,
    flinchChance: {
      valuePerTier: [50],
      luckScaling: true
    },
    flinchDuration: 4
  },
  [Ability.FREEZING_GLARE]: {
    damage: {
      valuePerTier: [20, 40, 80, 160],
      apScaling: 1
    },
    freezeChance: {
      valuePerTier: [50],
      luckScaling: true
    },
    freezeDuration: {
      valuePerTier: [3, 3, 3, 6]
    }
  },
  [Ability.MAGIC_BOUNCE]: {
    reflectedDamagePercent: {
      valuePerTier: [50, 75, 150],
      apScaling: 1
    },
    duration: 4
  },
  [Ability.NATURAL_GIFT]: {
    heal: {
      valuePerTier: [30, 60, 90, 150],
      apScaling: 1
    },
    safeguardDuration: {
      valuePerTier: [1, 2, 3, 6]
    }
  },
  [Ability.PROTECT]: {
    duration: [
      {
        valuePerTier: [0.5, 1.5, 2.5, 4],
        nbDecimals: 1
      },
      {
        valuePerTier: [0.5, 1.5, 2.5, 4],
        apScaling: 1,
        nbDecimals: 1
      }
    ]
  },
  [Ability.SING]: {
    targetCount: {
      valuePerTier: [1, 2, 3, 5]
    },
    sleepDuration: {
      valuePerTier: [2, 2, 2, 4],
      apScaling: 1,
      nbDecimals: 1
    }
  },
  [Ability.STRUGGLE_BUG]: {
    damage: {
      valuePerTier: [10, 20, 30, 60],
      apScaling: 1
    },
    abilityPowerReduction: 30
  },
  [Ability.TAIL_GLOW]: {
    damage: {
      valuePerTier: [10, 20, 30, 60],
      apScaling: 1
    },
    abilityPowerIncrease: 30
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
  Ability.REVELATION_DANCE,
  Ability.SHADOW_FORCE,
  Ability.SKETCH,
  Ability.SKILL_SWAP,
  Ability.SWARM,
  Ability.TRANSE,
  Ability.UNBOUND
]
