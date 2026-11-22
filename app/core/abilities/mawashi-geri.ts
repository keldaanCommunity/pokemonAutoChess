import { AttackType } from "../../types/enum/Game"
import type { Board, Cell } from "../board"
import { effectInOrientation } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MawashiGeriStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    let damage = [20, 40, 60, 120][pokemon.stars - 1] ?? 120
    if (pokemon.atk > target.atk) damage *= 2
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    let farthestEmptyCell: Cell | null = null
    effectInOrientation(board, pokemon, target, (cell) => {
      if (!cell.value) {
        farthestEmptyCell = cell
      }
    })
    if (farthestEmptyCell != null) {
      const { x, y } = farthestEmptyCell as Cell
      target.moveTo(x, y, board, true)
    }
  }
}
