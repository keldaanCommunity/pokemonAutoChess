import { AttackType, Team } from "../../types/enum/Game"
import { distanceC } from "../../utils/distance"
import type { Board } from "../board"
import { OnShieldDepletedEffect } from "../effects/effect"
import { getMoveSpeed } from "../move-speed"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class BreakneckBlitzStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    // Builds up momentum for 1 second then crashes into the middle of the enemy team at full speed,
    // dealing [60,120,200,300,500,SP] + [100,SP]% of remaining SHIELD as SPECIAL within a 3-tile radius,
    // with damage reduced by 30% for each tile of distance. The SHIELD explodes and is consumed upon impact.
    super.process(pokemon, board, target, crit)
    const buildupTime = 1000
    const damage = [60, 120, 200, 300, 500][pokemon.stars - 1] ?? 500
    const damageReductionPerTile = 0.3
    const shieldPercentage = 1.0
    const radius = 3
    pokemon.cooldown = 1500
    pokemon.commands.push(
      new DelayedCommand(() => {
        const opponentTeam =
          pokemon.team === Team.BLUE_TEAM ? Team.RED_TEAM : Team.BLUE_TEAM
        const mostSurroundedCoordinate =
          pokemon.state.getMostSurroundedCoordinateAvailablePlace(
            opponentTeam,
            board
          )

        if (mostSurroundedCoordinate) {
          pokemon.moveTo(
            mostSurroundedCoordinate.x,
            mostSurroundedCoordinate.y,
            board,
            false
          )

          const movementDuration = Math.round(500 / getMoveSpeed(pokemon))
          pokemon.commands.push(
            new DelayedCommand(() => {
              pokemon.broadcastAbility({
                skill: "BREAKNECK_BLITZ_HIT",
                targetX: mostSurroundedCoordinate?.x,
                targetY: mostSurroundedCoordinate?.y
              })
              const totalDamage = damage + pokemon.shield * shieldPercentage
              if (pokemon.shield > 0) {
                pokemon.shield = 0
                pokemon.getEffects(OnShieldDepletedEffect).forEach((effect) => {
                  effect.apply({
                    pokemon,
                    board: pokemon.simulation.board,
                    attacker: pokemon as PokemonEntity,
                    damage
                  })
                })
              }
              const cells = board.getCellsInRadius(
                mostSurroundedCoordinate.x,
                mostSurroundedCoordinate.y,
                radius,
                false
              )

              cells.forEach((cell) => {
                const distance = distanceC(
                  mostSurroundedCoordinate.x,
                  mostSurroundedCoordinate.y,
                  cell.x,
                  cell.y
                )
                const damageReducedByDistance =
                  totalDamage * (1 - damageReductionPerTile * (distance - 1))
                if (cell.value && cell.value.team !== pokemon.team) {
                  cell.value.handleSpecialDamage(
                    damageReducedByDistance,
                    board,
                    AttackType.SPECIAL,
                    pokemon,
                    crit
                  )
                }
              })
            }, movementDuration)
          )
        }
      }, buildupTime)
    )
  }
}
