import Player from "../models/colyseus-models/player"
import { PokemonActionState } from "../types/enum/Game"
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
import { EffectEnum } from "../types/enum/Effect"

export default class AttackingState extends PokemonState {
  name = "attacking"

  update(pokemon: PokemonEntity, dt: number, board: Board, player: Player) {
    super.update(pokemon, dt, board, player)

    if (pokemon.cooldown <= 0) {
      const speed = pokemon.status.paralysis ? pokemon.speed / 2 : pokemon.speed
      pokemon.cooldown = Math.round(1000 / (0.4 + speed * 0.007))

      // first, try to hit the same target than previous attack
      let target = board.getEntityOnCell(pokemon.targetX, pokemon.targetY)

      if (pokemon.effects.has(EffectEnum.MERCILESS)) {
        const candidates = this.getTargetsAtRange(pokemon, board)
        let minLife = Infinity
        for (const candidate of candidates) {
          if (candidate.life + candidate.shield < minLife) {
            minLife = candidate.life + candidate.shield
            target = candidate
          }
        }
      } else if (pokemon.status.confusion) {
        target = this.getTargetWhenConfused(pokemon, board)
      } else if (!target || target.id !== pokemon.targetEntityId) {
        // previous target has moved, check if still at range
        const previousTarget = pokemon.simulation.blueTeam.get(pokemon.targetEntityId) || pokemon.simulation.redTeam.get(pokemon.targetEntityId)
        if (previousTarget && previousTarget.isTargettableBy(pokemon) && distanceC(
          pokemon.positionX,
          pokemon.positionY,
          previousTarget?.positionX,
          previousTarget?.positionY
        ) <= pokemon.range) {
          // updating target coordinates
          target = previousTarget as PokemonEntity
        } else {
          // if target is no longer alive or at range, retargeting
          target = this.getNearestTargetAtRange(pokemon, board)
        }
      }

      // no target at range, changing to moving state
      if (!target || pokemon.status.charm) {
        const targetAtSight = this.getNearestTargetAtSight(pokemon, board)
        if (targetAtSight) {
          pokemon.toMovingState()
        }
      } else if (
        pokemon.pp >= pokemon.maxPP &&
        !pokemon.status.silence
      ) {
        // CAST ABILITY
        let crit = false
        const ability = AbilityStrategies[pokemon.skill]
        if (
          pokemon.effects.has(EffectEnum.ABILITY_CRIT) ||
          ability.canCritByDefault
        ) {
          crit = chance(pokemon.critChance / 100, pokemon)
        }
        ability.process(pokemon, board, target, crit)
      } else {
        // BASIC ATTACK
        pokemon.count.attackCount++
        pokemon.targetX = target.positionX
        pokemon.targetY = target.positionY
        pokemon.targetEntityId = target.id
        pokemon.orientation = board.orientation(
          pokemon.positionX,
          pokemon.positionY,
          pokemon.targetX,
          pokemon.targetY,
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
    pokemon.setTarget(null)
  }
}

export function getAttackTimings(pokemon: IPokemonEntity): {
  delayBeforeShoot: number
  travelTime: number
  attackDuration: number
} {
  const speed = pokemon.status.paralysis ? pokemon.speed / 2 : pokemon.speed
  const attackDuration = 1000 / speed
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
