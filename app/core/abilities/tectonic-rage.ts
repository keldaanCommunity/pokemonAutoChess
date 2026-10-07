import { BOARD_WIDTH } from "../../config"
import { AttackType, Team } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class TectonicRageStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damageEdge = [30, 40, 50, 60, 100][pokemon.stars - 1] ?? 100
    const damageCenter = [50, 100, 150, 200, 300][pokemon.stars - 1] ?? 300
    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const epicenter = pokemon.state.getMostSurroundedCoordinateAvailablePlace(
      opponentTeam,
      board
    ) ?? { x: pokemon.targetX, y: pokemon.targetY }

    const boardPlayer = pokemon.simulation.bluePlayer

    pokemon.broadcastAbility({
      skill: "TECTONIC_RAGE",
      targetX: epicenter.x,
      targetY: epicenter.y
    })

    const cellsHit = board
      .getCellsInRadius(epicenter.x, epicenter.y, 4, true)
      .map((cell) => {
        return {
          ...cell,
          distanceToEpicenter: distanceC(
            epicenter.x,
            epicenter.y,
            cell.x,
            cell.y
          )
        }
      })

    cellsHit.forEach((cell) => {
      if (cell.distanceToEpicenter >= 2) {
        // edge damage
        if (cell.value && cell.value.team !== pokemon.team) {
          const index = cell.y * BOARD_WIDTH + cell.x
          const fullyDugHole =
            boardPlayer && boardPlayer.groundHoles[index] === 5

          cell.value.handleSpecialDamage(
            Math.round(damageEdge * (fullyDugHole ? 1.3 : 1)),
            board,
            AttackType.SPECIAL,
            pokemon,
            crit
          )
        }
      }
    })

    pokemon.simulation.commands.push(
      new DelayedCommand(() => {
        pokemon.broadcastAbility({
          skill: "TECTONIC_RAGE_FINAL",
          targetX: epicenter.x,
          targetY: epicenter.y
        })

        cellsHit.forEach((cell) => {
          if (cell.distanceToEpicenter < 2) {
            // epicenter damage
            if (cell.value && cell.value.team !== pokemon.team) {
              cell.value.handleSpecialDamage(
                damageCenter,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              cell.value.status.triggerBurn(5000, cell.value, pokemon)
            }
          }
        })
      }, 1000)
    )
  }
}
