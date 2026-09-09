import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DisarmingVoiceStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const radius = [1, 2, 3, 4][pokemon.stars - 1] ?? 4
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      radius,
      false
    )
    const charmDuration = [1000, 1000, 1000, 2000][pokemon.stars - 1] ?? 2000
    cells.forEach((cell) => {
      if (cell.value && pokemon.team != cell.value.team) {
        cell.value.status.triggerCharm(charmDuration, target, pokemon, true)
      }
    })
  }
}
