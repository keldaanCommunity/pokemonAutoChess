import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PsystrikeXStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = 4 * pokemon.atk

    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
    if (!death) {
      const teleportationCell = board.getTeleportationCell(
        target.positionX,
        target.positionY,
        target.team
      )
      if (teleportationCell) {
        target.moveTo(teleportationCell.x, teleportationCell.y, board, true)
      }
    }
  }
}
