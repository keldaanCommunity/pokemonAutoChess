import { AttackType, Team } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class SupersonicSkystrikeStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )

    if (mostSurroundedCoordinate) {
      pokemon.status.triggerProtect(2000)
      pokemon.skydiveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board
      )
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.broadcastAbility({
            positionX: mostSurroundedCoordinate.x,
            positionY: mostSurroundedCoordinate.y,
            targetX: mostSurroundedCoordinate.x,
            targetY: mostSurroundedCoordinate.y
          })
        }, 500)
      )

      pokemon.commands.push(
        new DelayedCommand(() => {
          const cells = board.getCellsInRadius(
            mostSurroundedCoordinate.x,
            mostSurroundedCoordinate.y,
            4,
            true
          )

          cells.forEach((cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              const baseDamage =
                [50, 100, 150, 200, 300][pokemon.stars - 1] ?? 300
              const distance =
                distanceC(
                  cell.x,
                  cell.y,
                  mostSurroundedCoordinate.x,
                  mostSurroundedCoordinate.y
                ) - 1
              const damage = Math.round(baseDamage - distance * 0.2)
              cell.value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
            }
          })
        }, 1000)
      )
    }
  }
}
