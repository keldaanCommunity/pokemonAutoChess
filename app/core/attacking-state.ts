import { Item } from "../types/enum/Item"
import { AttackType } from "../types/enum/Game"
import { Effect } from "../types/enum/Effect"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { PokemonActionState } from "../types/enum/Game"
import { chance } from "../utils/random"

export default class AttackingState extends PokemonState {
  update(
    pokemon: PokemonEntity,
    dt: number,
    board: Board,
    climate: string
  ) {
    super.update(pokemon, dt, board, climate)

    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = pokemon.getAttackDelay()
      let target = board.getValue(pokemon.targetX, pokemon.targetY)
      let targetCoordinate: { x: number; y: number } | undefined = {
        x: pokemon.targetX,
        y: pokemon.targetY
      }

      if(pokemon.status.confusion){
        targetCoordinate = this.getTargetCoordinateWhenConfused(pokemon, board)
      } else if (
        !(
          target &&
          target.team !== pokemon.team &&
          board.distance(
            pokemon.positionX,
            pokemon.positionY,
            targetCoordinate.x,
            targetCoordinate.y
          ) <= pokemon.range
        )
      ) {
        targetCoordinate = this.getNearestTargetCoordinate(pokemon, board)
        if(targetCoordinate){
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
      } else if (target && pokemon.mana >= pokemon.maxMana && !pokemon.status.silence) {
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
          let doubleAttackChance = 0
          if (pokemon.effects.includes(Effect.EERIE_IMPULSE)) {
            doubleAttackChance = 0.3
          } else if (pokemon.effects.includes(Effect.RISING_VOLTAGE)) {
            doubleAttackChance = 0.5
          } else if (pokemon.effects.includes(Effect.OVERDRIVE)) {
            doubleAttackChance = 0.7
          }
          if (Math.random() < doubleAttackChance) {
            pokemon.count.doubleAttackCount++
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
      if (pokemon.items.has(Item.SHINY_CHARM) && Math.random() < 0.25) {
        pokemon.status.triggerProtect(1000)
      }

      if (pokemon.items.has(Item.UPGRADE)) {
        pokemon.handleAttackSpeed(5)
        pokemon.count.upgradeCount++;
      }

      let freezeChance = 0
      if (pokemon.effects.includes(Effect.SNOW)) {
        freezeChance += 0.1
      }
      if (pokemon.effects.includes(Effect.SHEER_COLD)) {
        freezeChance += 0.3
      }
      if (Math.random() > 1 - freezeChance) {
        target.status.triggerFreeze(2000, target)
      }

      let poisonChance = 0
      if (pokemon.effects.includes(Effect.POISON_GAS)) {
        poisonChance = 0.3
      }
      if (pokemon.effects.includes(Effect.TOXIC)) {
        poisonChance = 0.7
      }
      if (poisonChance > 0) {
        if (Math.random() < poisonChance) {
          target.status.triggerPoison(4000, target, pokemon, board)
        }
      }
      if (
        (pokemon.effects.includes(Effect.CURSE) ||
          pokemon.effects.includes(Effect.PHANTOM_FORCE) ||
          pokemon.effects.includes(Effect.SHADOW_TAG) ||
          pokemon.effects.includes(Effect.WANDERING_SPIRIT)) &&
        Math.random() > 0.5
      ) {
        target.status.triggerSilence(3000, target, board)
      }
      if (
        pokemon.effects.includes(Effect.SWIFT_SWIM) ||
        pokemon.effects.includes(Effect.HYDRATION) ||
        pokemon.effects.includes(Effect.WATER_VEIL)
      ) {
        const chance = pokemon.effects.includes(Effect.SWIFT_SWIM)
          ? 0.35
          : pokemon.effects.includes(Effect.HYDRATION)
          ? 0.45
          : 0.55
        const manaGain = pokemon.effects.includes(Effect.SWIFT_SWIM)
          ? 15
          : pokemon.effects.includes(Effect.HYDRATION)
          ? 30
          : 45
        if (Math.random() > 1 - chance) {
          target.setMana(target.mana - 20)
          target.count.manaBurnCount++
          pokemon.setMana(pokemon.mana + manaGain)
        }
      }
      if(pokemon.effects.includes(Effect.TELEPORT_NEXT_ATTACK)){
        const crit = chance(pokemon.critChance)
        if(crit){
          pokemon.onCritical(target, board)
        }
        target.handleSpecialDamage([15,30,60][pokemon.stars-1], board, AttackType.SPECIAL, pokemon, crit)
        pokemon.effects.splice(pokemon.effects.indexOf(Effect.TELEPORT_NEXT_ATTACK), 1)
      }

      pokemon.orientation = board.orientation(
        pokemon.positionX,
        pokemon.positionY,
        target.positionX,
        target.positionY,
        pokemon,
        target
      )

      let damage
      const attackType = pokemon.attackType

      if (
        Math.random() * 100 < pokemon.critChance &&
        target
      ) {
        pokemon.onCritical(target, board)
        if(target.items.has(Item.ROCKY_HELMET) === false){
          damage = Math.round(pokemon.atk * pokemon.critDamage)
        }
      } else {
        damage = pokemon.atk
      }

      if (pokemon.effects.includes(Effect.PHANTOM_FORCE)) {
        const trueDamage = 0.2 * damage
        damage = 0.8 * damage
        target.handleDamage({
          damage: trueDamage, 
          board, 
          attackType: AttackType.TRUE,
          attacker: pokemon,
          dodgeable: true,
          shouldAttackerGainMana: false,
          shouldTargetGainMana: true
        })
      }

      if (pokemon.effects.includes(Effect.CURSE)) {
        const trueDamage = 0.4 * damage
        damage = 0.6 * damage
        target.handleDamage({
          damage: trueDamage, 
          board, 
          attackType: AttackType.TRUE,
          attacker: pokemon,
          dodgeable: true,
          shouldAttackerGainMana: false,
          shouldTargetGainMana: true
        })
      }

      if (pokemon.effects.includes(Effect.SHADOW_TAG)) {
        const trueDamage = 0.7 * damage
        damage = 0.3 * damage
        target.handleDamage({
          damage: trueDamage, 
          board, 
          attackType: AttackType.TRUE,
          attacker: pokemon,
          dodgeable: true,
          shouldAttackerGainMana: false,
          shouldTargetGainMana: true
        })
      }

      if (pokemon.effects.includes(Effect.WANDERING_SPIRIT)) {
        const trueDamage = damage
        damage = 0
        target.handleDamage({
          damage: trueDamage, 
          board, 
          attackType: AttackType.TRUE,
          attacker: pokemon,
          dodgeable: true,
          shouldAttackerGainMana: false,
          shouldTargetGainMana: true
        })
      }

      if (target.status.spikeArmor && pokemon.range === 1) {
        pokemon.status.triggerWound(2000, pokemon, board)
        pokemon.handleDamage({
          damage: target.def,
          board,
          attackType: AttackType.SPECIAL,
          attacker: target,
          dodgeable: false,
          shouldAttackerGainMana: false,
          shouldTargetGainMana: true
        })
      }

      if (damage > 0) {
        // finally, the direct attack damage is handled here
        target.handleDamage({
          damage,
          board,
          attackType,
          attacker: pokemon,
          dodgeable: true,
          shouldAttackerGainMana: true,
          shouldTargetGainMana: true
        })
      }

      if (pokemon.items.has(Item.BLUE_ORB)) {
        pokemon.count.staticHolderCount++
        if (pokemon.count.staticHolderCount > 2) {
          pokemon.count.staticHolderCount = 0
          // eslint-disable-next-line no-unused-vars
          let c = 2
          board.forEach((x, y, tg) => {
            if (tg && pokemon.team != tg.team && c > 0) {
              tg.count.staticCount++
              tg.setMana(tg.mana - 20)
              tg.count.manaBurnCount++
              c--
            }
          })
        }
      }

      if (pokemon.items.has(Item.RED_ORB)) {
        if (target) {
          target.handleDamage({
            damage: Math.ceil(pokemon.atk * 0.2),
            board,
            attackType: AttackType.TRUE,
            attacker: pokemon,
            dodgeable: true,
            shouldAttackerGainMana: false,
            shouldTargetGainMana: true
          })
        }
      }
      if (target && target.items.has(Item.SMOKE_BALL)) {
        pokemon.status.triggerParalysis(5000, pokemon)
      }

      if (pokemon.items.has(Item.CHOICE_SCARF)) {
        const cells = board.getAdjacentCells(target.positionX, target.positionY)
        let targetCount = 1
        cells.forEach((cell) => {
          if (
            cell.value &&
            pokemon.team != cell.value.team &&
            targetCount > 0
          ) {
            cell.value.handleDamage({
              damage: Math.ceil(0.5 * damage),
              board,
              attackType,
              attacker: pokemon,
              dodgeable: true,
              shouldAttackerGainMana: false,
              shouldTargetGainMana: true
            })
            targetCount--
          }
        })
      }

      if (pokemon.items.has(Item.LEFTOVERS)) {
        pokemon.handleHeal(pokemon.hp * 0.05, pokemon, 0)
        ;[-1, 0, 1].forEach((offset) => {
          const value = board.getValue(
            pokemon.positionX + offset,
            pokemon.positionY
          )
          if (value && value.team === pokemon.team) {
            value.handleHeal(value.hp * 0.05, pokemon, 0)
          }
        })
      }

      if (pokemon.items.has(Item.MANA_SCARF)) {
        pokemon.setMana(pokemon.mana + 8)
      }
      if (pokemon.status.deltaOrb) {
        pokemon.setMana(pokemon.mana + 3)
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