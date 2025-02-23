import Player from "../models/colyseus-models/player"
import { Effect } from "../types/enum/Effect"
import { PokemonActionState } from "../types/enum/Game"
import { Passive } from "../types/enum/Passive"
import { Synergy } from "../types/enum/Synergy"
import { Weather } from "../types/enum/Weather"
import { distanceC } from "../utils/distance"
import Board from "./board"
import { PokemonEntity, getMoveSpeed } from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { findPath } from "../utils/pathfind"

export default class MovingState extends PokemonState {
  name = "moving"

  update(pokemon: PokemonEntity, dt: number, board: Board, player: Player) {
    super.update(pokemon, dt, board, player)
    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = Math.round(500 / getMoveSpeed(pokemon)) // 500ms to move one cell at 50 speed in normal conditions
      const targetAtRange = this.getNearestTargetAtRangeCoordinates(
        pokemon,
        board
      )
      if (pokemon.status.charm && pokemon.canMove) {
        if (
          pokemon.status.charmOrigin &&
          distanceC(
            pokemon.positionX,
            pokemon.positionY,
            pokemon.status.charmOrigin.positionX,
            pokemon.status.charmOrigin.positionY
          ) > 1
        ) {
          this.move(pokemon, board, {
            x: pokemon.status.charmOrigin.positionX,
            y: pokemon.status.charmOrigin.positionY
          })
        }
      } else if (targetAtRange) {
        pokemon.toAttackingState()
      } else {
        const targetAtSight = this.getNearestTargetAtSightCoordinates(
          pokemon,
          board
        )
        if (targetAtSight && pokemon.canMove) {
          this.move(pokemon, board, targetAtSight)
        }
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt)
      if (pokemon.status.skydiving && pokemon.cooldown <= 0) {
        pokemon.status.skydiving = false
      }
    }
  }

  move(
    pokemon: PokemonEntity,
    board: Board,
    coordinates: { x: number; y: number }
  ) {
    //logger.debug('move attempt');

    let x: number | undefined = undefined
    let y: number | undefined = undefined

    if (
      pokemon.types.has(Synergy.DARK) &&
      pokemon.range === 1 &&
      pokemon.passive !== Passive.GUZZLORD &&
      !pokemon.status.locked
    ) {
      // dark jump
      const farthestCoordinate =
        board.getFarthestTargetCoordinateAvailablePlace(pokemon)
      //logger.debug({ farthestCoordinate })
      if (farthestCoordinate) {
        x = farthestCoordinate.x
        y = farthestCoordinate.y

        if (pokemon.passive === Passive.STENCH) {
          board
            .getCellsBetween(x, y, pokemon.positionX, pokemon.positionY)
            .forEach((cell) => {
              if (cell.x !== x || cell.y !== y) {
                board.addBoardEffect(
                  cell.x,
                  cell.y,
                  Effect.POISON_GAS,
                  pokemon.simulation
                )
              }
            })
        }

        // logger.debug(`pokemon ${pokemon.name} jumped from (${pokemon.positionX},${pokemon.positionY}) to (${x},${y}), (desired direction (${coordinates.x}, ${coordinates.y})), orientation: ${pokemon.orientation}`);
        board.swapValue(pokemon.positionX, pokemon.positionY, x, y)
        pokemon.orientation = board.orientation(
          x,
          y,
          pokemon.targetX,
          pokemon.targetY,
          pokemon,
          undefined
        )
      }
    } else {
      // Using pathfinding to get optimal path
      //console.debug('Current Pokemon:', pokemon.name, 'Position:', pokemon.positionX, pokemon.positionY);
      //console.debug('target Pokemons position:', coordinates.x , coordinates.y);
      const cells = board.getOuterRangeCells(
        coordinates.x,
        coordinates.y,
        pokemon.range
      )
      let distance = 999
      cells.forEach((cell) => {
        if (cell.value === undefined) {
          const candidateDistance = findPath(
            board,
            [pokemon.positionX, pokemon.positionY],
            [cell.x, cell.y]
          )
          //logger.debug(`${pokemon.name} - Candidate (${cell.x},${cell.y}) to ${coordinates.x},${coordinates.y}, distance: ${candidateDistance}`);
          if (
            candidateDistance.length < distance &&
            candidateDistance.length !== 0
          ) {
            distance = candidateDistance.length
            const nextStep = candidateDistance[0]
            x = nextStep[0]
            y = nextStep[1]
          }
        }
      })
      if (x !== undefined && y !== undefined) {
        pokemon.orientation = board.orientation(
          pokemon.positionX,
          pokemon.positionY,
          x,
          y,
          pokemon,
          undefined
        )
        // logger.debug(`pokemon ${pokemon.name} moved from (${pokemon.positionX},${pokemon.positionY}) to (${x},${y}), (desired direction (${coordinates.x}, ${coordinates.y})), orientation: ${pokemon.orientation}`);
        board.swapValue(pokemon.positionX, pokemon.positionY, x, y)
      }
    }
  }

  onEnter(pokemon: PokemonEntity) {
    super.onEnter(pokemon)
    pokemon.action = PokemonActionState.WALK
    pokemon.cooldown = 0
  }

  onExit(pokemon: PokemonEntity) {
    if (pokemon.status.skydiving) {
      pokemon.status.skydiving = false
    }
    super.onExit(pokemon)
  }
}
