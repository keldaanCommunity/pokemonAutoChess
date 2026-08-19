import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class WaterfallStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const shield = [50, 100, 150, 300][pokemon.stars - 1] ?? 300
    pokemon.addShield(shield, pokemon, 1, crit)
    pokemon.status.clearNegativeStatus(pokemon, pokemon)
    board.clearBoardEffect(
      pokemon.positionX,
      pokemon.positionY,
      pokemon.simulation
    )
  }
}
