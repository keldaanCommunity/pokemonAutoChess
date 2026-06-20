import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BraveBirdStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 90, 180][pokemon.stars - 1] ?? 180
    const flyAwayCell = pokemon.flyAway(board, false)

    if (flyAwayCell) {
      const adjacentEmptyCells = board
        .getAdjacentCells(flyAwayCell.x, flyAwayCell.y)
        .filter((v) => v.value === undefined)
      if (adjacentEmptyCells.length > 0) {
        const cell = adjacentEmptyCells[0]
        target.moveTo(cell.x, cell.y, board, true)
        target.handleSpecialDamage(
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
