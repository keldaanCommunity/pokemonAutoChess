import { reverseMap } from "../../utils/map"
import { EffectEnum } from "./Effect"
import { Passive } from "./Passive"
import { Synergy } from "./Synergy"

export enum Weather {
  SUN = "SUN",
  NIGHT = "NIGHT",
  WINDY = "WINDY",
  MISTY = "MISTY",
  RAIN = "RAIN",
  SNOW = "SNOW",
  STORM = "STORM",
  SANDSTORM = "SANDSTORM",
  BLOODMOON = "BLOODMOON",
  SMOG = "SMOG",
  MURKY = "MURKY",
  NEUTRAL = "NEUTRAL"
}

export const WeatherEffects: ReadonlyMap<Weather, EffectEnum> = new Map([
  [Weather.WINDY, EffectEnum.WINDY],
  [Weather.SNOW, EffectEnum.SNOW],
  [Weather.SMOG, EffectEnum.SMOG],
  [Weather.NIGHT, EffectEnum.NIGHT],
  [Weather.MISTY, EffectEnum.MISTY],
  [Weather.MURKY, EffectEnum.MURKY],

])

export const PassivesAssociatedToWeather: Map<Weather, Passive[]> = new Map([
  [Weather.SUN, [Passive.SUN]],
  [Weather.RAIN, [Passive.RAIN]],
  [Weather.SANDSTORM, [Passive.SANDSTORM]],
  [Weather.MISTY, [Passive.MISTY]],
  [Weather.SNOW, [Passive.SNOW]],
  [Weather.STORM, [Passive.STORM]],
  [Weather.NIGHT, [Passive.NIGHT]],
  [Weather.WINDY, [Passive.WINDY, Passive.LUGIA]],
  [Weather.NEUTRAL, [Passive.AIRLOCK]]
])

export const WeatherAssociatedToSynergy: Map<Synergy, Weather> = new Map([
  [Synergy.FIRE, Weather.SUN],
  [Synergy.WATER, Weather.RAIN],
  [Synergy.GROUND, Weather.SANDSTORM],
  [Synergy.FAIRY, Weather.MISTY],
  [Synergy.ICE, Weather.SNOW],
  [Synergy.ELECTRIC, Weather.STORM],
  [Synergy.DARK, Weather.NIGHT],
  [Synergy.FLYING, Weather.WINDY],
  [Synergy.WILD, Weather.BLOODMOON],
  [Synergy.POISON, Weather.SMOG],
  [Synergy.GHOST, Weather.MURKY],
  [Synergy.NORMAL, Weather.NEUTRAL]
])

export const SynergyAssociatedToWeather = reverseMap(WeatherAssociatedToSynergy)
