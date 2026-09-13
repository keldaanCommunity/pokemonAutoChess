import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class StrengthStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const dmgMultiplier = [2, 2, 2, 4][pokemon.stars - 1] ?? 4
    const damage = dmgMultiplier * (pokemon.atk + pokemon.def + pokemon.speDef) + pokemon.ap
    target.handleSpecialDamage(
      damage,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      false
    )
  }
}
