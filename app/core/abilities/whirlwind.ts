import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class WhirlwindStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const x = target.positionX
    const y = target.positionY
    const damage = [40, 80, 120, 240][pokemon.stars - 1] ?? 240
    target.flyAway(board)
    pokemon.broadcastAbility({
      positionX: x,
      positionY: y,
      targetX: target.positionX,
      targetY: target.positionY
    })
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
