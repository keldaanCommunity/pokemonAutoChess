import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AgilityStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit, true)
    const boost = [10, 20, 30, 60][pokemon.stars - 1] ?? 60
    pokemon.addSpeed(boost, pokemon, 1, crit)
  }
}
