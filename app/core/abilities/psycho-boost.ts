import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PsychoBoostStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const damage = [90, 120, 150, 300][pokemon.stars - 1] ?? 300
    for (const positionX of [
      target.positionX - 1,
      target.positionX,
      target.positionX + 1
    ]) {
      const tg = board.getEntityOnCell(positionX, target.positionY)
      if (tg && tg.team !== pokemon.team) {
        pokemon.broadcastAbility({
          positionX: tg.positionX,
          positionY: tg.positionY
        })
        tg.handleSpecialDamage(
          damage,
          board,
          AttackType.SPECIAL,
          pokemon,
          crit,
          true
        )
        pokemon.addAbilityPower(-10, pokemon, 0, false)
      }
    }
  }
}
