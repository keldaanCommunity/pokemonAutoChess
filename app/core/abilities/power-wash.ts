import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class PowerWashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [80, 120, 160, 320][pokemon.stars - 1] ?? 320

    // Create a map to store enemy HP totals for each row
    const hpEnemiesByRow: Map<
      number,
      { y: number; hp: number; enemyCount: number }
    > = new Map()
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      board.getCellsInRow(y).forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          if (!hpEnemiesByRow.has(y)) {
            hpEnemiesByRow.set(y, { y: y, hp: cell.value.hp, enemyCount: 1 })
          } else {
            const entry = hpEnemiesByRow.get(y)!
            entry.hp += cell.value.hp
            entry.enemyCount++
          }
        }
      })
    }
    // Order rows by descending total enemy HP
    const sortedRows = Array.from(hpEnemiesByRow.values()).sort(
      (a, b) => b.hp - a.hp
    )

    // Terminate if no enemy rows are found
    if (sortedRows.length === 0) {
      return
    }
    // Select the row with the highest cumulative enemy HP
    const targetRow = sortedRows[0].y
    // Calculate damage per drop, dividing total damage among enemies in the row
    const dropDamage =
      sortedRows[0].enemyCount > 0
        ? Math.ceil(damage / sortedRows[0].enemyCount) / 2
        : 0

    // Helper function to dispatch a water drop to a specific board position
    const sendDrop = (x: number, y: number, delay: number) => {
      pokemon.commands.push(
        new DelayedCommand(() => {
          // Initiate the ability's visual effect
          pokemon.broadcastAbility({
            targetX: x,
            targetY: y
          })
          // Inflict damage on enemy entities in the target cell
          const entity = board.getEntityOnCell(x, y)
          if (entity && entity.team !== pokemon.team) {
            entity.handleSpecialDamage(
              dropDamage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
        }, delay)
      )
    }

    // Dispatch water drops along the chosen row in both directions
    for (let x = 0; x < BOARD_WIDTH; x++) {
      sendDrop(x, targetRow, 100 * x)
      sendDrop(BOARD_WIDTH - 1 - x, targetRow, 100 * x)
    }
  }
}
