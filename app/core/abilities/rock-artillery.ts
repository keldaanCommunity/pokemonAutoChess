import { AttackType } from "../../types/enum/Game"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class RockArtilleryStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const numberOfRocks = [10, 15, 25, 50][pokemon.stars - 1] ?? 50
    const damage = [20, 30, 40, 80][pokemon.stars - 1] ?? 80

    const enemies = board.cells.filter(
      (cell) => cell && cell.team !== pokemon.team
    ) as PokemonEntity[]

    for (let i = 0; i < numberOfRocks; i++) {
      const randomEnemy = pickRandomIn(enemies)
      if (randomEnemy) {
        const adjacentCells = board.getAdjacentCells(
          randomEnemy.positionX,
          randomEnemy.positionY,
          true
        )
        const targetCell = pickRandomIn(adjacentCells)

        pokemon.commands.push(
          new DelayedCommand(() => {
            pokemon.broadcastAbility({
              targetX: targetCell.x,
              targetY: targetCell.y
            })
            if (targetCell.value && targetCell.value.team !== pokemon.team) {
              targetCell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          }, i * 100)
        )
      }
    }
  }
}
