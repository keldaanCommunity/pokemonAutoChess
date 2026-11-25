import { BASE_PROJECTILE_SPEED } from "../../../../../config"
import { StatusConfigs } from "../../../../../config/game/statuses"
import delays from "../../../../../types/delays.json"
import { distanceC } from "../../../../../utils/distance"

export type AttackTimingInput = {
  pokemonIndex: string
  speed: number
  paralyzed: boolean
  positionX: number
  positionY: number
  targetX: number
  targetY: number
}

// Keep this preview calculation in sync with core/attacking-state.ts.
export function getAttackTimings(pokemon: AttackTimingInput): {
  delayBeforeShoot: number
  travelTime: number
  attackDuration: number
} {
  const speedFactor = 1 - StatusConfigs.PARALYSIS.speedReductionPercent / 100
  const speed = pokemon.paralyzed ? pokemon.speed * speedFactor : pokemon.speed
  const attackDuration = 1000 / (0.4 + speed * 0.007)
  const configuredDelay = delays[pokemon.pokemonIndex]?.d
  const d =
    typeof configuredDelay === "number" && Number.isFinite(configuredDelay)
      ? configuredDelay
      : 18
  const t = delays[pokemon.pokemonIndex]?.t || 36

  const delayBeforeShoot = Math.min(
    attackDuration / 2,
    (attackDuration * d) / t
  )
  const distance = distanceC(
    pokemon.targetX,
    pokemon.targetY,
    pokemon.positionX,
    pokemon.positionY
  )
  const travelTime =
    (distance * 1000) / (BASE_PROJECTILE_SPEED * (1 + speed / 100))

  return { delayBeforeShoot, travelTime, attackDuration }
}
