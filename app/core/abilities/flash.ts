import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FlashStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)

    const duration =
      ([2000, 4000, 6000, 12000][pokemon.stars - 1] ?? 12000) *
      (1 + pokemon.ap / 100) *
      (crit ? pokemon.critPower : 1)
    board
      .getCellsInRadius(pokemon.positionX, pokemon.positionY, 3, false)
      .forEach((cell) => {
        if (cell.value && cell.value.team !== pokemon.team) {
          cell.value.status.triggerBlinded(duration, cell.value, pokemon)
        }
      })
  }
}
