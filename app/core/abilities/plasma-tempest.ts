import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { AttackType } from "../../types/enum/Game"
import { logger } from "../../utils/logger"
import { max } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class PlasmaTempestStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    // Set base damage for the ability
    const damage = [20, 30, 40, 80][pokemon.stars - 1] ?? 80

    // Make the Pokemon fly away
    pokemon.flyAway(board, false)

    pokemon.commands.push(
      new DelayedCommand(() => {
        // Find the 3 closest enemy Pokemon
        const enemies = board
          .getClosestEnemies(pokemon.positionX, pokemon.positionY, target.team)
          .slice(0, 3)

        // Process each of the 3 closest enemies
        enemies.forEach((enemy) => {
          // Calculate the direction vector from the Pokemon to the enemy
          const vector = {
            x: enemy.positionX - pokemon.positionX,
            y: enemy.positionY - pokemon.positionY
          }

          // Calculate steps to reach board edges
          const stepsX =
            vector.x > 0
              ? (BOARD_WIDTH - 1 - enemy.positionX) / vector.x
              : vector.x < 0
                ? -enemy.positionX / vector.x
                : BOARD_WIDTH + BOARD_HEIGHT
          const stepsY =
            vector.y > 0
              ? (BOARD_HEIGHT - 1 - enemy.positionY) / vector.y
              : vector.y < 0
                ? -enemy.positionY / vector.y
                : BOARD_WIDTH + BOARD_HEIGHT
          const steps = Math.min(stepsX, stepsY)
          if (steps === BOARD_WIDTH + BOARD_HEIGHT) {
            logger.error("PlasmaTempestStrategy: vector has no movement", {
              vector
            })
          }
          const endX = enemy.positionX + vector.x * steps
          const endY = enemy.positionY + vector.y * steps

          // Broadcast the ability animation
          pokemon.broadcastAbility({
            positionX: pokemon.positionX,
            positionY: pokemon.positionY,
            targetX: endX,
            targetY: endY
          })

          // Get all cells between the Pokemon and the end of the beam
          const cellsBetween = board.getCellsBetween(
            pokemon.positionX,
            pokemon.positionY,
            endX,
            endY
          )

          // Initialize damage for this beam
          let reducedDamage = damage

          // Apply damage to all enemy Pokemon in the beam's path
          for (const cell of cellsBetween) {
            if (cell.value && cell.value.team !== pokemon.team) {
              // Deal special damage to the enemy
              cell.value.handleSpecialDamage(
                reducedDamage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              // Reduce damage for subsequent hits
              reducedDamage = max(1)(Math.round(reducedDamage * 0.9))
            }
          }
        })
      }, 500)
    )
  }
}
