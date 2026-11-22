import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { Ability } from "../../types/enum/Ability"
import { AttackType } from "../../types/enum/Game"
import { randomBetween } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { DelayedCommand } from "../simulation-command"
import { AbilityStrategy } from "./ability-strategy"

export class ThousandArrowsStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const damage = [40, 50, 60, 100][pokemon.stars - 1] ?? 100
    const numberOfProjectiles = 33

    for (let i = 0; i < numberOfProjectiles; i++) {
      pokemon.commands.push(
        new DelayedCommand(() => {
          const x = randomBetween(0, BOARD_WIDTH - 1)
          const y = randomBetween(0, BOARD_HEIGHT - 1)
          const value = board.getEntityOnCell(x, y)
          if (value && value.team !== pokemon.team) {
            value.status.triggerLocked(1000, value)
            value.handleSpecialDamage(
              damage,
              board,
              AttackType.SPECIAL,
              pokemon,
              crit
            )
          }
          pokemon.broadcastAbility({
            skill: Ability.THOUSAND_ARROWS,
            positionX: x,
            positionY: BOARD_HEIGHT - 1,
            targetX: x,
            targetY: y
          })
        }, i * 100)
      )
    }
  }
}
