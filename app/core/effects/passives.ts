import { EffectEnum } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import Board from "../board"
import { Effect, OnAttackEffect } from "./effect"
import { ItemEffects } from "./items"
import { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategies, broadcastAbility } from "../abilities/abilities"
import { Passive } from "../../types/enum/Passive"
import { Synergy } from "../../types/enum/Synergy"
import { Transfer } from "../../types"
import { Ability } from "../../types/enum/Ability"
import { Pkm } from "../../types/enum/Pokemon"
import { chance } from "../../utils/random"
import { values } from "../../utils/schemas"

export function drumBeat(pokemon: PokemonEntity, board: Board) {
  if (pokemon.pp >= pokemon.maxPP && !pokemon.status.silence) {
    // CAST ABILITY
    let crit = false
    if (pokemon.effects.has(EffectEnum.ABILITY_CRIT)) {
      crit = chance(pokemon.critChance / 100, pokemon)
    }
    const target = pokemon.state.getNearestTargetAtSight(pokemon, board)?.target
    if (target) {
      AbilityStrategies[pokemon.skill].process(pokemon, board, target, crit)
    }
    return
  }

  pokemon.count.attackCount++
  pokemon.targetY = -1
  const ppGained = 1 + pokemon.stars
  board
    .getAdjacentCells(pokemon.positionX, pokemon.positionY, true)
    .forEach((cell) => {
      if (cell.value && cell.value.team === pokemon.team) {
        cell.value.addPP(ppGained, pokemon, 0, false)
      }
    })
  pokemon.effectsSet.forEach((effect) => {
    if (effect instanceof OnAttackEffect) {
      effect.apply({
        pokemon,
        target: null,
        board,
        physicalDamage: 0,
        specialDamage: 0,
        trueDamage: 0,
        totalDamage: 0
      })
    }
  })
  const itemEffects: OnAttackEffect[] = values(pokemon.items)
    .flatMap((item) => ItemEffects[item] ?? [])
    .filter((effect) => effect instanceof OnAttackEffect)
  itemEffects.forEach((effect) => {
    effect.apply({
      pokemon,
      target: null,
      board,
      physicalDamage: 0,
      specialDamage: 0,
      trueDamage: 0,
      totalDamage: 0
    })
  })
}

export function stenchJump(
  pokemon: PokemonEntity,
  board: Board,
  x: number,
  y: number
) {
  board
    .getCellsBetween(x, y, pokemon.positionX, pokemon.positionY)
    .forEach((cell) => {
      if (cell.x !== x || cell.y !== y) {
        board.addBoardEffect(
          cell.x,
          cell.y,
          EffectEnum.POISON_GAS,
          pokemon.simulation
        )
      }
    })
}

export function partingShot(
  pokemon: PokemonEntity,
  target: PokemonEntity,
  x: number,
  y: number
) {
  target.addAbilityPower(-20, pokemon, 0, false)
  target.addAttack(-0.2 * target.baseAtk, pokemon, 0, false)
  broadcastAbility(pokemon, {
    skill: "PARTING_SHOT",
    positionX: x,
    positionY: y
  })
}

const sharedVision = new OnAttackEffect(({ pokemon, board }) => {
  board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
    if (
      ally &&
      ally.passive === Passive.SHARED_VISION &&
      pokemon.team === ally.team &&
      !(
        pokemon.targetX === ally.positionX && pokemon.targetY === ally.positionY
      ) // do not self inflict damage if ally is confused and targeting you
    ) {
      ally.targetX = pokemon.targetX
      ally.targetY = pokemon.targetY
    }
  })
})

const durantBugBuff = new OnAttackEffect(({ pokemon, target, board }) => {
  if (target) {
    const bugAllies =
      board.cells.filter(
        (entity) =>
          entity &&
          entity.team === pokemon.team &&
          entity.types.has(Synergy.BUG)
      ).length - 1
    if (bugAllies > 0) {
      target.handleDamage({
        damage: bugAllies,
        board,
        attackType: AttackType.TRUE,
        attacker: pokemon,
        shouldTargetGainMana: true
      })
    }
  }
})

const miniorKernelOnAttackEffect = new OnAttackEffect(
  ({ pokemon, target, board, physicalDamage }) => {
    if (
      target &&
      (pokemon.name === Pkm.MINIOR_KERNEL_BLUE ||
        pokemon.name === Pkm.MINIOR_KERNEL_GREEN ||
        pokemon.name === Pkm.MINIOR_KERNEL_RED ||
        pokemon.name === Pkm.MINIOR_KERNEL_ORANGE)
    ) {
      const cells = board.getAdjacentCells(target.positionX, target.positionY)
      const targets = cells
        .filter((cell) => cell.value && pokemon.team != cell.value.team)
        .map((cell) => cell.value!)
        .concat(target)
      targets.forEach((t) => {
        pokemon.simulation.room.broadcast(Transfer.ABILITY, {
          id: pokemon.simulation.id,
          skill: Ability.SHIELDS_DOWN,
          targetX: t.positionX,
          targetY: t.positionY
        })
        if (pokemon.name === Pkm.MINIOR_KERNEL_BLUE) {
          t.handleDamage({
            damage: Math.ceil(physicalDamage * (1 + pokemon.ap / 100)),
            board,
            attackType: AttackType.SPECIAL,
            attacker: pokemon,
            shouldTargetGainMana: false
          })
        }
        if (pokemon.name === Pkm.MINIOR_KERNEL_RED) {
          t.handleDamage({
            damage: Math.ceil(physicalDamage * 1.5 * (1 + pokemon.ap / 100)),
            board,
            attackType: AttackType.PHYSICAL,
            attacker: pokemon,
            shouldTargetGainMana: false
          })
        }
        if (pokemon.name === Pkm.MINIOR_KERNEL_ORANGE) {
          t.handleDamage({
            damage: Math.ceil(physicalDamage * 0.5 * (1 + pokemon.ap / 100)),
            board,
            attackType: AttackType.TRUE,
            attacker: pokemon,
            shouldTargetGainMana: false
          })
        }
      })
      if (pokemon.name === Pkm.MINIOR_KERNEL_GREEN) {
        cells.forEach((v) => {
          if (v && v.value && v.value.team === pokemon.team) {
            v.value.handleHeal(physicalDamage, pokemon, 1, false)
          }
        })
      }
    }
  }
)

export const PassiveEffects: Partial<Record<Passive, Effect[]>> = {
  [Passive.DURANT]: [durantBugBuff],
  [Passive.SHARED_VISION]: [sharedVision],
  [Passive.METEOR]: [miniorKernelOnAttackEffect]
}
