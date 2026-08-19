import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

class ThunderShockStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = [30, 60, 120, 240][pokemon.stars - 1] ?? 240
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
  }
}

export const thunderShockStrategy = new ThunderShockStrategy()
