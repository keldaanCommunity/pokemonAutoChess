import Player from "../models/colyseus-models/player"
import { PokemonActionState } from "../types/enum/Game"
import { Item } from "../types/enum/Item"
import { Passive } from "../types/enum/Passive"
import { Synergy } from "../types/enum/Synergy"
import { distanceC } from "../utils/distance"
import { findPath } from "../utils/pathfind"
import { values } from "../utils/schemas"
import type { Board } from "./board"
import { OnMoveEffect } from "./effects/effect"
import { ItemEffects } from "./effects/items"
import { drumBeat, partingShot, stenchJump } from "./effects/passives"
import { getMoveSpeed, PokemonEntity } from "./pokemon-entity"
import PokemonState from "./pokemon-state"

export default class MovingState extends PokemonState {
  name = "moving"

  update(pokemon: PokemonEntity, dt: number, board: Board, player: Player) {
    super.update(pokemon, dt, board, player)
    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = Math.round(500 / getMoveSpeed(pokemon)) // 500ms to move one cell at 50 speed in normal conditions
      const targetAtRange = this.getNearestTargetAtRange(pokemon, board)
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
      } else if (
        pokemon.passive === Passive.DRUMMER &&
        board.cells.some(
          (entity) =>
            entity?.team === pokemon.team &&
            entity?.passive !== Passive.DRUMMER &&
            entity?.passive !== Passive.INANIMATE
        )
      ) {
        drumBeat(pokemon, board)
      } else {
        const targetAtSight = this.getNearestTargetAtSight(pokemon, board)
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
          stenchJump(pokemon, board, x, y)
        }

        if (pokemon.passive === Passive.PARTING_SHOT) {
          partingShot(pokemon, farthestCoordinate.target, x, y)
        }

        // logger.debug(`pokemon ${pokemon.name} jumped from (${pokemon.positionX},${pokemon.positionY}) to (${x},${y}), (desired direction (${coordinates.x}, ${coordinates.y})), orientation: ${pokemon.orientation}`);
        const oldX = pokemon.positionX
        const oldY = pokemon.positionY
        board.swapCells(oldX, oldY, x, y)
        this.onMove(pokemon, board, oldX, oldY, x, y)
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
        // logger.debug(`pokemon ${pokemon.name} moved from (${pokemon.positionX},${pokemon.positionY}) to (${x},${y}), (desired direction (${coordinates.x}, ${coordinates.y})), orientation: ${pokemon.orientation}`);
        const oldX = pokemon.positionX
        const oldY = pokemon.positionY
        board.swapCells(oldX, oldY, x, y)
        this.onMove(pokemon, board, oldX, oldY, x, y)
      }
    }
  }

  onMove(pokemon: PokemonEntity, board: Board, oldX: number, oldY: number, newX: number, newY: number) {
    //update orientation
    pokemon.orientation = board.orientation(
      oldX,
      oldY,
      newX,
      newY,
      pokemon,
      undefined
    )

    const onMoveEffects = [
      ...pokemon.effectsSet.values(),
      ...values<Item>(pokemon.items).flatMap((item) => ItemEffects[item] ?? [])
    ].filter((effect) => effect instanceof OnMoveEffect)

    onMoveEffects.forEach((effect) => {
      effect.apply(pokemon, board, oldX, oldY, newX, newY)
    })
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
