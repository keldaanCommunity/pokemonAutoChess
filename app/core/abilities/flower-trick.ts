import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FlowerTrickStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [15, 40, 85, 170][pokemon.stars - 1] ?? 170
    const startingCritCount = target.count.crit
    pokemon.commands.push(
      new DelayedCommand(() => {
        const currentCritCount = target.count.crit
        const numberOfCrits = currentCritCount - startingCritCount
        const cells = board.getAdjacentCells(
          target.positionX,
          target.positionY,
          true
        )
        for (const cell of cells) {
          if (cell.value && cell.value.team !== pokemon.team) {
            cell.value.broadcastAbility({
              skill: "FLOWER_TRICK_EXPLOSION",
              positionX: cell.value.positionX,
              positionY: cell.value.positionY
            })
            cell.value.handleSpecialDamage(
              damage + 15 * numberOfCrits,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }
      }, 3000)
    )
  }
}
