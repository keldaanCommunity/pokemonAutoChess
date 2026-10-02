import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class ScreechStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit, true)
    const debuff = [-2, -4, -8, -16][pokemon.stars - 1] ?? -16
    const cells = board.getCellsInRadius(
      pokemon.positionX,
      pokemon.positionY,
      2,
      false
    )
    cells.forEach((cell) => {
      if (cell.value && cell.value.team !== pokemon.team) {
        cell.value.addDefense(debuff, pokemon, 1, crit)
        pokemon.broadcastAbility({ targetX: cell.x, targetY: cell.y })
      }
    })
  }
}
