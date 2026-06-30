import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RolloutStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const multiplier = 2
    const defenseBoost = [2, 5, 10, 20][pokemon.stars - 1] ?? 20

    pokemon.addDefense(defenseBoost, pokemon, 1, crit)
    target.handleSpecialDamage(
      multiplier * pokemon.def,
      board,
      AttackType.SPECIAL,
      pokemon,
      false,
      false
    )
  }
}
