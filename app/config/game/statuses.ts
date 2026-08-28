import { Status } from "../../types/enum/Status"
import type { BalanceConfig } from "./balance"

export const StatusConfigs = {
  [Status.ARMOR_BREAK]: {
    effectivenessReductionPercent: 50
  },
  [Status.BLINDED]: {
    accuracyReductionPercent: 50
  },
  [Status.BURN]: {
    maxHpDamagePercent: 5,
    reductionPercent: 50
  },
  [Status.ELECTRIC_FIELD]: {
    damageBonusPercent: 20
  },
  [Status.FAIRY_FIELD]: {
    damageBonusPercent: 20
  },
  [Status.FATIGUE]: {
    ppGainReductionPercent: 50
  },
  [Status.FLINCH]: {
    shieldBypassPercent: 50
  },
  [Status.GRASS_FIELD]: {
    damageBonusPercent: 20
  },
  [Status.LOCKED]: {
    range: 1
  },
  [Status.PARALYSIS]: {
    speedReductionPercent: 50
  },
  [Status.POISONNED]: {
    maxHpDamagePercent: 5,
    maxStacks: 3
  },
  [Status.POKERUS]: {
    intervalSeconds: 3,
    attackGain: 1,
    abilityPowerGain: 10,
    adjacentAllies: 2
  },
  [Status.PSYCHIC_FIELD]: {
    damageBonusPercent: 20
  },
  [Status.RAGE]: {
    speedBonus: 80,
    automaticDelaySeconds: 35
  }
} as const satisfies Partial<Record<Status, BalanceConfig>>

export function getStatusConfig(status: Status): BalanceConfig | undefined {
  return (StatusConfigs as Partial<Record<Status, BalanceConfig>>)[status]
}
