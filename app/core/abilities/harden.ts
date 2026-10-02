import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class HardenStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const defGain = [4, 8, 12, 24][pokemon.stars - 1] ?? 24
    pokemon.addDefense(defGain, pokemon, 1, crit)
  }
}
