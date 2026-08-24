import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class TickleStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const attackLost = 3
    const defLost = 3
    const nbMaxEnemiesHit = [1, 2, 3, 5][pokemon.stars - 1] ?? 5
    let nbEnemiesHit = 0
    board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .forEach((cell) => {
        if (
          cell.value &&
          cell.value.team !== pokemon.team &&
          nbEnemiesHit < nbMaxEnemiesHit
        ) {
          nbEnemiesHit++
          cell.value.addAttack(-attackLost, pokemon, 1, crit)
          cell.value.addDefense(-defLost, pokemon, 1, crit)
        }
      })
  }
}
