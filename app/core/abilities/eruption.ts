import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { AttackType } from "../../types/enum/Game"
import { randomBetween } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class EruptionStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 50, 70, 90][pokemon.stars - 1] ?? 90
    const numberOfProjectiles = [20,30,45,60][pokemon.stars - 1] ?? 60

    for (let i = 0; i < numberOfProjectiles; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const x = randomBetween(0, BOARD_WIDTH - 1)
          const y = randomBetween(0, BOARD_HEIGHT - 1)
          const value = board.getEntityOnCell(x, y)
          if (value && value.team !== pokemon.team) {
            value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
            value.status.triggerBurn(5000, value, pokemon)
          }
          pokemon.broadcastAbility({ targetX: x, targetY: y })
        }, i * 100)
      )
    }
  }
}
