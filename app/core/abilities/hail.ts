import { BOARD_HEIGHT, BOARD_WIDTH } from "../../config"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import { randomBetween } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HailStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [50, 50, 50, 80][pokemon.stars - 1] ?? 80
    const numberOfProjectiles = [8, 15, 30, 45][pokemon.stars - 1] ?? 45

    for (let i = 0; i < numberOfProjectiles; i++) {
      const x = randomBetween(0, BOARD_WIDTH - 1)
      const y =
        target.positionY >= 3
          ? randomBetween(3, BOARD_HEIGHT - 1)
          : randomBetween(0, 3)
      const enemyHit = board.getEntityOnCell(x, y)
      if (enemyHit && enemyHit.team !== pokemon.team) {
        enemyHit.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit
        )
        enemyHit.effects.add(EffectEnum.HAIL)
        enemyHit.status.triggerFreeze(1000, enemyHit, pokemon)
      }
      pokemon.broadcastAbility({
        skill: "HAIL_PROJECTILE",
        targetX: x,
        targetY: y
      })
      board.addBoardEffect(x, y, EffectEnum.HAIL, pokemon.simulation)
    }
  }
}
