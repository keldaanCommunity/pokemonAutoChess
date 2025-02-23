import Player from "../models/colyseus-models/player"
import { PokemonActionState } from "../types/enum/Game"
import { Weather } from "../types/enum/Weather"
import { distanceC } from "../utils/distance"
import { chance } from "../utils/random"
import { AbilityStrategies } from "./abilities/abilities"
import Board from "./board"
import { PokemonEntity } from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { AttackCommand } from "./simulation-command"
import delays from "../types/delays.json"
import { IPokemonEntity } from "../types"
import { PROJECTILE_SPEED } from "../types/Config"
import { max } from "../utils/number"
import { Effect } from "../types/enum/Effect"

export default class AttackingState extends PokemonState {
  name = "attacking"

  update(pokemon: PokemonEntity, dt: number, board: Board, player: Player) {
    super.update(pokemon, dt, board, player)

    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = Math.round(1000 / (0.4 + pokemon.speed * 0.007))

      // first, try to hit the same target than previous attack
      let target = board.getValue(pokemon.targetX, pokemon.targetY)
      let targetCoordinate: { x: number; y: number } | undefined = {
        x: pokemon.targetX,
        y: pokemon.targetY
      }

      if (pokemon.status.confusion) {
        targetCoordinate = this.getTargetCoordinateWhenConfused(pokemon, board)
      } else if (
        !(
          target &&
          target.isTargettableBy(pokemon) &&
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
        if (pokemon.effects.has(Effect.ABILITY_CRIT)) {
          crit = chance(pokemon.critChance / 100, pokemon)
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
        pokemon.orientation = board.orientation(
          pokemon.positionX,
          pokemon.positionY,
          targetCoordinate.x,
          targetCoordinate.y,
          pokemon,
          target
        )

        const { delayBeforeShoot, travelTime } = getAttackTimings(pokemon)
        pokemon.commands.push(
          new AttackCommand(
            delayBeforeShoot + travelTime,
            pokemon,
            target,
            board
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

export function getAttackTimings(pokemon: IPokemonEntity): {
  delayBeforeShoot: number
  travelTime: number
  attackDuration: number
} {
  const attackDuration = 1000 / pokemon.speed
  const d = delays[pokemon.index]?.d || 18 // number of frames before hit
  const t = delays[pokemon.index]?.t || 36 // total number of frames in the animation

  const delayBeforeShoot = max(attackDuration / 2)((attackDuration * d) / t)
  const distance = distanceC(
    pokemon.targetX,
    pokemon.targetY,
    pokemon.positionX,
    pokemon.positionY
  )
  const travelTime = (distance * 1000) / PROJECTILE_SPEED
  return { delayBeforeShoot, travelTime, attackDuration }
}
