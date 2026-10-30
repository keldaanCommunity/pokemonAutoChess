import { AttackType } from "../../types/enum/Game"
import { type Board, type Cell, effectInOrientation } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ThunderclapPressStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const duration = 4000

    const targetsHit: Set<PokemonEntity> = new Set()
    targetsHit.add(target)

    let farthestEmptyCell: Cell | null = null
    effectInOrientation(board, pokemon, target, (cell) => {
      if (!cell.value) {
        farthestEmptyCell = cell
      } else {
        targetsHit.add(cell.value)
      }
    })
    if (farthestEmptyCell != null) {
      const { x, y } = farthestEmptyCell as Cell
      target.moveTo(x, y, board, true)
    }

    targetsHit.forEach((enemy) => {
      enemy.status.triggerParalysis(duration, enemy, pokemon)
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
