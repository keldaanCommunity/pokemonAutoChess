import { AttackType, Team } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PrismaticLaserStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const flip = pokemon.team === Team.RED_TEAM
    for (let dx = -1; dx <= 1; dx++) {
      const x = target.positionX + dx
      if (x < 0 || x >= board.columns) continue
      for (
        let y = flip ? 0 : board.rows - 1;
        flip ? y < board.rows : y >= 0;
        y += flip ? 1 : -1
      ) {
        const entityOnCell = board.getEntityOnCell(x, y)
        if (entityOnCell && entityOnCell.team !== pokemon.team) {
          entityOnCell.handleSpecialDamage(
            [30, 40, 50, 60, 120][pokemon.stars - 1] ?? 120,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          // move the entity to the next cell in the direction of the laser
          const newY = y + (flip ? -1 : 1)
          if (
            newY >= 0 &&
            newY < board.rows &&
            board.getEntityOnCell(x, newY) == null
          ) {
            entityOnCell.moveTo(x, newY, board, true)
          }
        }
      }
    }
  }
}
