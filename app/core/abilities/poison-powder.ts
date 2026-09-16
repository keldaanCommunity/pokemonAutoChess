import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PoisonPowderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160

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
      enemy.status.triggerPoison([3000, 3000, 3000, 6000][pokemon.stars - 1] ?? 6000, target, pokemon)
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
