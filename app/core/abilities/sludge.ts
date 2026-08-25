import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class SludgeStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const nbStacks = [2, 3, 4, 8][pokemon.stars - 1] ?? 8
    const duration = Math.round(
      ([3000, 3000, 3000, 10000][pokemon.stars - 1] ?? 10000) * (1 + pokemon.ap / 100) * (crit ? pokemon.critPower : 1)
    )
    const cells = board.getCellsInFront(pokemon, target)

    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        for (let i = 0; i < nbStacks; i++) {
          cell.value.status.triggerPoison(duration, cell.value, pokemon)
        }
      }
    })
  }
}
