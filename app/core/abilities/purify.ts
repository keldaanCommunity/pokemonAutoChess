import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class PurifyStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
      .forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.clearNegativeStatus(cell.value, pokemon)
        }
      })

    const heal = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    pokemon.handleHeal(heal, pokemon, 1, crit)
  }
}
