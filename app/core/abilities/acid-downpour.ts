import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { AttackType } from "../../types/enum/Game"
import { randomBetween } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class AcidDownpourStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const damage = 30
    const numberOfProjectiles = [20, 30, 45, 60, 75][pokemon.stars - 1] ?? 75
    const fallingTime = 500
    const timeStep = Math.round(1500 / numberOfProjectiles)

    for (let i = 0; i < numberOfProjectiles; i++) {
      const x = randomBetween(0, BOARD_WIDTH - 1)
      const y = randomBetween(0, BOARD_HEIGHT - 1)
      pokemon.broadcastAbility({ targetX: x, targetY: y, delay: timeStep * i })
      pokemon.simulation.commands.push(
        new DelayedCommand(
          () => {
            const value = board.getEntityOnCell(x, y)
            if (value && value.team !== pokemon.team) {
              value.handleSpecialDamage(
                damage,
                board,
                AttackType.SPECIAL,
                pokemon,
                crit
              )
              value.status.triggerPoison(5000, value, pokemon, 5)
            }
          },
          i * timeStep + fallingTime
        )
      )
    }
  }
}
