import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class LeafBladeStrategy extends AbilityStrategy {
  canCritByDefault = true
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, true)
    const damage = Math.round(pokemon.atk * ([100, 125, 150, 250][pokemon.stars - 1] ?? 250) / 100)
    target.handleSpecialDamage(damage, board, AttackType.TRUE, pokemon, true)
  }
}
