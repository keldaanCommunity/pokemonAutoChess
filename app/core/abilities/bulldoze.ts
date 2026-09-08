import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BulldozeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [25, 45, 85, 160][pokemon.stars - 1] ?? 160
    const speedReduction = 10
    const adjacentsCells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      false
    )

    for (const cell of adjacentsCells) {
      if (cell.value && cell.value.team !== pokemon.team) {
        const orientation = board.orientation(
          pokemon.positionX,
          pokemon.positionY,
          cell.value.positionX,
          cell.value.positionY,
          pokemon,
          undefined
        )
        const destination = board.getKnockBackPlace(
          cell.value.positionX,
          cell.value.positionY,
          orientation
        )

        if (destination) {
          cell.value.moveTo(destination.x, destination.y, board, true)
          cell.value.resetCooldown(500)
        }

        cell.value.addSpeed(-speedReduction, pokemon, 0, false)

        cell.value.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
      }
    }
  }
}
