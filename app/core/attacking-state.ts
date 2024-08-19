import Player from "../models/colyseus-models/player"
import { PokemonActionState } from "../types/enum/Game"
import { Item } from "../types/enum/Item"
import { Weather } from "../types/enum/Weather"
import { distanceC } from "../utils/distance"
import { chance, pickRandomIn } from "../utils/random"
import { AbilityStrategies } from "./abilities/abilities"
import Board from "./board"
import { PokemonEntity } from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { AttackCommand } from "./simulation-command"
import { getAttackTimings } from "../public/src/game/animation-manager"

export default class AttackingState extends PokemonState {
  update(
    pokemon: PokemonEntity,
    dt: number,
    board: Board,
    weather: Weather,
    player: Player
  ) {
    super.update(pokemon, dt, board, weather, player)

    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = pokemon.getAttackDelay()

      // first, try to hit the same target than previous attack
      let target = board.getValue(pokemon.targetX, pokemon.targetY)
      let targetCoordinate: { x: number; y: number } | undefined = {
        x: pokemon.targetX,
        y: pokemon.targetY
      }

      if (pokemon.status.confusion) {
        target = this.getTargetWhenConfused(pokemon, board)
        targetCoordinate = { x: target.positionX, y: target.positionY }
      } else if (
        !(
          target &&
          target.team !== pokemon.team &&
          target.isTargettable &&
          distanceC(
            pokemon.positionX,
            pokemon.positionY,
            targetCoordinate.x,
            targetCoordinate.y
          ) <= pokemon.range
        )
      ) {
        // if target is no longer alive or at range, retargeting
        targetCoordinate = this.getNearestTargetAtRangeCoordinates(
          pokemon,
          board
        )
        if (targetCoordinate) {
          target = board.getValue(targetCoordinate.x, targetCoordinate.y)
        }
      }

      // no target at range, changing to moving state
      if (!target || !targetCoordinate || pokemon.status.charm) {
        const targetAtSight = this.getNearestTargetAtSightCoordinates(
          pokemon,
          board
        )
        if (targetAtSight) {
          pokemon.toMovingState()
        }
      } else if (
        target &&
        pokemon.pp >= pokemon.maxPP &&
        !pokemon.status.silence
      ) {
        // CAST ABILITY
        let crit = false
        if (pokemon.items.has(Item.REAPER_CLOTH)) {
          crit = chance(pokemon.critChance / 100)
        }
        AbilityStrategies[pokemon.skill].process(
          pokemon,
          this,
          board,
          target,
          crit
        )
      } else {
        // BASIC ATTACK
        pokemon.count.attackCount++
        pokemon.targetX = targetCoordinate.x
        pokemon.targetY = targetCoordinate.y
        
        // If attacking self, pick random coordinates that differs from own coordinates for orientation.
        if (targetCoordinate.x === pokemon.positionX && targetCoordinate.y === pokemon.positionY) {
          let tempX = targetCoordinate.x
          let tempY = targetCoordinate.y
          while (tempX === pokemon.positionX && tempY === pokemon.positionY) {
            tempX = pickRandomIn([0,1,2,3,4,5,6,7])
            tempY = pickRandomIn([0,1,2,3,4,5,6,7])
          }
          pokemon.orientation = board.orientation(
            pokemon.positionX,
            pokemon.positionY,
            tempX,
            tempY,
            pokemon,
            target
          )
        } else {
          pokemon.orientation = board.orientation(
            pokemon.positionX,
            pokemon.positionY,
            targetCoordinate.x,
            targetCoordinate.y,
            pokemon,
            target
          )
        }

        const { delayBeforeShoot, travelTime } = getAttackTimings(pokemon)
        pokemon.commands.push(
          new AttackCommand(
            delayBeforeShoot + travelTime,
            pokemon,
            board,
            targetCoordinate
          )
        )
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt)
    }
  }

  onEnter(pokemon) {
    super.onEnter(pokemon)
    pokemon.action = PokemonActionState.ATTACK
    pokemon.cooldown = 0
  }

  onExit(pokemon) {
    super.onExit(pokemon)
    pokemon.targetX = -1
    pokemon.targetY = -1
  }
}
