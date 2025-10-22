import { SynergyEffects } from "../../models/effects"
import { Title } from "../../types"
import { BOARD_HEIGHT, BOARD_WIDTH } from "../../types/Config"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType, Team } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { distanceC } from "../../utils/distance"
import { chance } from "../../utils/random"
import { DelayedCommand } from "../simulation-command"
import {
  OnAbilityCastEffect,
  OnAttackEffect,
  OnDamageDealtEffect,
  OnDamageDealtEffectArgs,
  OnDamageReceivedEffect,
  OnDamageReceivedEffectArgs,
  OnDeathEffect,
  OnKillEffect,
  OnSpawnEffect
} from "./effect"

export class MonsterKillEffect extends OnKillEffect {
  hpBoosted: number = 0
  count: number = 0
  synergyLevel: number
  constructor(effect: EffectEnum) {
    super(undefined, effect)
    this.synergyLevel = SynergyEffects[Synergy.MONSTER].indexOf(effect)
  }

  apply({ attacker, target }) {
    const attackBoost = [3, 6, 10, 10][this.synergyLevel] ?? 10
    const apBoost = [10, 20, 30, 30][this.synergyLevel] ?? 30
    const hpGain = [0.2, 0.4, 0.6, 0.6][this.synergyLevel] ?? 0.6
    const lifeBoost = hpGain * target.hp
    attacker.addAttack(attackBoost, attacker, 0, false)
    attacker.addAbilityPower(apBoost, attacker, 0, false)
    attacker.addMaxHP(lifeBoost, attacker, 0, false)
    this.hpBoosted += lifeBoost
    this.count += 1
    if (attacker.items.has(Item.BERSERK_GENE)) {
      attacker.status.triggerConfusion(3000, attacker, attacker)
    }
  }
}

export class GroundHoleEffect extends OnSpawnEffect {
  constructor(effect: EffectEnum) {
    const synergyLevel = SynergyEffects[Synergy.GROUND].indexOf(effect) + 1
    super((pokemon, player) => {
      const y =
        player?.team === Team.RED_TEAM
          ? BOARD_HEIGHT - 1 - pokemon.positionY
          : pokemon.positionY
      const index = y * BOARD_WIDTH + pokemon.positionX
      const holeLevel = player?.groundHoles[index] ?? 0
      let defBuff = holeLevel * [0, 1, 2, 3, 3][synergyLevel]
      let atkBuff = holeLevel === 5 ? [0, 3, 5, 8, 8][synergyLevel] : 0
      if (synergyLevel === 4) {
        const nbFullyDugRows = [0, 8, 16].reduce((count, startIdx) => {
          const row = player?.groundHoles.slice(startIdx, startIdx + 8) ?? []
          return count + (row.every((hole) => hole === 5) ? 1 : 0)
        }, 0)
        defBuff += nbFullyDugRows * 5
        if (nbFullyDugRows === 3) {
          atkBuff += 8
          player?.titles.add(Title.MOLE)
        }
      }

      pokemon.addAttack(atkBuff, pokemon, 0, false)
      pokemon.addDefense(defBuff, pokemon, 0, false)
      pokemon.addSpecialDefense(defBuff, pokemon, 0, false)
      pokemon.broadcastAbility({ skill: "GROUND_GROW" })
    })
  }
}

export class FireHitEffect extends OnAttackEffect {
  count: number = 0
  synergyLevel: number
  constructor(effect: EffectEnum) {
    super(undefined, effect)
    this.synergyLevel = SynergyEffects[Synergy.FIRE].indexOf(effect)
  }

  apply({ pokemon }) {
    pokemon.addAttack(this.synergyLevel, pokemon, 0, false)
    this.count += 1
  }
}

