import { EffectEnum } from "../../types/enum/Effect"
import { StatusConfigs } from "./statuses"
import { WeatherConfigs } from "./weathers"

export const EffectConfigs = {
  [EffectEnum.COTTON_BALL]: { durationSeconds: 1 },
  [EffectEnum.ELECTRIC_TERRAIN]: StatusConfigs.ELECTRIC_FIELD,
  [EffectEnum.EMBER]: { damagePerSecond: 10, durationSeconds: 2.2 },
  [EffectEnum.GRASSY_TERRAIN]: StatusConfigs.GRASS_FIELD,
  [EffectEnum.HAIL]: { damage: 10, durationSeconds: 1 },
  [EffectEnum.LIGHTNING_STRIKE]: WeatherConfigs.STORM,
  [EffectEnum.MISTY_TERRAIN]: StatusConfigs.FAIRY_FIELD,
  [EffectEnum.POISON_GAS]: { durationSeconds: 1.5 },
  [EffectEnum.PSYCHIC_TERRAIN]: StatusConfigs.PSYCHIC_FIELD,
  [EffectEnum.SANDSTORM]: WeatherConfigs.SANDSTORM,
  [EffectEnum.SMOKE]: { durationSeconds: 1 },
  [EffectEnum.SPIKES]: { damagePerSecond: 10, durationSeconds: 1 },
  [EffectEnum.STEALTH_ROCKS]: { damagePerSecond: 10, durationSeconds: 1 },
  [EffectEnum.STICKY_WEB]: { durationSeconds: 2 },
  [EffectEnum.STRANGE_STEAM]: { damageBonusPercent: 20 },
  [EffectEnum.SUPERCHARGE]: { speedBonus: 20, shield: 30 },
  [EffectEnum.TIDAL_WAVE]: { healingPercentPerLevel: 10, damagePercentPerLevel: 5, knockbackDelayMs: 500 },
  [EffectEnum.TOXIC_SPIKES]: { durationSeconds: 1 }
} satisfies Partial<Record<EffectEnum, Readonly<Record<string, number>>>>
