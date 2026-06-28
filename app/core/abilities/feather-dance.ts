import { AttackType } from "../../types/enum/Game"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class FeatherDanceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)

    const feathers = [
      "HEALTH_FEATHER",
      "MUSCLE_FEATHER",
      "RESIST_FEATHER",
      "GENIUS_FEATHER",
      "CLEVER_FEATHER",
      "SWIFT_FEATHER",
      "PRETTY_FEATHER"
    ] as const

    const featherCount = [8, 10, 12, 24][pokemon.stars - 1] ?? 24
    const landingPlace =
      board.getFarthestTargetCoordinateAvailablePlace(pokemon, true) ||
      board.getSafePlaceAwayFrom(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.team
      )

    if (landingPlace) {
      const pathCells = board.getCellsBetween(
        pokemon.positionX,
        pokemon.positionY,
        landingPlace.x,
        landingPlace.y
      )

      pokemon.moveTo(landingPlace.x, landingPlace.y, board, false)

      // Distribute feathers to allies on the identified cells
      for (let i = 0; i < featherCount; i++) {
        const feather = pickRandomIn(feathers)
        const cell = pickRandomIn(pathCells)

        // Find entity on this cell to apply the effect
        const featherTarget = cell.value
        if (featherTarget) {
          pokemon.broadcastAbility({
            positionX: cell.x,
            positionY: cell.y,
            skill: feather
          })

          pokemon.commands.push(
            new DelayedCommand(() => {
              const sign = featherTarget.team === pokemon.team ? 1 : -1
              if (feather === "HEALTH_FEATHER") {
                if (sign === 1) {
                  featherTarget.handleHeal(sign * 20, featherTarget, 1, crit)
                } else {
                  featherTarget.handleSpecialDamage(
                    20,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }
              } else if (feather === "MUSCLE_FEATHER") {
                featherTarget.addAttack(sign * 4, featherTarget, 1, crit)
              } else if (feather === "RESIST_FEATHER") {
                featherTarget.addDefense(sign * 4, featherTarget, 1, crit)
              } else if (feather === "GENIUS_FEATHER") {
                featherTarget.addAbilityPower(sign * 10, featherTarget, 1, crit)
              } else if (feather === "CLEVER_FEATHER") {
                featherTarget.addSpecialDefense(
                  sign * 4,
                  featherTarget,
                  1,
                  crit
                )
              } else if (feather === "SWIFT_FEATHER") {
                featherTarget.addSpeed(sign * 10, featherTarget, 1, crit)
              } else if (feather === "PRETTY_FEATHER") {
                featherTarget.addLuck(sign * 10, featherTarget, 1, crit)
              }
            }, 1000)
          )
        } else {
          // No entity on cell, just show animation
          pokemon.broadcastAbility({
            positionX: cell.x,
            positionY: cell.y,
            skill: feather
          })
        }
      }
    }
  }
}
