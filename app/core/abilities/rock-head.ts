import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RockHeadStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const damage = Math.round(([1.2, 1.2, 1.5, 3][pokemon.stars - 1] ?? 3) * (pokemon.atk + pokemon.def))

    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}
