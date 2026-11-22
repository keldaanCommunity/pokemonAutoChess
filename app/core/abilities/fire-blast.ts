import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FireBlastStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 110, 220][pokemon.stars - 1] ?? 220
    const cellsHit = [
      { x: target.positionX, y: target.positionY },
      { x: target.positionX - 1, y: target.positionY },
      { x: target.positionX + 1, y: target.positionY },
      { x: target.positionX, y: target.positionY + 1 },
      { x: target.positionX - 1, y: target.positionY - 1 },
      { x: target.positionX + 1, y: target.positionY - 1 }
    ]
    for (const cell of cellsHit) {
      const entityOnCell = board.getEntityOnCell(cell.x, cell.y)
      if (entityOnCell && entityOnCell.team !== pokemon.team) {
        entityOnCell.handleSpecialDamage(
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
