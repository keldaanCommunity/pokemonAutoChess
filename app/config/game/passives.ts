import { Passive } from "../../types/enum/Passive"
import type { BalanceConfig } from "./balance"

export const PassiveConfigs = {
  [Passive.SPOT_PANDA]: {
    additionalDamagePercent: {
      valuePerTier: [100],
      apScaling: 1
    }
  }
} as const satisfies Partial<Record<Passive, BalanceConfig>>

export function getPassiveConfig(passive: Passive): BalanceConfig | undefined {
  return (PassiveConfigs as Partial<Record<Passive, BalanceConfig>>)[passive]
}
