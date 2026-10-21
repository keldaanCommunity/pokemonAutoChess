import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class AquaSwirlStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [3, 6, 9, 12][pokemon.stars - 1] ?? 12
    const heal = [5, 10, 15, 20][pokemon.stars - 1] ?? 20

    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        undefined,
        board
      ) || { x: target.positionX, y: target.positionY }

    pokemon.broadcastAbility({
      positionX: mostSurroundedCoordinate.x,
      positionY: mostSurroundedCoordinate.y
    })

    const ticks = [500, 1000, 1500, 2000, 2500, 3000]

    for (let i = 0; i < ticks.length; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          // Apply heal to allies and damage to enemies in the area
          const cells = board.getAdjacentCells(
            mostSurroundedCoordinate.x,
            mostSurroundedCoordinate.y,
            true
          )
          for (const cell of cells) {
            if (cell.value) {
              if (cell.value.team === pokemon.team) {
                cell.value.handleHeal(heal, pokemon, 1, crit)
              } else {
                cell.value.handleSpecialDamage(
                  damage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  crit
                )
                // if last tick, apply infatuation to enemies
                if (i === ticks.length - 1) {
                  cell.value.status.triggerCharm(
                    1000,
                    cell.value,
                    pokemon,
                    false
                  )
                  cell.value.broadcastAbility({
                    targetX: cell.value.positionX,
                    targetY: cell.value.positionY,
                    skill: "PUFF_PINK"
                  })
                }
              }
            }
          }
        }, ticks[i]) // delay each tick by 0.5 second
      )
    }
  }
}
