import { BOARD_HEIGHT } from "../../config/game/board"
import { AttackType, Team } from "../../types/enum/Game"
import { groupBy } from "../../utils/array"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class StokedSparksurferStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const nbRows = 2
    const damage = [30, 60, 100, 150, 250][pokemon.stars - 1] ?? 250
    const paralysisDuration = 4000
    pokemon.status.triggerProtect(2000)
    pokemon.cooldown = 2200
    pokemon.simulation.triggerTidalWave(pokemon.team, pokemon.stars)

    pokemon.commands.push(
      new DelayedCommand(() => {
        const enemies = board.cells.filter(
          (p): p is PokemonEntity => p != null && p.team !== pokemon.team
        )
        const enemiesByRows = groupBy(enemies, (e) => e.positionY)
        const mostCrowdedRows = Object.entries(enemiesByRows)
          .sort((a, b) => b[1].length - a[1].length)
          .slice(0, nbRows)
          .map(([row]) => Number(row))

        while (mostCrowdedRows.length < nbRows) {
          for (let r = 0; r < BOARD_HEIGHT; r++) {
            const row =
              pokemon.team === Team.RED_TEAM ? r : BOARD_HEIGHT - 1 - r
            if (
              !mostCrowdedRows.includes(row) &&
              mostCrowdedRows.length < nbRows
            ) {
              mostCrowdedRows.push(row)
              break
            }
          }
        }

        mostCrowdedRows.sort((a, b) => a - b)
        pokemon.broadcastAbility({ data: { rows: mostCrowdedRows } })

        mostCrowdedRows.forEach((row, i) => {
          pokemon.commands.push(
            new DelayedCommand(
              () => {
                const enemiesInRow = board.cells.filter(
                  (p): p is PokemonEntity =>
                    p != null && p.team !== pokemon.team && p.positionY === row
                )
                for (const enemy of enemiesInRow) {
                  enemy.status.triggerParalysis(
                    paralysisDuration,
                    enemy,
                    pokemon
                  )
                  enemy.handleSpecialDamage(
                    damage,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }
              },
              650 + i * 650
            )
          )
        })
      }, 1) // to take into account the movement from the tidal wave before identifying the most crowded rows
    )
  }
}
