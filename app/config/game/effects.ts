import { EffectEnum } from "../../types/enum/Effect"
import type { BalanceConfig } from "./balance"

export const EffectConfigs = {
  [EffectEnum.FLAME_BODY]: {
    burnChance: {
      valuePerTier: [30],
      luckScaling: true
    }
  },
  [EffectEnum.POISONOUS]: {
    poisonChance: {
      valuePerTier: [30],
      luckScaling: true
    }
  },
  [EffectEnum.VENOMOUS]: {
    poisonChance: {
      valuePerTier: [60],
      luckScaling: true
    },
    maxStacksBonus: 1
  },
  [EffectEnum.TOXIC]: {
    poisonChance: {
      valuePerTier: [100],
      luckScaling: true
    },
    maxStacksBonus: 2
  }
} as const satisfies Partial<Record<EffectEnum, BalanceConfig>>

export function getEffectConfig(effect: EffectEnum): BalanceConfig | undefined {
  return (EffectConfigs as Partial<Record<EffectEnum, BalanceConfig>>)[effect]
}
