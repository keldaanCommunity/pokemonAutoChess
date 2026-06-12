import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PsychicFangsStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    target.atk = Math.min(target.atk, target.baseAtk)
    target.def = Math.min(target.def, target.baseDef)
    target.speDef = Math.min(target.speDef, target.baseSpeDef)
    target.handleSpecialDamage(
      [20, 40, 80, 160][pokemon.stars - 1] ?? 160,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit,
      true
    )
  }
}
