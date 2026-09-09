import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class IceSpinnerStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    const cells = board.getAdjacentCells(
      pokemon.positionX,
      pokemon.positionY,
      true
    )

    let delay = 0
    for (const cell of cells) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            targetX: cell.x,
            targetY: cell.y
          })
          board.clearBoardEffect(cell.x, cell.y, pokemon.simulation)
          if (cell.value && cell.value.team !== pokemon.team) {
            const orientation = board.orientation(
              pokemon.positionX,
              pokemon.positionY,
              cell.value.positionX,
              cell.value.positionY,
              pokemon,
              undefined
            )
            const knockbackCell = board.getKnockBackPlace(
              cell.value.positionX,
              cell.value.positionY,
              orientation
            )
            cell.value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            if (knockbackCell) {
              cell.value.moveTo(knockbackCell.x, knockbackCell.y, board, true)
              cell.value.cooldown = 500
            }
          }
        }, delay)
      )
      delay += 100
    }
  }
}
