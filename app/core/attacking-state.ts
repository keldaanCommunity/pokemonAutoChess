import { Item } from "../types/enum/Item"
import { AttackType } from "../types/enum/Game"
import { Effect } from "../types/enum/Effect"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { PokemonActionState } from "../types/enum/Game"
import { chance } from "../utils/random"
import { distanceC } from "../utils/distance"
import { Synergy } from "../types/enum/Synergy"
import { max, min } from "../utils/number"

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
          distanceC(
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
      } else if (pokemon.status.charm) {
        pokemon.toMovingState()
      } else if (
        distanceC(
          pokemon.positionX,
          pokemon.positionY,
          targetCoordinate.x,
          targetCoordinate.y
        ) > pokemon.range
      ) {
        pokemon.toMovingState()
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
        pokemon.strategy.process(pokemon, this, board, target, crit)
      } else {
        // BASIC ATTACK
        pokemon.count.attackCount++
        this.attack(pokemon, board, targetCoordinate)
        if (
          pokemon.effects.has(Effect.RISING_VOLTAGE) ||
          pokemon.effects.has(Effect.OVERDRIVE)
        ) {
          let isTripleAttack = false
          if (pokemon.effects.has(Effect.RISING_VOLTAGE)) {
            isTripleAttack = pokemon.count.attackCount % 4 === 0
          } else if (pokemon.effects.has(Effect.OVERDRIVE)) {
            isTripleAttack = pokemon.count.attackCount % 3 === 0
          }
          if (isTripleAttack) {
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
    pokemon.targetX = coordinates.x
    pokemon.targetY = coordinates.y

    const target = board.getValue(coordinates.x, coordinates.y)
    if (target) {
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

      if(pokemon.attackType === AttackType.SPECIAL){
        physicalDamage = Math.ceil(physicalDamage * (1 + pokemon.ap / 100))
      }

      if (pokemon.items.has(Item.FIRE_GEM)) {
        physicalDamage = Math.round(physicalDamage + target.hp * 0.08)
      }

      let isAttackSuccessful = true
      let dodgeChance = target.dodge
      if (pokemon.effects.has(Effect.GAS)) {
        dodgeChance += 0.5
      }
      dodgeChance = max(0.9)(dodgeChance)

      if (
        chance(dodgeChance) &&
        !pokemon.items.has(Item.XRAY_VISION) &&
        !target.status.paralysis &&
        !target.status.sleep &&
        !target.status.freeze
      ) {
        isAttackSuccessful = false
        physicalDamage = 0
        target.count.dodgeCount += 1
      }
      if (target.status.protect) {
        isAttackSuccessful = false
        physicalDamage = 0
      }

      if (Math.random() * 100 < pokemon.critChance) {
        pokemon.onCritical(target, board)
        if (target.items.has(Item.ROCKY_HELMET) === false) {
          let opponentCritDamage = pokemon.critDamage
          if (target.effects.has(Effect.BATTLE_ARMOR)) {
            opponentCritDamage -= 0.3
          } else if (target.effects.has(Effect.MOUTAIN_RESISTANCE)) {
            opponentCritDamage -= 0.5
          } else if (target.effects.has(Effect.DIAMOND_STORM)) {
            opponentCritDamage -= 0.7
          }
          physicalDamage = Math.round(pokemon.atk * opponentCritDamage)
        }
      }

      let trueDamagePart = 0
      if (pokemon.hasSynergyEffect(Synergy.GHOST)) {
        if (pokemon.effects.has(Effect.PHANTOM_FORCE)) {
          trueDamagePart += 0.2
        } else if (pokemon.effects.has(Effect.CURSE)) {
          trueDamagePart += 0.4
        } else if (pokemon.effects.has(Effect.SHADOW_TAG)) {
          trueDamagePart += 0.7
        } else if (pokemon.effects.has(Effect.WANDERING_SPIRIT)) {
          trueDamagePart += 1.0
        }
      }
      if (pokemon.items.has(Item.RED_ORB) && target) {
        trueDamagePart += 0.25
      }

      if (trueDamagePart > 0) {
        // Apply true damage part
        trueDamage = Math.ceil(physicalDamage * trueDamagePart)
        physicalDamage = min(0)(physicalDamage * (1 - trueDamagePart))

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
        // Apply attack physical damage
        const { takenDamage } = target.handleDamage({
          damage: physicalDamage,
          board,
          attackType,
          attacker: pokemon,
          shouldTargetGainMana: true
        })
        totalTakenDamage += takenDamage
      }

      const totalDamage = physicalDamage + trueDamage
      pokemon.onAttack({
        target,
        board,
        physicalDamage,
        trueDamage,
        totalDamage
      })
      if (isAttackSuccessful) {
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
