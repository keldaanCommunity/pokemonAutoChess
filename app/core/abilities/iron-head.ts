import { AttackType } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class IronHeadStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const buff = [5, 10, 15, 30][pokemon.stars - 1] ?? 30
    pokemon.addDefense(buff, pokemon, 1, crit)
    pokemon.addSpecialDefense(buff, pokemon, 1, crit)
    target.handleSpecialDamage(
      pokemon.def + pokemon.speDef,
      board,
      AttackType.SPECIAL,
      pokemon,
      crit
    )
  }
}
