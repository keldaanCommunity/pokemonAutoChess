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
    const flatHeal = [15, 25, 35, 70][pokemon.stars - 1] ?? 70
    const healWithAP = flatHeal * (2 + pokemon.ap / 100)
    pokemon.handleHeal(healWithAP, pokemon, 0, crit)
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
