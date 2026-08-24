import { AttackType } from "../../types/enum/Game"
import { max } from "../../utils/number"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PickupStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240

    if (target.items.size > 0 && pokemon.items.size < 3) {
      const item = target.items.values().next().value
      if (item) {
        target.removeItem(item)
        pokemon.addItem(item)
      }
    } else {
      if (target.player) {
        const moneyStolen = max(target.player.money)(pokemon.stars)
        target.player.addMoney(-moneyStolen, false, target)
        if (pokemon.player) {
          pokemon.player.addMoney(moneyStolen, true, pokemon)
          pokemon.count.moneyCount += moneyStolen
        }
      }
    }

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
