import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MagicPowderStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const shield = [15, 30, 60, 120][pokemon.stars - 1] ?? 120
    const silenceDuration = [2000, 3000, 4000, 8000][pokemon.stars - 1] ?? 8000
    pokemon.addShield(shield, pokemon, 1, crit)
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerSilence(silenceDuration, cell.value, pokemon)
        }
      })
  }
}
