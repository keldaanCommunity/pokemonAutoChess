import { Item } from "../types/enum/Item"
import { AttackType } from "../types/enum/Game"
import { Effect } from "../types/enum/Effect"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { PokemonActionState } from "../types/enum/Game"
import { chance } from "../utils/random"

export default class AttackingState extends PokemonState {
  update(pokemon: PokemonEntity, dt: number, board: Board, weather: string) {
    super.update(pokemon, dt, board, weather)

    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = pokemon.getAttackDelay()
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
          target.team !== pokemon.team &&
          target.isTargettable &&
          board.distance(
            pokemon.positionX,
            pokemon.positionY,
            targetCoordinate.x,
            targetCoordinate.y
          ) <= pokemon.range
        )
      ) {
        targetCoordinate = this.getNearestTargetCoordinate(pokemon, board)
        if (targetCoordinate) {
          target = board.getValue(targetCoordinate.x, targetCoordinate.y)
        }
      }

      // no target case
      if (!targetCoordinate) {
        pokemon.toMovingState()
      } else if (
        board.distance(
          pokemon.positionX,
          pokemon.positionY,
          targetCoordinate.x,
          targetCoordinate.y
        ) > pokemon.range
      ) {
        pokemon.toMovingState()
      } else if (
        target &&
        pokemon.mana >= pokemon.maxMana &&
        !pokemon.status.silence
      ) {
        // CAST ABILITY
        let crit = false
        if (pokemon.items.has(Item.REAPER_CLOTH)) {
          crit = chance(pokemon.critChance / 100)
        }
        pokemon.strategy.process(pokemon, this, board, target, crit)
      } else {
        // BASIC ATTACK
        this.attack(pokemon, board, targetCoordinate)
        if (
          pokemon.effects.includes(Effect.EERIE_IMPULSE) ||
          pokemon.effects.includes(Effect.RISING_VOLTAGE) ||
          pokemon.effects.includes(Effect.OVERDRIVE)
        ) {
          let tripleAttackChance = 0
          if (pokemon.effects.includes(Effect.EERIE_IMPULSE)) {
            tripleAttackChance = 0.3
          } else if (pokemon.effects.includes(Effect.RISING_VOLTAGE)) {
            tripleAttackChance = 0.4
          } else if (pokemon.effects.includes(Effect.OVERDRIVE)) {
            tripleAttackChance = 0.5
          }
          if (Math.random() < tripleAttackChance) {
            pokemon.count.tripleAttackCount++
            this.attack(pokemon, board, targetCoordinate)
            this.attack(pokemon, board, targetCoordinate)
          }
        }
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt)
    }
  }

  attack(
    pokemon: PokemonEntity,
    board: Board,
    coordinates: { x: number; y: number }
  ) {
    pokemon.count.attackCount++
    pokemon.targetX = coordinates.x
    pokemon.targetY = coordinates.y    

    const target = board.getValue(coordinates.x, coordinates.y)
    if (target) {

      let isAttackSuccessful = true
      if (chance(target.dodge) && !pokemon.items.has(Item.XRAY_VISION)) {
        isAttackSuccessful = false
        pokemon.count.dodgeCount += 1
      }
      if(target.status.protect){
        isAttackSuccessful = false
      }      

      pokemon.orientation = board.orientation(
        pokemon.positionX,
        pokemon.positionY,
        target.positionX,
        target.positionY,
        pokemon,
        target
      )

      let physicalDamage = pokemon.atk
      let trueDamage = 0
      let totalTakenDamage = 0
      const attackType = pokemon.attackType

      if (Math.random() * 100 < pokemon.critChance) {
        pokemon.onCritical(target, board)
        if (target.items.has(Item.ROCKY_HELMET) === false) {
          physicalDamage = Math.round(pokemon.atk * pokemon.critDamage)
        }
      }

      if (pokemon.effects.includes(Effect.PHANTOM_FORCE) && physicalDamage > 0) {
        trueDamage = 0.2 * physicalDamage
        physicalDamage = 0.8 * physicalDamage
        const { takenDamage } = target.handleDamage({
          damage: trueDamage,
          board,
          attackType: AttackType.TRUE,
          attacker: pokemon,
          shouldTargetGainMana: true
        })
        totalTakenDamage += takenDamage
      }

      if (pokemon.effects.includes(Effect.CURSE) && physicalDamage > 0) {
        trueDamage = 0.4 * physicalDamage
        physicalDamage = 0.6 * physicalDamage
        const { takenDamage } = target.handleDamage({
          damage: trueDamage,
          board,
          attackType: AttackType.TRUE,
          attacker: pokemon,
          shouldTargetGainMana: true
        })
        totalTakenDamage += takenDamage
      }

      if (pokemon.effects.includes(Effect.SHADOW_TAG) && physicalDamage > 0) {
        trueDamage = 0.7 * physicalDamage
        physicalDamage = 0.3 * physicalDamage
        const { takenDamage } = target.handleDamage({
          damage: trueDamage,
          board,
          attackType: AttackType.TRUE,
          attacker: pokemon,
          shouldTargetGainMana: true
        })
        totalTakenDamage += takenDamage
      }

      if (pokemon.effects.includes(Effect.WANDERING_SPIRIT) && physicalDamage > 0) {
        trueDamage = physicalDamage
        physicalDamage = 0
        const { takenDamage } = target.handleDamage({
          damage: trueDamage,
          board,
          attackType: AttackType.TRUE,
          attacker: pokemon,
          shouldTargetGainMana: true
        })
        totalTakenDamage += takenDamage
      }      

      if (physicalDamage > 0) {
        // finally, the direct attack damage is handled here
        const { takenDamage } = target.handleDamage({
          damage: physicalDamage,
          board,
          attackType,
          attacker: pokemon,
          shouldTargetGainMana: true
        })
        totalTakenDamage += takenDamage
      }

      let totalDamage = physicalDamage + trueDamage
      pokemon.onAttack({ target, board, totalDamage })
      if(isAttackSuccessful){
        pokemon.onHit({ target, board, totalTakenDamage })
      }
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
