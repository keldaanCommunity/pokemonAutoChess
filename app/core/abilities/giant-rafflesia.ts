import { AttackType, Team } from "../../types/enum/Game"
import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class GiantRafflesiaStrategy extends AbilityStrategy {
  requiresTarget = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    // Spawn a giant carnivorous plant in the middle of the enemy team. It hits 5 times all ADJACENT enemies for [15,25,40,60,100,SP] SPECIAL
    // and throws a projectile to a random enemy that deals [20,40,80,120,180,SP] SPECIAL and PARALYSIS for 5 seconds.
    const damageMelee = [15, 25, 40, 60, 100][pokemon.stars - 1] ?? 100
    const damageProjectile = [20, 40, 80, 120, 180][pokemon.stars - 1] ?? 180
    const nbHits = 5
    const opponentTeam =
      pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
    const totalDuration = 3000
    const spawnDelay = 500
    const rafflesiaPosition =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        opponentTeam,
        board
      )
    if (rafflesiaPosition) {
      pokemon.broadcastAbility({
        positionX: rafflesiaPosition.x,
        positionY: rafflesiaPosition.y
      })
      for (let hit = 0; hit < nbHits; hit++) {
        pokemon.simulation.commands.push(
          new DelayedCommand(
            () => {
              board
                .getAdjacentCells(
                  rafflesiaPosition.x,
                  rafflesiaPosition.y,
                  true
                )
                .forEach((cell) => {
                  if (cell.value && cell.value.team !== pokemon.team) {
                    cell.value.handleSpecialDamage(
                      damageMelee,
                      board,
                      AttackType.SPECIAL,
                      pokemon,
                      crit
                    )
                  }
                })

              // launch projectile
              const randomEnemy = pickRandomIn(
                board.cells.filter((p) => p != null && p.team !== pokemon.team)
              )
              if (!randomEnemy) return
              const projectileTargetX = randomEnemy.positionX
              const projectileTargetY = randomEnemy.positionY
              pokemon.broadcastAbility({
                skill: "GIANT_RAFFLESIA_PROJECTILE",
                positionX: rafflesiaPosition.x,
                positionY: rafflesiaPosition.y,
                targetX: projectileTargetX,
                targetY: projectileTargetY
              })
              if (pokemon.hp > 0) {
                pokemon.simulation.commands.push(
                  new DelayedCommand(() => {
                    const enemyOnCell = board.getEntityOnCell(
                      projectileTargetX,
                      projectileTargetY
                    )
                    if (
                      enemyOnCell != null &&
                      enemyOnCell.team !== pokemon.team
                    ) {
                      enemyOnCell.handleSpecialDamage(
                        damageProjectile,
                        board,
                        AttackType.SPECIAL,
                        pokemon,
                        crit
                      )
                      enemyOnCell.status.triggerParalysis(
                        5000,
                        enemyOnCell,
                        pokemon
                      )
                    }
                  }, 1000)
                )
              }
            },
            Math.round(
              spawnDelay + (hit * (totalDuration - spawnDelay)) / nbHits
            )
          )
        )
      }
    }
  }
}
