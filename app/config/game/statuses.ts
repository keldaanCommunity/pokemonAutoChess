import { Status } from "../../types/enum/Status"
import { isIn } from "../../utils/array"
import { keys } from "../../utils/object"

type StatusConfig = Readonly<Record<string, number>>

export const StatusConfigs = {
  [Status.ARMOR_BREAK]: { effectivenessReductionPercent: 50 },
  [Status.BLINDED]: { accuracyReductionPercent: 50 },
  [Status.BURN]: { maxHpDamagePercent: 5, reductionPercent: 50, intervalSeconds: 1 },
  [Status.CHARM]: { damageDurationReductionMs: 500 },
  [Status.CONFUSION]: { bypassChancePercent: 50 },
  [Status.CURSE]: { cleanseDelayMs: 2000 },
  [Status.ELECTRIC_FIELD]: { damageBonusPercent: 20 },
  [Status.FAIRY_FIELD]: { damageBonusPercent: 20 },
  [Status.FATIGUE]: { ppGainReductionPercent: 50 },
  [Status.FLINCH]: { shieldBypassPercent: 50 },
  [Status.GRASS_FIELD]: { damageBonusPercent: 20 },
  [Status.LOCKED]: { range: 1 },
  [Status.PARALYSIS]: { speedReductionPercent: 50 },
  [Status.POISONED]: { maxHpDamagePercent: 5, maxStacks: 3, intervalSeconds: 1 },
  [Status.POKERUS]: { intervalSeconds: 3, attackGain: 1, abilityPowerGain: 10, adjacentAllies: 2 },
  [Status.PSYCHIC_FIELD]: { damageBonusPercent: 20 },
  [Status.RAGE]: { speedBonus: 80, automaticDelaySeconds: 35, damageMultiplier: 2, reductionPercent: 50 },
  [Status.RESURRECTING]: { delayMs: 2000 },
  [Status.SLEEP]: { damageDurationReductionMs: 300 }
} satisfies Partial<Record<Status, StatusConfig>>

export function getStatusConfig(status: Status): StatusConfig {
  return isIn(keys(StatusConfigs), status) ? StatusConfigs[status] : {}
}
