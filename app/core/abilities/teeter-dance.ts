import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TeeterDanceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.addSpeed(20, pokemon, 1, crit)
    const confusionDuration = ([3, 3, 3, 6][pokemon.stars - 1] ?? 6) * 1000
    board.cells
      .filter((v) => v !== undefined)
      .forEach((v) => v && v.status.triggerConfusion(confusionDuration, v, pokemon))
  }
}
