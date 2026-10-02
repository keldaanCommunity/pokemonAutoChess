import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SlackOffStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.status.clearNegativeStatus(pokemon, pokemon)
    const healFactor = [0.3, 0.3, 0.3, 0.6][pokemon.stars - 1] ?? 0.6
    pokemon.handleHeal(pokemon.maxHP * healFactor, pokemon, 1, crit)
    pokemon.status.triggerSleep(3000, pokemon)
  }
}
