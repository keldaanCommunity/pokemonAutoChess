import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config/game/board"
import { AttackType } from "../../types/enum/Game"
import { Synergy } from "../../types/enum/Synergy"
import { isIn } from "../../utils/array"
import { min } from "../../utils/number"
import { type Board, type Cell, effectInOrientation } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ContinentalCrushStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    /* Summons a huge rock mountain for 5 seconds, reduced by 10% for each ROCK ally on the board. 
    The mountain then crashes in the middle of the enemy team, dealing [100,200,300,400,800,SP] SPECIAL 
    to all enemies directly in the 3x3 zone below. Other enemies in a 3-tile radius are knocked back
     and take [20,40,80,160,SP] SPECIAL */

    const damage = [100, 200, 300, 400, 800][pokemon.stars - 1] ?? 800
    const radiusDamage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    const baseDelay = 5000
    const delayReductionPerRockAlly = 0.1

    const rockAlliesCount = board.cells.filter(
      (entity): entity is PokemonEntity =>
        entity != null &&
        entity.team === pokemon.team &&
        entity.hasSynergy(Synergy.ROCK)
    ).length

    const delay = min(500)(
      baseDelay * (1 - delayReductionPerRockAlly * rockAlliesCount)
    )

    let maxEnemyCount = 0
    let bestCell: { x: number; y: number } = {
      x: BOARD_WIDTH / 2,
      y: BOARD_HEIGHT / 2
    }
    board.forEach((x: number, y: number) => {
      const adjacentCells = board.getAdjacentCells(x, y, true)
      const adjacentEnemies = adjacentCells.filter(
        (cell) => cell.value && cell.value.team !== pokemon.team
      )
      if (adjacentEnemies.length > maxEnemyCount) {
        maxEnemyCount = adjacentEnemies.length
        bestCell = { x, y }
      }
    })
    if (bestCell) {
      pokemon.broadcastAbility({
        targetX: bestCell.x,
        targetY: bestCell.y,
        data: { delay }
      })
      pokemon.simulation.commands.push(
        new DelayedCommand(() => {
          const adjacentCells = board.getAdjacentCells(
            bestCell.x,
            bestCell.y,
            true
          )
          const enemiesHitDirectly = adjacentCells
            .filter((cell) => cell.value && cell.value.team !== pokemon.team)
            .map((cell) => cell.value as PokemonEntity)
          for (const enemy of enemiesHitDirectly) {
            enemy.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }

          const enemiesKnockback = board
            .getCellsInRadius(bestCell.x, bestCell.y, 3, false)
            .filter(
              (cell) =>
                cell.value &&
                cell.value.team !== pokemon.team &&
                !isIn(enemiesHitDirectly, cell.value)
            )
            .map((cell) => cell.value as PokemonEntity)

          for (const enemy of enemiesKnockback) {
            let farthestEmptyCell: Cell | null = null
            let blocked = false
            effectInOrientation(
              board,
              {
                positionX: bestCell.x,
                positionY: bestCell.y,
                team: pokemon.team
              },
              enemy,
              (cell) => {
                if (cell.value && cell.value.id !== enemy.id) {
                  blocked = true
                } else {
                  farthestEmptyCell = cell
                }
              },
              undefined
            )

            const canBeMoved = farthestEmptyCell != null && enemy.canBeMoved

            // push as far as possible
            enemy.handleSpecialDamage(
              radiusDamage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )

            if (canBeMoved && farthestEmptyCell) {
              const { x, y } = farthestEmptyCell as Cell
              enemy.moveTo(x, y, board, true)
            }
          }
        }, delay)
      )
    }
  }
}
