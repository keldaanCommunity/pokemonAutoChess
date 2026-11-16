import { AttackType } from "../../types/enum/Game"
import { pickNRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ToxicSporeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Scatters 3 spores around the nearest non poisoned enemy. After 2 seconds, it explodes on nearby ADJACENT enemies dealing [10,20,40,80,SP] SPECIAL, inflicting POISONED for 3s
    const damage = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    const duration = 3000

    const nearestEnemyNonPoisonedArray = board
      .getClosestEnemies(pokemon.positionX, pokemon.positionY, target.team)
      .filter((enemy) => enemy.status.poisonStacks === 0)

    const nearestEnemyNonPoisoned = nearestEnemyNonPoisonedArray[0] || target

    const nearbyPositions = board.getAdjacentCells(
      nearestEnemyNonPoisoned.positionX,
      nearestEnemyNonPoisoned.positionY
    )
    const emptyPositions = nearbyPositions.filter((cell) => !cell.value)
    const occupiedPositions = nearbyPositions.filter((cell) => cell.value)
    const emptySporePositions = pickNRandomIn(emptyPositions, 3)
    const occupiedSporePositions = pickNRandomIn(
      occupiedPositions,
      Math.max(0, 3 - emptySporePositions.length)
    )

    const sporePositions = [...emptySporePositions, ...occupiedSporePositions]

    for (const sporePosition of sporePositions) {
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: sporePosition.x,
        targetY: sporePosition.y
      })

      pokemon.simulation.commands.push(
        new DelayedCommand(() => {
          const adjacentEnemies = board
            .getAdjacentCells(sporePosition.x, sporePosition.y, true)
            .filter((cell) => cell.value && cell.value.team !== pokemon.team)
          for (const adjacent of adjacentEnemies) {
            const enemy = adjacent.value

            if (enemy) {
              enemy.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              enemy.status.triggerPoison(duration, enemy, pokemon)
            }
          }
        }, 2000)
      )
    }
  }
}
