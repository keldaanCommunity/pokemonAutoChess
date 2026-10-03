import { BOARD_HEIGHT } from "../../config"
import { BOARD_WIDTH } from "../../config/game/board"
import { AttackType } from "../../types/enum/Game"
import { distanceM } from "../../utils/distance"
import { getOrientation, OrientationVector } from "../../utils/orientation"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class CorscrewCrashStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)

    const MAX_NB_ENEMIES_HIT = 6
    const damage = [20, 40, 80, 120, 200][pokemon.stars - 1] ?? 200
    const damageFinal = [50, 100, 150, 200, 300][pokemon.stars - 1] ?? 300

    let orientation = pokemon.orientation
    let lastX = pokemon.targetX,
      lastY = pokemon.targetY

    const enemies = board.cells.filter<PokemonEntity>(
      (p): p is PokemonEntity => p != null && p.team !== pokemon.team
    )

    const remainingTargets = new Set(enemies)
    let n = 0

    pokemon.status.skydiving = true // to hide and protect the pokemon during the ability animation

    while (remainingTargets.size > 0 && n < MAX_NB_ENEMIES_HIT) {
      const distances = [...remainingTargets].map((e) =>
        distanceM(lastX, lastY, e.positionX, e.positionY)
      )
      const minDistance = Math.min(...distances)
      const enemiesAtMinDistance = [...remainingTargets].filter(
        (_, i) => distances[i] === minDistance
      )
      let nextEnemy: PokemonEntity

      if (enemiesAtMinDistance.length > 0) {
        // search again the closest while taking the current orientation into account
        const movementVector = OrientationVector[orientation]
        const x2 = lastX + movementVector[0]
        const y2 = lastY + movementVector[1]
        const distances = [...remainingTargets].map((e) =>
          distanceM(x2, y2, e.positionX, e.positionY)
        )
        const minDistance = Math.min(...distances)
        const enemiesAtMinDistance = [...remainingTargets].filter(
          (_, i) => distances[i] === minDistance
        )
        nextEnemy = enemiesAtMinDistance[0]
      } else {
        nextEnemy = enemiesAtMinDistance[0]
      }

      remainingTargets.delete(nextEnemy)
      orientation = getOrientation(
        lastX,
        lastY,
        nextEnemy.positionX,
        nextEnemy.positionY
      )

      pokemon.simulation.commands.push(
        new DelayedCommand(() => {
          if (nextEnemy.hp > 0) {
            nextEnemy.handleSpecialDamage(
              damage,
              board,
              AttackType.TRUE,
              pokemon,
              crit
            )
          }
        }, 300 * n)
      )
      n++

      lastX = nextEnemy.positionX
      lastY = nextEnemy.positionY
    }

    // final attack
    // using room timeout instead of DelayedCommand so that pokemon
    // go back to the board even if battle is finished
    // TODO: check if it's okay to apply this logic after simulation ended
    let finalX = BOARD_WIDTH / 2,
      finalY = BOARD_HEIGHT / 2
    pokemon.simulation.room.clock.setTimeout(() => {
      const highestHpEnemy = [...enemies].reduce((prev, curr) =>
        prev.hp > curr.hp ? prev : curr
      )
      if (highestHpEnemy.hp > 0) {
        highestHpEnemy.handleSpecialDamage(
          damageFinal,
          board,
          AttackType.TRUE,
          pokemon,
          crit
        )
        finalX = highestHpEnemy.positionX
        finalY = highestHpEnemy.positionY
      }
      pokemon.broadcastAbility({
        skill: "CORSCREW_CRASH_FINAL",
        targetX: finalX,
        targetY: finalY
      })

      pokemon.simulation.room.clock.setTimeout(() => {
        pokemon.status.skydiving = false
        const closestAvailableCell = board.getClosestAvailablePlace(
          finalX,
          finalY
        )
        if (closestAvailableCell) {
          board.swapCells(
            pokemon.positionX,
            pokemon.positionY,
            closestAvailableCell.x,
            closestAvailableCell.y
          )
        }
      }, 500)
    }, 300 * n)
  }
}
