import { AttackType } from "../../types/enum/Game"
import { chance } from "../../utils/random"
import { type Board, type Cell, effectInOrientation } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class TwinkleTackleStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [100,200,300,400,800][pokemon.stars - 1] ?? 800
    const duration = 2000
    const ejectChance = 0.3

    // A magical zone opens within a 4-tile radius of the caster; all enemies in the zone are CHARM by the caster for 3 seconds.

    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 4, false)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerCharm(duration, cell.value, pokemon)
        }
      })

    // Then, after 2 seconds, a star strikes all ADJACENT enemies and knocks them back, with a [30,LK]% chance of knocking them off the battlefield.

    pokemon.simulation.commands.push(
      new DelayedCommand(
        () => pokemon.broadcastAbility({ skill: "TWINKLE_STAR" }),
        duration - 800
      )
    )

    pokemon.simulation.commands.push(
      new DelayedCommand(() => {
        const adjacentEnemies = board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
          .map((cell) => cell.value)
          .filter(
            (p): p is PokemonEntity => p != null && p.team !== pokemon.team
          )

        for (const enemy of adjacentEnemies) {
          let farthestEmptyCell: Cell | null = null
          let blocked = false
          effectInOrientation(board, pokemon, enemy, (cell) => {
            if (cell.value && cell.value.id !== enemy.id) {
              blocked = true
            } else {
              farthestEmptyCell = cell
            }
          })

          const canBeMoved = farthestEmptyCell != null && enemy.canBeMoved
          const willEject =
            canBeMoved &&
            !blocked &&
            !enemy.status.resurrection &&
            !enemy.status.magicBounce &&
            !enemy.status.protect &&
            chance(ejectChance, pokemon)

          if (willEject) {
            // eject from the board
            pokemon.broadcastAbility({
              skill: "BOARD_EJECT",
              targetX: enemy.positionX,
              targetY: enemy.positionY
            })
            enemy.cooldown = 9999
            const { death } = enemy.handleSpecialDamage(
              9999,
              board,
              AttackType.TRUE,
              pokemon,
              crit
            )
            if (!death) {
              // force death even with shiny charm
              pokemon.state.triggerDeath(enemy, pokemon, board, AttackType.TRUE)
            }
          } else {
            // push as far as possible
            enemy.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )

            if (canBeMoved && farthestEmptyCell) {
              const { x, y } = farthestEmptyCell as Cell
              const initialTargetX = enemy.positionX
              const initialTargetY = enemy.positionY
              enemy.moveTo(x, y, board, true)
              pokemon.moveTo(initialTargetX, initialTargetY, board, true)
            }
          }
        }
      }, duration)
    )
  }
}
