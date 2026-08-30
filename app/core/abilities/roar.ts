import { AttackType } from "../../types/enum/Game"
import type { Board, Cell } from "../board"
import { effectInOrientation } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RoarStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    let farthestEmptyCell: Cell | null = null
    effectInOrientation(board, pokemon, target, (cell) => {
      if (cell.value != null && target.id !== cell.value.id) {
        if (cell.value.team !== pokemon.team) {
          cell.value.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
        board.swapCells(
          target.positionX,
          target.positionY,
          cell.value.positionX,
          cell.value.positionY
        )
      }
      if (!cell.value) {
        farthestEmptyCell = cell
      }
    })

    if (farthestEmptyCell) {
      const { x, y } = farthestEmptyCell as Cell
      board.swapCells(target.positionX, target.positionY, x, y)
    }
  }
}
