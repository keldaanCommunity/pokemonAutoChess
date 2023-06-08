import { Effect } from "./Effect";
import { Passive } from "./Passive"
import { Synergy } from "./Synergy"

export enum Weather {
  NEUTRAL = "NEUTRAL",
  SUN = "SUN",
  WINDY = "WINDY",
  RAIN = "RAIN",
  NIGHT = "NIGHT",
  STORM = "STORM",
  MISTY = "MISTY",
  SNOW = "SNOW",
  SANDSTORM = "SANDSTORM"
}

export const WeatherPassives: Map<Passive, Weather> = new Map([
  [Passive.SUN, Weather.SUN],
  [Passive.RAIN, Weather.RAIN],
  [Passive.SANDSTORM, Weather.SANDSTORM],
  [Passive.MISTY, Weather.MISTY],
  [Passive.SNOW, Weather.SNOW],
  [Passive.STORM, Weather.STORM],
  [Passive.NIGHT, Weather.NIGHT],
  [Passive.WINDY, Weather.WINDY]
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
  [Synergy.NORMAL, Weather.NEUTRAL]
])

export const SynergyAssociatedToWeather = new Map(
  Array.from(WeatherAssociatedToSynergy.entries()).map(([k, v]) => [v, k])
);

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
  