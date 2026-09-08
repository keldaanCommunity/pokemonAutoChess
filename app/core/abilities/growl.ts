import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GrowlStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const atkDebuff = [3, 5, 7, 14][pokemon.stars - 1] ?? 14
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerFlinch(3000, cell.value, pokemon)
          cell.value.addAttack(-atkDebuff, pokemon, 1, crit)
        }
      })
  }
}
