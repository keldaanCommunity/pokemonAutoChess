import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RecoverStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const heal = ([25, 25, 50, 100][pokemon.stars - 1] ?? 100) / 100 * pokemon.maxHP
    pokemon.handleHeal(heal, pokemon, 1, crit)
  }
}
