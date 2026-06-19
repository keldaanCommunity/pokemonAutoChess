import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PaydayStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.floor(
      ([30, 60, 120, 240][pokemon.stars - 1] ?? 240) * (1 + (0.5 * pokemon.ap) / 100)
    )

    const { death } = target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      false
    )
    if (death && pokemon.player) {
      pokemon.player.addMoney(pokemon.stars, true, pokemon)
      pokemon.count.moneyCount += pokemon.stars
    }
  }
}
