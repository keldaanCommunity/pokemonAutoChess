import { Effect } from "./Effect";
import { Passive } from "./Passive"
import { Synergy } from "./Synergy"
import { reverseMap } from "../../utils/map"

export enum Weather {
  SUN = "SUN",
  NIGHT = "NIGHT",
  WINDY = "WINDY",
  MISTY = "MISTY",
  RAIN = "RAIN",  
  SNOW = "SNOW",
  STORM = "STORM",
  SANDSTORM = "SANDSTORM",
  NEUTRAL = "NEUTRAL"
}

export const WeatherPassives: Map<Passive, Weather> = new Map([
  [Passive.SUN, Weather.SUN],
  [Passive.RAIN, Weather.RAIN],
  [Passive.SANDSTORM, Weather.SANDSTORM],
  [Passive.MISTY, Weather.MISTY],
  [Passive.SNOW, Weather.SNOW],
  [Passive.STORM, Weather.STORM],
  [Passive.NIGHT, Weather.NIGHT],
  [Passive.WINDY, Weather.WINDY],
  [Passive.AIRLOCK, Weather.NEUTRAL]
])

export const PassiveAssociatedToWeather = reverseMap(WeatherPassives);

export const WeatherAssociatedToSynergy: Map<Synergy, Weather> = new Map([
  [Synergy.FIRE, Weather.SUN],
  [Synergy.WATER, Weather.RAIN],
  [Synergy.GROUND, Weather.SANDSTORM],
  [Synergy.FAIRY, Weather.MISTY],
  [Synergy.ICE, Weather.SNOW],
  [Synergy.ELECTRIC, Weather.STORM],
  [Synergy.DARK, Weather.NIGHT],
  [Synergy.FLYING, Weather.WINDY],
  [Synergy.NORMAL, Weather.NEUTRAL]
])

export const SynergyAssociatedToWeather = reverseMap(WeatherAssociatedToSynergy);

export const WeatherEffects: Map<Weather, Effect> = new Map([
  [Weather.SUN, Effect.SUN],
  [Weather.RAIN, Effect.RAIN],
  [Weather.SANDSTORM, Effect.SANDSTORM],
  [Weather.MISTY, Effect.MISTY],
  [Weather.SNOW, Effect.SNOW],
  [Weather.STORM, Effect.STORM],
  [Weather.NIGHT, Effect.NIGHT],
  [Weather.WINDY, Effect.WINDY]
])
  