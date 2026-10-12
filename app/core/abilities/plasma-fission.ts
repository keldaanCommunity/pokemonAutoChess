import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { AttackType } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import { logger } from "../../utils/logger"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class PlasmaFissionStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Base damage for Plasma Fission
    const damage = [20, 40, 60, 120][pokemon.stars - 1] ?? 120
    // Identify enemies between the user and the target
    const enemiesOnThePathEntities = board
      .getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        target.positionX,
        target.positionY
      )
      .filter((c) => c.value && c.value.team !== pokemon.team)
      .map((c) => c.value)
      .sort(
        (a, b) =>
          distanceC(
            pokemon.positionX,
            pokemon.positionY,
            a?.positionX || 0,
            a?.positionY || 0
          ) -
          distanceC(
            pokemon.positionX,
            pokemon.positionY,
            b?.positionX || 0,
            b?.positionY || 0
          )
      )
    // Determine primary target: first enemy on path or original target if no enemies on path
    const primaryTarget =
      enemiesOnThePathEntities.length > 0 ? enemiesOnThePathEntities[0] : target

    if (primaryTarget) {
      // Initiate ability animation
      pokemon.broadcastAbility({
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        targetX: primaryTarget.positionX,
        targetY: primaryTarget.positionY
      })
      // Schedule main ability execution
      pokemon.commands.push(
        new DelayedCommand(() => {
          // Inflict damage on primary target
          primaryTarget.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
          // Determine vector from user to primary target
          const vector: { x: number; y: number } = {
            x: primaryTarget.positionX - pokemon.positionX,
            y: primaryTarget.positionY - pokemon.positionY
          }

          // Generate two perpendicular split beams
          for (const v of [
            { x: -vector.y, y: vector.x },
            { x: vector.y, y: -vector.x }
          ]) {
            // Calculate how many steps until hitting board edge
            const stepsX =
              v.x > 0
                ? BOARD_WIDTH - primaryTarget.positionX
                : v.x < 0
                  ? primaryTarget.positionX + 1
                  : BOARD_WIDTH + BOARD_HEIGHT
            const stepsY =
              v.y > 0
                ? BOARD_HEIGHT - primaryTarget.positionY
                : v.y < 0
                  ? primaryTarget.positionY + 1
                  : BOARD_WIDTH + BOARD_HEIGHT
            const steps = Math.min(stepsX, stepsY)
            if (steps === BOARD_WIDTH + BOARD_HEIGHT) {
              logger.error(
                "PlasmaFission: Perpendicular vector has no movement",
                { v, vector }
              )
            }

            const splitDestination = {
              positionX: primaryTarget.positionX + v.x * steps,
              positionY: primaryTarget.positionY + v.y * steps
            }
            // Animate split beam
            pokemon.broadcastAbility({
              positionX: primaryTarget.positionX,
              positionY: primaryTarget.positionY,
              targetX: splitDestination.positionX,
              targetY: splitDestination.positionY
            })
            let residualDamage = damage
            // Locate enemies along split beam trajectory
            const enemiesOnThePathEntities = board
              .getCellsBetween(
                primaryTarget.positionX,
                primaryTarget.positionY,
                splitDestination.positionX,
                splitDestination.positionY
              )
              .filter(
                (c) =>
                  c.value &&
                  c.value.team !== pokemon.team &&
                  c.value.id !== primaryTarget.id
              )
              .map((c) => c.value)
              .sort(
                (a, b) =>
                  distanceC(
                    primaryTarget.positionX,
                    primaryTarget.positionY,
                    a?.positionX || 0,
                    a?.positionY || 0
                  ) -
                  distanceC(
                    primaryTarget.positionX,
                    primaryTarget.positionY,
                    b?.positionX || 0,
                    b?.positionY || 0
                  )
              )
            // Apply diminishing damage to enemies along split beam path
            for (const enemy of enemiesOnThePathEntities) {
              if (enemy) {
                enemy.handleSpecialDamage(
                  residualDamage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
                residualDamage = Math.max(1, Math.round(residualDamage / 2))
              }
            }
          }
        }, 400)
      )
    }
  }
}
