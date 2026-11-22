import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TormentStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const boost = [20, 35, 50, 65][pokemon.stars - 1] ?? 65
    pokemon.addSpeed(boost, pokemon, 1, crit)
    pokemon.resetCooldown(500)
  }
}
