import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BaredFangsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    // Deal [120,140,160,320]% of ATK as SPECIAL damage
    const damageMultiplier = [1.2, 1.4, 1.6, 3.2][pokemon.stars - 1] ?? 3.2
    const damage = Math.round(pokemon.atk * damageMultiplier)
    const speedSteal = 10

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)

    // Steal 10 SPEED from target and give it to attacker
    if (target.items.has(Item.TWIST_BAND) === false) {
      target.addSpeed(-speedSteal, pokemon, 1, crit)
      pokemon.addSpeed(speedSteal, pokemon, 1, crit)
    }
  }
}
