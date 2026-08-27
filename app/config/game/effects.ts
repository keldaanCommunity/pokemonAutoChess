import { EffectEnum } from "../../types/enum/Effect"
import type { BalanceConfig } from "./balance"

export const EffectConfigs = {
  [EffectEnum.FLAME_BODY]: {
    burnChance: {
      valuePerTier: [30],
      luckScaling: true
    }
  }
} as const satisfies Partial<Record<EffectEnum, BalanceConfig>>

export function getEffectConfig(effect: EffectEnum): BalanceConfig | undefined {
  return (EffectConfigs as Partial<Record<EffectEnum, BalanceConfig>>)[effect]
}
