import { Item } from "../types/enum/Item"
import { AttackType } from "../types/enum/Game"
import { Effect } from "../types/enum/Effect"
import Board from "./board"
import PokemonEntity from "./pokemon-entity"
import PokemonState from "./pokemon-state"
import { PokemonActionState } from "../types/enum/Game"
import { Ability } from "../types/enum/Ability"

export default class AttackingState extends PokemonState {
  update(
    pokemon: PokemonEntity,
    dt: number,
    board: Board,
    climate: string
  ): boolean {
    super.update(pokemon, dt, board, climate)

    if (pokemon.cooldown <= 0) {
      pokemon.cooldown = pokemon.getAttackDelay()
      const target = board.getValue(pokemon.targetX, pokemon.targetY)
      let targetCoordinate: { x: number; y: number } | undefined = {
        x: pokemon.targetX,
        y: pokemon.targetY
      }

      if (
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
      } else {
        this.attack(pokemon, board, targetCoordinate, climate)
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
            this.attack(pokemon, board, targetCoordinate, climate)
            this.attack(pokemon, board, targetCoordinate, climate)
          }
        }
      }
    } else {
      pokemon.cooldown = Math.max(0, pokemon.cooldown - dt)
    }
    return false
  }

  attack(
    pokemon: PokemonEntity,
    board: Board,
    coordinates: { x: number; y: number },
    climate: string
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
        poisonChance += 0.3
      }
      if (pokemon.effects.includes(Effect.TOXIC)) {
        poisonChance += 0.4
      }
      if (poisonChance != 0) {
        if (Math.random() > 1 - poisonChance) {
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
        pokemon.effects.includes(Effect.DUBIOUS_DISC) ||
        pokemon.effects.includes(Effect.LINK_CABLE) ||
        pokemon.effects.includes(Effect.GOOGLE_SPECS)
      ) {
        const chance = pokemon.effects.includes(Effect.DUBIOUS_DISC)
          ? 0.35
          : pokemon.effects.includes(Effect.LINK_CABLE)
          ? 0.45
          : 0.55
        const manaGain = pokemon.effects.includes(Effect.DUBIOUS_DISC)
          ? 15
          : pokemon.effects.includes(Effect.LINK_CABLE)
          ? 30
          : 45
        if (Math.random() > 1 - chance) {
          target.setMana(target.mana - 20)
          target.count.manaBurnCount++
          pokemon.setMana(pokemon.mana + manaGain)
        }
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
        target &&
        !target.items.has(Item.ROCKY_HELMET)
      ) {
        if (
          pokemon.effects.includes(Effect.FAIRY_WIND) ||
          pokemon.effects.includes(Effect.STRANGE_STEAM) ||
          pokemon.effects.includes(Effect.AROMATIC_MIST)
        ) {
          let d = 0
          if (pokemon.effects.includes(Effect.AROMATIC_MIST)) {
            d = 10
          } else if (pokemon.effects.includes(Effect.FAIRY_WIND)) {
            d = 25
          } else if (pokemon.effects.includes(Effect.STRANGE_STEAM)) {
            d = 50
          }
          const cells = board.getAdjacentCells(
            pokemon.positionX,
            pokemon.positionY
          )

          cells.forEach((cell) => {
            if (cell.value && pokemon.team != cell.value.team) {
              cell.value.count.fairyCritCount++
              cell.value.handleDamage(
                d,
                board,
                AttackType.SPECIAL,
                pokemon,
                false
              )
            }
          })
        }
        if (
          target.effects.includes(Effect.FAIRY_WIND) ||
          target.effects.includes(Effect.STRANGE_STEAM) ||
          target.effects.includes(Effect.AROMATIC_MIST)
        ) {
          let d = 0
          if (target.effects.includes(Effect.AROMATIC_MIST)) {
            d = 10
          } else if (target.effects.includes(Effect.FAIRY_WIND)) {
            d = 25
          } else if (target.effects.includes(Effect.STRANGE_STEAM)) {
            d = 50
          }
          const cells = board.getAdjacentCells(
            target.positionX,
            target.positionY
          )

          cells.forEach((cell) => {
            if (cell.value && target.team != cell.value.team) {
              cell.value.count.fairyCritCount++
              cell.value.handleDamage(
                d,
                board,
                AttackType.SPECIAL,
                target,
                false
              )
            }
          })
        }
        damage = Math.round(pokemon.atk * pokemon.critDamage)
        target.count.crit++
      } else {
        damage = pokemon.atk
      }

      if (pokemon.effects.includes(Effect.PHANTOM_FORCE)) {
        const trueDamage = 0.2 * damage
        damage = 0.8 * damage
        target.handleDamage(
          trueDamage,
          board,
          AttackType.TRUE,
          pokemon,
          true
        )
      }

      if (pokemon.effects.includes(Effect.CURSE)) {
        const trueDamage = 0.4 * damage
        damage = 0.6 * damage
        target.handleDamage(
          trueDamage,
          board,
          AttackType.TRUE,
          pokemon,
          true
        )
      }

      if (pokemon.effects.includes(Effect.SHADOW_TAG)) {
        const trueDamage = 0.7 * damage
        damage = 0.3 * damage
        target.handleDamage(
          trueDamage,
          board,
          AttackType.TRUE,
          pokemon,
          true
        )
      }

      if (pokemon.effects.includes(Effect.WANDERING_SPIRIT)) {
        const trueDamage = damage
        damage = 0
        target.handleDamage(
          trueDamage,
          board,
          AttackType.TRUE,
          pokemon,
          true
        )
      }

      if (target.status.spikeArmor && pokemon.range === 1) {
        pokemon.status.triggerWound(2000, pokemon, board)
        pokemon.handleDamage(
          target.def,
          board,
          AttackType.SPECIAL,
          target,
          false
        )
      }

      if (damage > 0) {
        target.handleDamage(damage, board, attackType, pokemon, true)
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
          target.handleDamage(
            Math.ceil(pokemon.atk * 0.2),
            board,
            AttackType.TRUE,
            pokemon,
            true
          )
        }
      }
      if (target && target.items.has(Item.SMOKE_BALL)) {
        pokemon.status.triggerSmoke(5000, pokemon)
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
            cell.value.handleDamage(
              Math.ceil(0.5 * damage),
              board,
              attackType,
              pokemon,
              true
            )
            targetCount--
          }
        })
      }

      if (pokemon.items.has(Item.LEFTOVERS)) {
        pokemon.handleHeal(pokemon.hp * 0.05, pokemon)
        ;[-1, 0, 1].forEach((offset) => {
          const value = board.getValue(
            pokemon.positionX + offset,
            pokemon.positionY
          )
          if (value && value.team === pokemon.team) {
            value.handleHeal(value.hp * 0.05, pokemon)
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

module.exports = AttackingState
