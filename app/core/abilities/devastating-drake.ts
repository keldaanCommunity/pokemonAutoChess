import { AttackType } from "../../types/enum/Game"
import { distanceM } from "../../utils/distance"
import { getOrientation, OrientationVector } from "../../utils/orientation"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class DevastatingDrakeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)

    const MAX_NB_ENEMIES_HIT = 6
    const damageDrake = [30, 40, 50, 60, 100][pokemon.stars - 1] ?? 100
    const damageExplosion = [50, 100, 150, 200, 300][pokemon.stars - 1] ?? 300
    const flinchDuration = 2000

    let orientation = pokemon.orientation
    let lastX = pokemon.targetX,
      lastY = pokemon.targetY

    const enemies = board.cells.filter<PokemonEntity>(
      (p): p is PokemonEntity => p != null && p.team !== pokemon.team
    )

    const remainingTargets = new Set(enemies)
    let n = 0

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
            nextEnemy.status.triggerFlinch(flinchDuration, nextEnemy, pokemon)
            nextEnemy.handleSpecialDamage(
              damageDrake,
              board,
              AttackType.SPECIAL,
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

    // final explosion
    pokemon.simulation.commands.push(
      new DelayedCommand(() => {
        board
          .getAdjacentCells(lastX, lastY, true)
          .filter((cell) => cell.value && cell.value.team !== pokemon.team)
          .forEach((cell) => {
            cell.value!.handleSpecialDamage(
              damageExplosion,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          })
      }, 300 * n)
    )
  }
}
