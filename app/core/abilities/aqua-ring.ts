import { AbilityConfigs } from "../../config/game/abilities"
import { Ability } from "../../types/enum/Ability"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class AquaRingStrategy extends AbilityStrategy {
  requiresTarget = false
  readonly config = AbilityConfigs[Ability.AQUA_RING]

  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const heal = this.computeValue(this.config.heal, pokemon)
    const mostSurroundedCoordinate =
      pokemon.state.getMostSurroundedCoordinateAvailablePlace(
        pokemon.team,
        board
      )
    if (mostSurroundedCoordinate) {
      pokemon.moveTo(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y,
        board,
        false
      )

      const cells = board.getAdjacentCells(
        mostSurroundedCoordinate.x,
        mostSurroundedCoordinate.y
      )
      cells.push({
        x: mostSurroundedCoordinate.x,
        y: mostSurroundedCoordinate.y,
        value: board.getEntityOnCell(
          mostSurroundedCoordinate.x,
          mostSurroundedCoordinate.y
        )
      })

      cells.forEach((cell) => {
        if (cell.value && cell.value.team === pokemon.team) {
          cell.value.status.clearNegativeStatus(cell.value, pokemon)
          cell.value.handleHeal(heal, pokemon, 1, crit)
        }
      })
    }
  }
}
