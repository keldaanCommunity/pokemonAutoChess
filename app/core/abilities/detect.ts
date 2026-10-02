import type { Board, Cell } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class DetectStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const adjacentAllies: PokemonEntity[] = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .filter<Cell & { value: PokemonEntity }>(
        (cell): cell is Cell & { value: PokemonEntity } =>
          cell.value != null && cell.value.team === pokemon.team
      )
      .map((cell) => cell.value)
    const nbEnemiesDetected = board
      .getCellsInRange(pokemon.positionX, pokemon.positionY, 2, false)
      .filter((cell) => cell.value && cell.value.team !== pokemon.team).length

    const protectDuration = Math.round(
      ([500, 600, 800, 1000][pokemon.stars - 1] ?? 1000) *
        nbEnemiesDetected *
        (1 + pokemon.ap / 100) *
        (crit ? pokemon.critPower : 1)
    )
    adjacentAllies.forEach((ally) => {
      ally.status.triggerProtect(protectDuration)
    })
  }
}
