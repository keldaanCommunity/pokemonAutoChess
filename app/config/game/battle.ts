import { Weather } from "../../types/enum/Weather"

export const ON_ATTACK_MANA = 5

export const ARMOR_FACTOR = 0.05

export const DEFAULT_SPEED = 50
export const DEFAULT_CRIT_CHANCE = 10
export const DEFAULT_CRIT_POWER = 2
export const BASE_PROJECTILE_SPEED = 3

export const WeatherThreshold: { [weather in Weather]: number } = {
  [Weather.MISTY]: 8,
  [Weather.NEUTRAL]: 8,
  [Weather.NIGHT]: 8,
  [Weather.BLOODMOON]: 8,
  [Weather.RAIN]: 8,
  [Weather.SANDSTORM]: 8,
  [Weather.SNOW]: 8,
  [Weather.STORM]: 8,
  [Weather.SUN]: 8,
  [Weather.WINDY]: 8,
  [Weather.SMOG]: 8,
  [Weather.MURKY]: 8
}
