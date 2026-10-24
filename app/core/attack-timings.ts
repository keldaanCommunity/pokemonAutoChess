import { BASE_PROJECTILE_SPEED } from "../config"
import type { IPokemonEntity } from "../types"
import delays from "../types/delays.json"
import { distanceC } from "../utils/distance"
import { max } from "../utils/number"

export function getAttackTimings(pokemon: IPokemonEntity): {
  delayBeforeShoot: number
  travelTime: number
  attackDuration: number
} {
  const speed = pokemon.status.paralysis ? pokemon.speed / 2 : pokemon.speed
  const attackDuration = 1000 / (0.4 + speed * 0.007)
  const d = delays[pokemon.index]?.d || 18 // number of frames before hit
  const t = delays[pokemon.index]?.t || 36 // total number of frames in the animation

  const delayBeforeShoot = max(attackDuration / 2)((attackDuration * d) / t)
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
