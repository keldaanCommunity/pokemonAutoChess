import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { PokemonActionState } from "../types/enum/Game"
import { Synergy } from "../types/enum/Synergy"

export default class MovingState extends PokemonState {
  update(
    pokemon: PokemonEntity,
    dt: number,
    board: Board,
    climate: string
  ): boolean {
    super.update(pokemon, dt, board, climate)
    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = 500
      const targetCoordinate = this.getNearestTargetCoordinate(pokemon, board)
      // no target case
      // eslint-disable-next-line no-empty
      if (!targetCoordinate) {
      } else if (
        board.distance(
          pokemon.positionX,
          pokemon.positionY,
          targetCoordinate.x,
          targetCoordinate.y
        ) <= pokemon.range &&
        !pokemon.status.confusion
      ) {
        pokemon.toAttackingState()
      } else {
        if (!pokemon.status.sleep && !pokemon.status.freeze) {
          this.move(pokemon, board, targetCoordinate)
        }
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt)
    }
    return false
  }

  move(
    pokemon: PokemonEntity,
    board: Board,
    coordinates: { x: number; y: number }
  ) {
    // console.log('move attempt');

    let x: number | undefined = undefined
    let y: number | undefined = undefined
    if (pokemon.types.includes(Synergy.FOSSIL)) {
      const farthestCoordinate = this.getFarthestTargetCoordinateAvailablePlace(
        pokemon,
        board
      )
      //console.log(farthestCoordinate)
      if (farthestCoordinate) {
        x = farthestCoordinate.x
        y = farthestCoordinate.y
      }
    } else {
      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
      let distance = 999

      cells.forEach((cell) => {
        if (cell.value === undefined) {
          const candidateDistance = board.distance(
            coordinates.x,
            coordinates.y,
            cell.row,
            cell.column
          )
          // console.log(`Candidate (${cell.row},${cell.column}) to ${coordinates}, distance: ${candidateDistance}`);
          if (candidateDistance < distance) {
            distance = candidateDistance
            x = cell.row
            y = cell.column
          }
        }
      })
    }
    if (x !== undefined && y !== undefined) {
      pokemon.orientation = board.orientation(
        pokemon.positionX,
        pokemon.positionY,
        x,
        y
      )
      // console.log(`pokemon moved from (${pokemon.positionX},${pokemon.positionY}) to (${x},${y}), (desired direction (${coordinates[0]}, ${coordinates[1]})), orientation: ${pokemon.orientation}`);
      board.swapValue(pokemon.positionX, pokemon.positionY, x, y)
      pokemon.positionX = x
      pokemon.positionY = y
    }
  }

  onEnter(pokemon: PokemonEntity) {
    super.onEnter(pokemon)
    pokemon.action = PokemonActionState.WALK
  }

  onExit(pokemon: PokemonEntity) {
    super.onExit(pokemon)
  }
}

module.exports = MovingState
