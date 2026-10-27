import { EffectEnum } from "../../types/enum/Effect"
import { StatusConfigs } from "./statuses"
import { WeatherConfigs } from "./weathers"

export const EffectConfigs = {
  [EffectEnum.ELECTRIC_TERRAIN]: StatusConfigs.ELECTRIC_FIELD,
  [EffectEnum.GRASSY_TERRAIN]: StatusConfigs.GRASS_FIELD,
  [EffectEnum.LIGHTNING_STRIKE]: WeatherConfigs.STORM,
  [EffectEnum.MISTY_TERRAIN]: StatusConfigs.FAIRY_FIELD,
  [EffectEnum.PSYCHIC_TERRAIN]: StatusConfigs.PSYCHIC_FIELD,
  [EffectEnum.SANDSTORM]: WeatherConfigs.SANDSTORM
} satisfies Partial<Record<EffectEnum, Readonly<Record<string, number>>>>
