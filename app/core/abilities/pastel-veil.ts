import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PastelVeilStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const shield = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const farthestCoordinate = board.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      true
    )
    const alliesHit: Set<PokemonEntity> = new Set()
    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          alliesHit.add(cell.value)
        }
      })

      pokemon.broadcastAbility({
        targetX: farthestCoordinate.x,
        targetY: farthestCoordinate.y
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (alliesHit.size === 0) alliesHit.add(pokemon) // guarantee at least the user is hit
    alliesHit.forEach((ally) => {
      ally.status.clearNegativeStatus(ally, pokemon)
      ally.addShield(shield, pokemon, 1, crit)
    })
  }
}
