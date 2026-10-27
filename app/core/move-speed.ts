import { StatusConfigs } from "../config/game/statuses"
import type { IPokemonEntity } from "../types"

export function getMoveSpeed(pokemon: IPokemonEntity): number {
  // at 0 speed in normal conditions, the factor should be 0.5
  // at 100 speed, the factor should be 1.5
  // at max 300 speed, it's 3.5 = 143ms per cell
  const speedFactor = 1 - StatusConfigs.PARALYSIS.speedReductionPercent / 100
  const speed = pokemon.status.paralysis ? pokemon.speed * speedFactor : pokemon.speed
  return 0.5 + speed / 100
}
