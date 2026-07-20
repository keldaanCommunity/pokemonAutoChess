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
    const flatDamage = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    const damageWithAP = Math.floor(flatDamage * (2 + pokemon.ap / 100))

    const { death } = target.handleSpecialDamage(
      damageWithAP,
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