export const electricTripleAttackEffect = new OnAttackEffect(
  ({ pokemon, target, board, isTripleAttack }) => {
    if (isTripleAttack) return // ignore the effect of the 2nd and 3d attacks of triple attacks
    let shouldTriggerTripleAttack = false,
      isPowerSurge = false
    if (pokemon.effects.has(EffectEnum.RISING_VOLTAGE)) {
      shouldTriggerTripleAttack = pokemon.count.attackCount % 4 === 0
    } else if (pokemon.effects.has(EffectEnum.OVERDRIVE)) {
      shouldTriggerTripleAttack = pokemon.count.attackCount % 3 === 0
    } else if (pokemon.effects.has(EffectEnum.POWER_SURGE)) {
      shouldTriggerTripleAttack = pokemon.count.attackCount % 3 === 0
      isPowerSurge = true
    }
    if (shouldTriggerTripleAttack) {
      pokemon.count.tripleAttackCount++

      if (pokemon.name === Pkm.MORPEKO && target) {
        target.status.triggerParalysis(2000, target, pokemon)
      }

      if (pokemon.name === Pkm.MORPEKO_HANGRY && target) {
        target.status.triggerWound(4000, target, pokemon)
      }

      pokemon.state.attack(pokemon, board, target, true)
      pokemon.state.attack(pokemon, board, target, true)
      if (isPowerSurge && target) {
        board
          .getAdjacentCells(target.positionX, target.positionY, true)
          .forEach((cell) => {
            if (cell) {
              const enemy = board.getEntityOnCell(cell.x, cell.y)
              if (enemy && pokemon.team !== enemy.team) {
                enemy.handleSpecialDamage(
                  10,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  false,
                  false
                )
                if (enemy !== target) {
                  pokemon.broadcastAbility({
                    skill: "LINK_CABLE_link",
                    targetX: enemy.positionX,
                    targetY: enemy.positionY
                  })
                }
              }
            }
          })
      }
    }
  }
)

export class SoundCryEffect extends OnAbilityCastEffect {
  count: number = 0
  synergyLevel: number = -1
  constructor(effect?: EffectEnum) {
    super(undefined, effect)
    if (effect) {
      this.synergyLevel = SynergyEffects[Synergy.SOUND].indexOf(effect)
    }
  }

  apply(pokemon, board, target, crit) {
    pokemon.broadcastAbility({ skill: Ability.ECHO })
    const attackBoost = [2, 1, 1][this.synergyLevel] ?? 0
    const speedBoost = [0, 5, 5][this.synergyLevel] ?? 0
    const manaBoost = [0, 0, 3][this.synergyLevel] ?? 0

    const chimecho = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .some((cell) => cell.value?.passive === Passive.CHIMECHO)

    const scale =
      (chimecho ? 2 : 1) * (pokemon.passive === Passive.MEGA_LAUNCHER ? 3 : 1)

    board.cells.forEach((ally) => {
      if (ally?.team === pokemon.team) {
        ally.status.sleepCooldown = 0
        ally.addAttack(attackBoost * scale, pokemon, 0, false)
        ally.addSpeed(speedBoost * scale, pokemon, 0, false)
        ally.addPP(manaBoost * scale, pokemon, 0, false)
        ally.count.soundCryCount += scale
      }
    })
  }
}

export const humanHealEffect = new OnDamageDealtEffect(
  ({ pokemon, damage, isRetaliation }: OnDamageDealtEffectArgs) => {
    if (isRetaliation) return // don't lifesteal on retaliation dammage from items
    let lifesteal = 0
    if (pokemon.effects.has(EffectEnum.MEDITATE)) {
      lifesteal = 0.25
    } else if (pokemon.effects.has(EffectEnum.FOCUS_ENERGY)) {
      lifesteal = 0.4
    } else if (pokemon.effects.has(EffectEnum.CALM_MIND)) {
      lifesteal = 0.6
    }
    pokemon.handleHeal(Math.ceil(lifesteal * damage), pokemon, 0, false)
  },
  EffectEnum.MEDITATE
)

export class OnFieldDeathEffect extends OnDeathEffect {
  constructor(effect: EffectEnum) {
    super(({ pokemon, board }) => {
      let heal = 0
      let speedBoost = 0
      if (effect === EffectEnum.BULK_UP) {
        heal = 30
        speedBoost = 15
      } else if (effect === EffectEnum.RAGE) {
        heal = 35
        speedBoost = 20
      } else if (effect === EffectEnum.ANGER_POINT) {
        heal = 40
        speedBoost = 25
      }
      pokemon.simulation.room.clock.setTimeout(() => {
        board.forEach((x, y, value) => {
          if (
            value &&
            value.team === pokemon.team &&
            value.types.has(Synergy.FIELD)
          ) {
            value.count.fieldCount++
            value.handleHeal(heal, pokemon, 0, false)
            value.addSpeed(speedBoost, value, 0, false)
          }
        })
      }, 16) // delay to next tick, targeting 60 ticks per second
    }, effect)
  }
}

