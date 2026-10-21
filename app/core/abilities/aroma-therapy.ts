import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AromatherapyStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const heal = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.clearNegativeStatus(cell.value, pokemon)
          cell.value.handleHeal(heal, pokemon, 1, crit)
        }
      })
  }
}
