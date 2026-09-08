import { AttackType } from "../../types/enum/Game"
import type { Board, Cell } from "../board"
import { effectInOrientation } from "../board"

import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ForcePalmStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const additionalDamage = target.status.paralysis
      ? ([10, 20, 40, 80][pokemon.stars - 1] ?? 80)
      : 0
    const damage = Math.round(
      ([15, 30, 60, 120][pokemon.stars - 1] ?? 120) +
        target.maxHP * 0.1 +
        additionalDamage
    )
    if (target.status.paralysis) {
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
    } else {
      target.status.triggerParalysis(6000, target, pokemon)
    }
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