export class FlyingProtectionEffect extends OnDamageReceivedEffect {
  priority = -1
  flyingProtection: number = 0
  constructor(effect: EffectEnum) {
    super(undefined, effect)
    if (effect === EffectEnum.FEATHER_DANCE || effect === EffectEnum.TAILWIND) {
      this.flyingProtection = 1
    } else if (
      effect === EffectEnum.MAX_AIRSTREAM ||
      effect === EffectEnum.SKYDIVE
    ) {
      this.flyingProtection = 2
    }
  }
  apply({ pokemon, board }: OnDamageReceivedEffectArgs) {
    // Flying protection
    if (
      this.flyingProtection > 0 &&
      pokemon.hp > 0 &&
      pokemon.canMove &&
      !pokemon.status.paralysis
    ) {
      const pcHp = pokemon.hp / pokemon.maxHP

      if (pokemon.effects.has(EffectEnum.TAILWIND) && pcHp < 0.2) {
        pokemon.flyAway(board)
        this.flyingProtection--
      } else if (pokemon.effects.has(EffectEnum.FEATHER_DANCE) && pcHp < 0.2) {
        pokemon.status.triggerProtect(2000)
        pokemon.flyAway(board)
        this.flyingProtection--
      } else if (pokemon.effects.has(EffectEnum.MAX_AIRSTREAM)) {
        if (
          (this.flyingProtection === 2 && pcHp < 0.5) ||
          (this.flyingProtection === 1 && pcHp < 0.2)
        ) {
          pokemon.status.triggerProtect(2000)
          pokemon.flyAway(board)
          this.flyingProtection--
        }
      } else if (pokemon.effects.has(EffectEnum.SKYDIVE)) {
        if (
          (this.flyingProtection === 2 && pcHp < 0.5) ||
          (this.flyingProtection === 1 && pcHp < 0.2)
        ) {
          const destination =
            board.getFarthestTargetCoordinateAvailablePlace(pokemon)
          if (destination) {
            pokemon.status.triggerProtect(2000)
            pokemon.broadcastAbility({
              skill: "FLYING_TAKEOFF",
              targetX: destination.target.positionX,
              targetY: destination.target.positionY
            })
            pokemon.skydiveTo(destination.x, destination.y, board)
            pokemon.setTarget(destination.target)
            this.flyingProtection--
            pokemon.commands.push(
              new DelayedCommand(() => {
                pokemon.broadcastAbility({
                  skill: "FLYING_SKYDIVE",
                  positionX: destination.x,
                  positionY: destination.y,
                  targetX: destination.target.positionX,
                  targetY: destination.target.positionY
                })
              }, 500)
            )
            pokemon.commands.push(
              new DelayedCommand(() => {
                if (destination.target?.maxHP > 0) {
                  destination.target.handleSpecialDamage(
                    1.5 * pokemon.atk,
                    board,
                    AttackType.PHYSICAL,
                    pokemon,
                    chance(pokemon.critChance / 100, pokemon),
                    false
                  )
                }
              }, 1000)
            )
          }
        }
      }
    }
  }
}

export class FightingKnockbackEffect extends OnDamageReceivedEffect {
  constructor(effect: EffectEnum) {
    super(undefined, effect)
  }
  apply({ pokemon, board, isRetaliation }: OnDamageReceivedEffectArgs) {
    // Fighting knockback
    if (
      pokemon.count.fightingBlockCount > 0 &&
      pokemon.count.fightingBlockCount %
        (this.origin === EffectEnum.JUSTIFIED ? 8 : 10) ===
        0 &&
      !isRetaliation &&
      distanceC(
        pokemon.positionX,
        pokemon.positionY,
        pokemon.targetX,
        pokemon.targetY
      ) === 1
    ) {
      const targetAtContact = board.getEntityOnCell(
        pokemon.targetX,
        pokemon.targetY
      )
      const destination = pokemon.state.getNearestAvailablePlaceCoordinates(
        pokemon,
        board,
        4
      )
      if (destination && targetAtContact) {
        targetAtContact.shield = 0
        targetAtContact.handleDamage({
          damage: pokemon.atk,
          board,
          attackType: AttackType.PHYSICAL,
          attacker: pokemon,
          shouldTargetGainMana: true,
          isRetaliation: true
        })
        targetAtContact.moveTo(destination.x, destination.y, board)
      }
    }
  }
}
