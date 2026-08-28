import { Weather } from "../../types/enum/Weather"
import type { BalanceConfig } from "./balance"

export const WeatherConfigs = {
  [Weather.BLOODMOON]: {
    physicalDamageBonusPercent: 20,
    woundDurationBonusPercent: 30
  },
  [Weather.DROUGHT]: {
    statusModifierPercent: 30,
    ppPerSecond: 3
  },
  [Weather.MISTY]: {
    specialDamageBonusPercent: 20,
    charmDurationBonusPercent: 30
  },
  [Weather.MURKY]: {
    luckReduction: 30,
    silenceDurationBonusPercent: 30
  },
  [Weather.NIGHT]: {
    critChanceBonusPercent: 10,
    sleepDurationBonusPercent: 30
  },
  [Weather.RAIN]: {
    ppPerSecond: 3,
    damageReductionPercent: 30
  },
  [Weather.SANDSTORM]: {
    damagePerSecond: 5,
    confusionDurationBonusPercent: 30
  },
  [Weather.SMOG]: {
    accuracyReductionPercent: 15,
    poisonDurationBonusPercent: 30
  },
  [Weather.SNOW]: {
    speedReduction: 10,
    freezeDurationBonusPercent: 30
  },
  [Weather.STORM]: {
    lightningDamage: 100,
    paralysisDurationBonusPercent: 30
  },
  [Weather.WINDY]: {
    speedBonus: 10,
    flyingSpeedBonus: 20
  },
  [Weather.ZENITH]: {
    healingBonusPercent: 20,
    sleepDurationReductionPercent: 30
  }
} as const satisfies Partial<Record<Weather, BalanceConfig>>

export function getWeatherConfig(weather: Weather): BalanceConfig | undefined {
  return (WeatherConfigs as Partial<Record<Weather, BalanceConfig>>)[weather]
}
