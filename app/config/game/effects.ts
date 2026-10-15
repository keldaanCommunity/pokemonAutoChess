import { EffectEnum } from "../../types/enum/Effect"
import { WeatherConfigs } from "./weathers"

export const EffectConfigs = {
  [EffectEnum.LIGHTNING_STRIKE]: WeatherConfigs.STORM,
  [EffectEnum.SANDSTORM]: WeatherConfigs.SANDSTORM
} as const
