import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DigStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [10,20,40,80][pokemon.stars - 1] ?? 80

    const farthestCoordinate =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon)

    const targetsHit: Set<PokemonEntity> = new Set()

    if (farthestCoordinate) {
      const cells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        farthestCoordinate.x,
        farthestCoordinate.y
      )
      cells.forEach((cell) => {
        if (cell.value && cell.value.team != pokemon.team) {
          targetsHit.add(cell.value)
        }
      })
      pokemon.moveTo(farthestCoordinate.x, farthestCoordinate.y, board, false)
    }

    if (targetsHit.size === 0) targetsHit.add(target) // guarantee at least the target is hit

    targetsHit.forEach((enemy) => {
      enemy.handleSpecialDamage(
        damage,
        board,
        AttackType.SPECIAL,
        pokemon,
        crit
      )
    })
  }
}
