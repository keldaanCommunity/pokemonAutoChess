import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class CamouflageStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = [30, 50, 70, 140][pokemon.stars - 1] ?? 140
    pokemon.handleHeal(heal, pokemon, 0.5, crit)
    if (target && target.canBeCopied) {
      pokemon.index = target.index
      pokemon.atk = Math.max(pokemon.atk, target.atk)
      pokemon.def = Math.max(pokemon.def, target.def)
      pokemon.speDef = Math.max(pokemon.speDef, target.speDef)
      if (pokemon.range > target.range) {
        pokemon.toMovingState() // might need to readjust target if range is reduced
      }
      pokemon.range = target.range
    }
  }
}
