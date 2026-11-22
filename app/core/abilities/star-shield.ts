import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class StarShieldStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    // Calls down 3 stars in succession, each targeting the ally with the lowest HP%. Each star takes 1.5 seconds to reach its target, and the next star appears as the previous one lands. On impact, grants [10,15,20,25,SP] SHIELD to ADJACENT allies, and BURN ADJACENT enemies for 2 seconds.
    const burnDuration = 2000
    const shield = [10, 15, 20, 25][pokemon.stars - 1] ?? 25

    const getAllyWithLowestHP = () =>
      board.cells
        .filter((entity) => entity?.team === pokemon.team)
        .sort(
          (a, b) =>
            (a?.hp ?? 0) / (a?.maxHP ?? 1) - (b?.hp ?? 0) / (b?.maxHP ?? 1)
        )[0]

    for (let i = 0; i < 3; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const allyWithLowestHP = getAllyWithLowestHP()
          const allyWithLowestHPCoordinates = allyWithLowestHP
            ? {
                x: allyWithLowestHP.positionX,
                y: allyWithLowestHP.positionY
              }
            : undefined
          if (allyWithLowestHPCoordinates) {
            pokemon.broadcastAbility({
              targetX: allyWithLowestHPCoordinates.x,
              targetY: allyWithLowestHPCoordinates.y
            })
            pokemon.commands.push(
              new DelayedCommand(() => {
                const adjacentCells = board.getAdjacentCells(
                  allyWithLowestHPCoordinates.x,
                  allyWithLowestHPCoordinates.y,
                  true
                )

                for (const cell of adjacentCells) {
                  if (cell.value) {
                    if (cell.value.team === pokemon.team) {
                      cell.value.addShield(shield, pokemon, 1, crit)
                    } else {
                      cell.value.status.triggerBurn(
                        burnDuration,
                        cell.value,
                        pokemon
                      )
                    }
                  }
                }
              }, 1500)
            )
          }
        }, i * 1500)
      )
    }
  }
}
