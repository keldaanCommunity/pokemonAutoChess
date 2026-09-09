import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class KnockOffStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const baseDamage = [30, 60, 90, 100, 200][pokemon.stars - 1] ?? 200
    const perItemDamage = [15, 20, 30, 35, 60][pokemon.stars - 1] ?? 60
    const damage = baseDamage + target.items.size * perItemDamage

    target.items.forEach((item) => {
      target.removeItem(item)
    })

    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}
