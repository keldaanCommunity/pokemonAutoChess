import type { MapSchema } from "@colyseus/schema"
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  FIELD_HEAL_PER_SYNERGY_TIER,
  FIELD_SPEED_BUFF_PER_SYNERGY_TIER,
  MONSTER_AP_BUFF_PER_SYNERGY_TIER,
  MONSTER_ATTACK_BUFF_PER_SYNERGY_TIER,
  MONSTER_MAX_HP_BUFF_FACTOR_PER_SYNERGY_TIER,
  RarityCost
} from "../../config"
import {
  FIRE_ATK_BUFF_PER_SYNERGY_TIER,
  GROUND_ATK_BUFF_PER_SYNERGY_TIER,
  GROUND_DEF_BUFF_PER_SYNERGY_TIER,
  SOUND_ATK_BUFF_PER_SYNERGY_TIER,
  SOUND_PP_GAIN_PER_SYNERGY_TIER,
  SOUND_SPEED_BUFF_PER_SYNERGY_TIER,
  type SynergyTier,
  SynergyTiers
} from "../../config/game/synergies"
import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import PokemonFactory, {
  getPokemonBaseline
} from "../../models/pokemon-factory"
import { type FlowerPot, type IPokemon, Title, Transfer } from "../../types"
import { EvolutionRuleType } from "../../types/EvolutionRules"
import { Ability } from "../../types/enum/Ability"
import { EffectEnum } from "../../types/enum/Effect"
import { AttackType, PokemonActionState, Team } from "../../types/enum/Game"
import {
  Item,
  ItemComponents,
  Scarves,
  SynergyGems,
  SynergyGivenByGem,
  Wands
} from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Pillars, Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"
import { isIn } from "../../utils/array"
import { getFreeSpaceOnBench, isOnBench } from "../../utils/board"
import { distanceC } from "../../utils/distance"
import { max, min } from "../../utils/number"
import { chance, pickNRandomIn } from "../../utils/random"
import { schemaValues } from "../../utils/schemas"
import { type Board, effectInLine } from "../board"
import { EvolutionManager } from "../evolution-logic/evolution-manager"
import { FlowerMonByPot, getFlowerPotsUnlocked } from "../flower-pots"
import type { PokemonEntity } from "../pokemon-entity"
import type Simulation from "../simulation"
import { DelayedCommand } from "../simulation-command"
import { getSynergyTier } from "../synergies"
import { getUnitScore } from "../unit-score"
import {
  type Effect,
  OnAbilityCastEffect,
  OnAttackEffect,
  OnAttackReceivedEffect,
  type OnAttackReceivedEffectArgs,
  OnBenchedDuringFightEffect,
  OnDamageDealtEffect,
  type OnDamageDealtEffectArgs,
  OnDamageReceivedEffect,
  type OnDamageReceivedEffectArgs,
  OnDeathEffect,
  OnGroundDiggingEffect,
  OnKillEffect,
  type OnKillEffectArgs,
  OnSimulationStartEffect,
  OnSpawnEffect,
  OnStageStartEffect
} from "./effect"
import { PassiveEffects } from "./passives"

export class MonsterKillEffect extends OnKillEffect {
  hpBoosted: number = 0
  count: number = 0
  synergyTier: number
  constructor(tier: SynergyTier<Synergy.MONSTER>) {
    super(undefined, tier)
    this.synergyTier = SynergyTiers[Synergy.MONSTER].indexOf(tier) + 1
  }

  apply({ attacker, target }: OnKillEffectArgs) {
    const attackBoost =
      MONSTER_ATTACK_BUFF_PER_SYNERGY_TIER[this.synergyTier] ?? 0
    const apBoost = MONSTER_AP_BUFF_PER_SYNERGY_TIER[this.synergyTier] ?? 0
    const hpGain =
      MONSTER_MAX_HP_BUFF_FACTOR_PER_SYNERGY_TIER[this.synergyTier] ?? 0
    const lifeBoost = hpGain * target.maxHP
    attacker.addAttack(attackBoost, attacker, 0, false)
    attacker.addAbilityPower(apBoost, attacker, 0, false)
    attacker.addMaxHP(lifeBoost, attacker, 0, false)
    this.hpBoosted += lifeBoost
    this.count += 1
    if (attacker.items.has(Item.BERSERK_GENE)) {
      attacker.status.triggerConfusion(1000, attacker, attacker)
    }
  }
}
export class GroundHoleEffect extends OnSpawnEffect {
  constructor(effect: SynergyTier<Synergy.GROUND>) {
    const synergyTier = SynergyTiers[Synergy.GROUND].indexOf(effect) + 1
    super((pokemon, player) => {
      const y =
        player?.team === Team.RED_TEAM
          ? BOARD_HEIGHT - 1 - pokemon.positionY
          : pokemon.positionY
      const index = y * BOARD_WIDTH + pokemon.positionX
      const holeLevel = player?.groundHoles[index] ?? 0
      let defBuff = holeLevel * GROUND_DEF_BUFF_PER_SYNERGY_TIER[synergyTier]
      let atkBuff =
        holeLevel === 5 ? GROUND_ATK_BUFF_PER_SYNERGY_TIER[synergyTier] : 0
      if (synergyTier === 4) {
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
  synergyTier: number
  constructor(effect: SynergyTier<Synergy.FIRE>) {
    super(undefined, effect)
    this.synergyTier = SynergyTiers[Synergy.FIRE].indexOf(effect) + 1
  }

  apply({ pokemon }) {
    const atkBuff = FIRE_ATK_BUFF_PER_SYNERGY_TIER[this.synergyTier]
    if (atkBuff) {
      pokemon.addAttack(atkBuff, pokemon, 0, false)
    }
    this.count += 1
  }
}

export const electricTripleAttackEffect = new OnAttackEffect(
  ({ pokemon, target, board, isTripleAttack }) => {
    if (isTripleAttack) return // ignore the effect of the 2nd and 3d attacks of triple attacks
    let shouldTriggerTripleAttack = false,
      isSupercharged = false
    if (pokemon.effects.has(EffectEnum.RISING_VOLTAGE)) {
      shouldTriggerTripleAttack = pokemon.count.attackCount % 4 === 0
    } else if (pokemon.effects.has(EffectEnum.POWER_SURGE)) {
      shouldTriggerTripleAttack = pokemon.count.attackCount % 3 === 0
    } else if (pokemon.effects.has(EffectEnum.SUPERCHARGED)) {
      shouldTriggerTripleAttack = pokemon.count.attackCount % 3 === 0
      isSupercharged = true
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
      if (isSupercharged && target) {
        target.addPP(-10, pokemon, 0, false)
        target.count.manaBurnCount++
        if (pokemon.player && !pokemon.isGhostOpponent) {
          pokemon.player.chargeCellBattery(5)
        }
      }
    }
  }
)

export class SoundCryEffect extends OnAbilityCastEffect {
  count: number = 0
  synergyTier: number = 0
  constructor(effect?: SynergyTier<Synergy.SOUND>) {
    super(undefined, effect)
    if (effect) {
      this.synergyTier = SynergyTiers[Synergy.SOUND].indexOf(effect) + 1
    }
  }

  apply(pokemon: PokemonEntity, board: Board) {
    pokemon.broadcastAbility({ skill: Ability.ECHO })
    const attackBuff = SOUND_ATK_BUFF_PER_SYNERGY_TIER[this.synergyTier] ?? 0
    const speedBuff = SOUND_SPEED_BUFF_PER_SYNERGY_TIER[this.synergyTier] ?? 0
    const ppGain = SOUND_PP_GAIN_PER_SYNERGY_TIER[this.synergyTier] ?? 0

    const chimecho = board
      .getAdjacentCells(pokemon.positionX, pokemon.positionY)
      .map((cell) => cell.value)
      .filter<PokemonEntity>((value): value is PokemonEntity => !!value)
      .find((entity) => entity.passive === Passive.CHIMECHO)

    if (chimecho) {
      chimecho.addPP(3, pokemon, 0, false)
    }

    const scale = pokemon.passive === Passive.MEGA_LAUNCHER ? 3 : 1

    board.cells.forEach((ally) => {
      if (ally?.team === pokemon.team) {
        if (ally.passive === Passive.COMATOSE && ally.status.sleep) {
          ally.addAbilityPower(5, pokemon, 0, false)
        } else {
          ally.status.sleepCooldown = 0
        }
        ally.addAttack(attackBuff * scale, pokemon, 0, false)
        ally.addSpeed(speedBuff * scale, pokemon, 0, false)
        ally.addPP(ppGain * scale, pokemon, 0, false)
        ally.count.soundCryCount += scale
      }
    })
  }
}

export const humanHealEffect = new OnDamageDealtEffect(
  ({ pokemon, target, damage, isRetaliation }: OnDamageDealtEffectArgs) => {
    if (isRetaliation) return // don't lifesteal on retaliation dammage from items
    if (target.id === pokemon.id) return // prevent healing from self-inflicted damage (e.g. Flame Orb)
    let lifesteal = 0
    if (pokemon.effects.has(EffectEnum.MEDITATE)) {
      lifesteal = 0.25
    } else if (pokemon.effects.has(EffectEnum.FOCUS_ENERGY)) {
      lifesteal = 0.35
    } else if (pokemon.effects.has(EffectEnum.CALM_MIND)) {
      lifesteal = 0.5
    }
    pokemon.handleHeal(Math.ceil(lifesteal * damage), pokemon, 0, false)
  },
  EffectEnum.MEDITATE
)

export class OnFieldDeathEffect extends OnDeathEffect {
  constructor(effect: SynergyTier<Synergy.FIELD>) {
    super(({ pokemon, board }) => {
      const synergyTier = SynergyTiers[Synergy.FIELD].indexOf(effect) + 1
      const heal = FIELD_HEAL_PER_SYNERGY_TIER[synergyTier] ?? 0
      const speedBoost = FIELD_SPEED_BUFF_PER_SYNERGY_TIER[synergyTier] ?? 0
      pokemon.simulation.room.clock.setTimeout(() => {
        board.forEach((x, y, value) => {
          if (
            value &&
            value.team === pokemon.team &&
            value.hasSynergy(Synergy.FIELD)
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
      const shouldProcAt50 =
        pokemon.effects.has(EffectEnum.MAX_AIRSTREAM) ||
        pokemon.effects.has(EffectEnum.SKYDIVE)

      if (
        (this.flyingProtection === 1 && pcHp < 0.2) ||
        (shouldProcAt50 && this.flyingProtection === 2 && pcHp < 0.5)
      ) {
        this.flyingProtection--
        pokemon.flyAway(board)
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
      pokemon.count.fightingBlockCount % 10 === 0 &&
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
      if (
        !targetAtContact ||
        targetAtContact.range > 1 ||
        distanceC(
          pokemon.targetX,
          pokemon.targetY,
          pokemon.positionX,
          pokemon.positionY
        ) > 1
      ) {
        // no target or not at contact
        return
      }

      const destination = board.getSafePlaceAwayFrom(
        pokemon.targetX,
        pokemon.targetY,
        targetAtContact.team
      )
      if (
        destination &&
        targetAtContact.items.has(Item.PROTECTIVE_PADS) === false
      ) {
        targetAtContact.shield = 0
        targetAtContact.handleDamage({
          damage: pokemon.atk,
          board,
          attackType: AttackType.PHYSICAL,
          attacker: pokemon,
          shouldTargetGainMana: true,
          isRetaliation: true
        })
        targetAtContact.moveTo(destination.x, destination.y, board, true)
      }
    }
  }
}

export const fightingTrainingEffect = new OnBenchedDuringFightEffect(
  ({ pokemon, player }) => {
    const pillar = schemaValues(player.board).find((p) => {
      return (
        isIn(Pillars, p.name) &&
        isOnBench(p) &&
        p.positionX === pokemon.positionX - 1
      )
    })

    if (pillar || (isOnBench(pokemon) && pokemon.positionX === 0)) {
      pokemon.action = PokemonActionState.TRAINING
    }
  }
)

export const onFlowerMonDeath = new OnDeathEffect(({ pokemon, board }) => {
  if (!pokemon.player) return
  if (!pokemon.isGhostOpponent) {
    pokemon.player.collectMulch(pokemon.stars)
  }

  const potsAvailable = getFlowerPotsUnlocked(pokemon.player)
  let nextPot: FlowerPot | undefined
  if (pokemon.team === Team.RED_TEAM) {
    nextPot = potsAvailable[pokemon.simulation.redFlowerSpawn]
    pokemon.simulation.redFlowerSpawn++
  } else {
    nextPot = potsAvailable[pokemon.simulation.blueFlowerSpawn]
    pokemon.simulation.blueFlowerSpawn++
  }

  if (nextPot) {
    const spawnSpot = board.getFarthestTargetCoordinateAvailablePlace(
      pokemon,
      true
    )
    if (spawnSpot) {
      const flowerToSpawn = pokemon.player.flowerPots.find((p) =>
        FlowerMonByPot[nextPot].includes(p.name)
      )
      if (!flowerToSpawn) {
        return console.error("No flower found to spawn for pot ", nextPot)
      }
      const entity = pokemon.simulation.addPokemon(
        flowerToSpawn,
        spawnSpot.x,
        spawnSpot.y,
        pokemon.team,
        true
      )
      entity.action = PokemonActionState.BLOSSOM
      entity.cooldown = 1000
      pokemon.player.pokemonsPlayed.add(flowerToSpawn.name)
    }
  }
})

export const wildBerserkEffect = new OnDamageReceivedEffect(
  ({ pokemon }: OnDamageReceivedEffectArgs) => {
    if (pokemon.hp > 0 && pokemon.hp < 0.3 * pokemon.maxHP) {
      pokemon.addSpeed(40, pokemon, 0, false)
      pokemon.addAttack(Math.ceil(0.4 * pokemon.baseAtk), pokemon, 0, false)
      pokemon.addShield(30, pokemon, 0, false)
      // Remove the effect to avoid multiple triggers
      pokemon.effectsSet.delete(wildBerserkEffect)
      // Remove after 3 seconds
      pokemon.commands.push(
        new DelayedCommand(() => {
          pokemon.addSpeed(-40, pokemon, 0, false)
          pokemon.addAttack(
            -Math.ceil(0.4 * pokemon.baseAtk),
            pokemon,
            0,
            false
          )
        }, 3000)
      )
    }
  }
)

export const normalShieldEffect = new OnSimulationStartEffect(
  ({ entity, simulation }) => {
    let shieldBonus = 0
    if (entity.effects.has(EffectEnum.STAMINA)) {
      shieldBonus = 15
    }
    if (entity.effects.has(EffectEnum.STRENGTH)) {
      shieldBonus += 20
    }
    if (entity.effects.has(EffectEnum.ENDURE)) {
      shieldBonus += 25
    }
    if (entity.effects.has(EffectEnum.PURE_POWER)) {
      shieldBonus += 30
      if (schemaValues(entity.items).some((item) => Scarves.includes(item))) {
        // All Silk Scarf-made item holders gain 30% base Attack and 30 Ability Power.
        entity.addAttack(Math.round(0.3 * entity.baseAtk), entity, 0, false)
        entity.addAbilityPower(30, entity, 0, false)
      }
    }
    if (shieldBonus >= 0) {
      entity.addShield(shieldBonus, entity, 0, false)
      const cells = simulation.board.getAdjacentCells(
        entity.positionX,
        entity.positionY
      )

      cells.forEach((cell) => {
        if (cell.value && entity.team == cell.value.team) {
          cell.value.addShield(shieldBonus, entity, 0, false)
        }
      })
    }
  }
)

export const bugSwarmSpawnEffect = new OnStageStartEffect(
  ({ player, room }) => {
    if (getFreeSpaceOnBench(player.board) > 0 && !player.isBot) {
      const bugsNotFinal = [...player.board.values()]
        .filter((p) => p.hasSynergy(Synergy.BUG) && !p.final)
        .sort((a, b) => RarityCost[a.rarity] - RarityCost[b.rarity])
      if (bugsNotFinal.length > 0) {
        const spawn = getPokemonBaseline(bugsNotFinal[0]!.name)
        room.spawnOnBench(player, spawn, "nest")
      }
    }
  }
)

export function applyWandEffects(
  pokemon: PokemonEntity,
  target: PokemonEntity,
  attackDamage: number,
  crit: boolean
): { takenDamage: number; death: boolean } {
  const board = pokemon.simulation.board
  const wands = pokemon.player?.items.filter((item) => isIn(Wands, item)) ?? []
  if (wands.length === 0) {
    return { takenDamage: 0, death: false }
  }

  let specialDamageFactor = 0

  for (const wand of wands) {
    specialDamageFactor += 0.2
    switch (wand) {
      case Item.CONFUSE_WAND: {
        if (chance(0.05, pokemon)) {
          target.status.triggerConfusion(2000, target, pokemon)
          target.addSpecialDefense(-3, pokemon, 0, false)
        }
        break
      }
      case Item.PETRIFY_WAND: {
        if (chance(0.05, pokemon)) {
          target.status.triggerLocked(2000, target)
          target.addDefense(-3, pokemon, 0, false)
        }
        break
      }
      case Item.SLOW_WAND: {
        if (chance(0.05, pokemon)) {
          target.status.triggerParalysis(2000, target, pokemon)
          target.addSpeed(-10, pokemon, 0, false)
        }
        break
      }
      case Item.SLUMBER_WAND: {
        if (chance(0.05, pokemon)) {
          target.status.triggerSleep(2000, target)
          target.addAttack(-3, pokemon, 0, false)
        }
        break
      }
      case Item.BLAST_WAND: {
        if (crit) {
          specialDamageFactor += 0.2
          pokemon.broadcastAbility({ skill: "PUFF_PINK" })
        }
        break
      }
      case Item.SPIRIT_WAND: {
        specialDamageFactor += pokemon.count.ult * 0.05
        if (chance(0.2, pokemon)) {
          pokemon.addPP(5, pokemon, 0, false)
        }
        break
      }
      case Item.GUIDING_WAND: {
        if (chance(0.5, pokemon)) {
          const lowestHpAdjacentEnemy = board
            .getAdjacentCells(target.positionX, target.positionY)
            .filter((cell) => cell.value && cell.value.team !== pokemon.team)
            .map((cell) => cell.value as PokemonEntity)
            .reduce(
              (lowest, current) =>
                current.hp / current.maxHP < lowest.hp / lowest.maxHP
                  ? current
                  : lowest,
              target
            )
          target = lowestHpAdjacentEnemy || target
          if (lowestHpAdjacentEnemy) {
            pokemon.broadcastAbility({
              skill: "FAIRY_HIT",
              targetX: lowestHpAdjacentEnemy.positionX,
              targetY: lowestHpAdjacentEnemy.positionY
            })
          }
        }
        break
      }
      case Item.SURROUND_WAND: {
        const adjacentEnemies = board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY)
          .filter((cell) => cell.value && cell.value.team !== pokemon.team)
        specialDamageFactor += 0.05 * adjacentEnemies.length
        break
      }
      case Item.TWO_EDGED_WAND: {
        specialDamageFactor += 0.2
        break
      }
    }
  }

  const specialDamage = specialDamageFactor * attackDamage
  let { takenDamage, death } = target.handleSpecialDamage(
    specialDamage,
    board,
    AttackType.SPECIAL,
    pokemon,
    false,
    false
  )

  // effects based on wands special damage, applied after calculation
  for (const wand of wands) {
    switch (wand) {
      case Item.HP_SWAP_WAND: {
        if (chance(0.2, pokemon)) {
          target.addMaxHP(-Math.floor(takenDamage), pokemon, 0, false)
          if (target.items.has(Item.TWIST_BAND) === false) {
            pokemon.addMaxHP(Math.floor(takenDamage), pokemon, 0, false)
          }
        }
        break
      }
      case Item.SURROUND_WAND: {
        if (chance(0.1, pokemon)) {
          const adjacentEnemies = board
            .getAdjacentCells(pokemon.positionX, pokemon.positionY)
            .filter(
              (cell) =>
                cell.value &&
                cell.value.team !== pokemon.team &&
                cell.value.id !== target.id
            )
            .map((cell) => cell.value as PokemonEntity)
          pokemon.broadcastAbility({ skill: "FAIRY_CRIT" })
          adjacentEnemies
            .filter((e) => e.id !== target.id)
            .forEach((enemy) => {
              const { takenDamage: additionalDamage, death: adjacentDeath } =
                enemy.handleSpecialDamage(
                  specialDamage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  false,
                  false
                )
              takenDamage += additionalDamage
              if (adjacentDeath) death = true
            })
        }
        break
      }
      case Item.TWO_EDGED_WAND: {
        if (
          !chance(0.8, pokemon) &&
          pokemon.items.has(Item.PROTECTIVE_PADS) === false
        ) {
          // self-inflict the same damage
          const selfDamage = specialDamage
          pokemon.handleSpecialDamage(
            selfDamage,
            board,
            AttackType.SPECIAL,
            pokemon,
            false,
            false
          )
        }
        break
      }
      case Item.WARP_WAND: {
        if (chance(0.05, pokemon) && target.hp > 0) {
          const teleportationCell = board.getTeleportationCell(
            target.positionX,
            target.positionY,
            target.team
          )
          if (teleportationCell) {
            pokemon.broadcastAbility({
              skill: "WARP_WAND",
              targetX: target.positionX,
              targetY: target.positionY
            })
            pokemon.broadcastAbility({
              skill: "WARP_WAND",
              targetX: target.positionX,
              targetY: target.positionY
            })
            target.moveTo(teleportationCell.x, teleportationCell.y, board, true)
          }
        }
        break
      }
      case Item.SWITCHER_WAND: {
        if (chance(0.05, pokemon) && target.hp > 0) {
          const farthestTarget = pokemon.state.getFarthestTarget(pokemon, board)
          if (farthestTarget) {
            pokemon.broadcastAbility({
              skill: "WARP_WAND",
              targetX: target.positionX,
              targetY: target.positionY
            })
            pokemon.broadcastAbility({
              skill: "WARP_WAND",
              targetX: farthestTarget.positionX,
              targetY: farthestTarget.positionY
            })
            target.moveTo(
              farthestTarget.positionX,
              farthestTarget.positionY,
              board,
              true
            )
          }
        }
        break
      }
      case Item.WHIRLWIND_WAND: {
        if (chance(0.05, pokemon)) {
          pokemon.broadcastAbility({ skill: "WHIRLWIND_WAND" })
          effectInLine(board, pokemon, target, (cell) => {
            if (cell.value && cell.value.team !== pokemon.team) {
              const freeCellInTheBack = board.getSafePlaceAwayFrom(
                cell.value.positionX,
                cell.value.positionY,
                cell.value.team,
                2
              )
              if (freeCellInTheBack) {
                cell.value.moveTo(
                  freeCellInTheBack.x,
                  freeCellInTheBack.y,
                  board,
                  true
                )
              }
            }
          })
        }
        break
      }
      case Item.TUNNEL_WAND: {
        if (chance(0.05, pokemon)) {
          pokemon.broadcastAbility({ skill: "FAIRY_TUNNEL" })
          effectInLine(board, pokemon, target, (cell) => {
            if (
              cell.value != null &&
              cell.value.team !== pokemon.team &&
              cell.value.id !== target.id
            ) {
              const { takenDamage: tunnelTakenDamage, death: tunnelDeath } =
                cell.value.handleSpecialDamage(
                  specialDamage,
                  board,
                  AttackType.SPECIAL,
                  pokemon,
                  false,
                  false
                )
              takenDamage += tunnelTakenDamage
              if (tunnelDeath) death = true
            }
          })
        }
        break
      }
    }
  }

  return { takenDamage, death }
}

export const pounceWandEffect = new OnAttackReceivedEffect(
  ({
    pokemon,
    board,
    totalDamage,
    attacker,
    crit
  }: OnAttackReceivedEffectArgs) => {
    // proc fairy splash damage
    if (
      pokemon.fairySplashCooldown === 0 &&
      attacker &&
      (crit || chance(0.1, pokemon))
    ) {
      const shockDamageFactor = 0.3
      const shockDamage = min(1)(Math.round(shockDamageFactor * totalDamage))
      pokemon.count.fairyCritCount++
      pokemon.fairySplashCooldown = 250

      const distance = distanceC(
        pokemon.positionX,
        pokemon.positionY,
        attacker.positionX,
        attacker.positionY
      )

      if (distance <= 1) {
        // melee range
        board
          .getAdjacentCells(pokemon.positionX, pokemon.positionY, false)
          .forEach((cell) => {
            if (
              cell.value &&
              cell.value.team !== pokemon.team &&
              cell.value.items.has(Item.PROTECTIVE_PADS) === false
            ) {
              cell.value.handleDamage({
                damage: shockDamage,
                board,
                attackType: AttackType.SPECIAL,
                attacker: pokemon,
                isRetaliation: true,
                shouldTargetGainMana: true
              })
            }
          })
      }
    }
  }
)

export const cloneBugs = ({
  board,
  teamIndex,
  player,
  effects,
  simulation
}: {
  board: MapSchema<Pokemon, string>
  teamIndex: number
  player: Player | undefined
  effects: Set<EffectEnum>
  simulation: Simulation
}) => {
  const bugTeam = new Array<IPokemon>()
  board.forEach((pkm) => {
    if (pkm.hasSynergy(Synergy.BUG) && pkm.positionY != 0) {
      bugTeam.push(pkm)
    }
  })
  bugTeam.sort((a, b) => getUnitScore(b) - getUnitScore(a))

  let numberOfBugsToClone = 0
  if (effects.has(EffectEnum.COCOON)) {
    numberOfBugsToClone = 1
  }
  if (effects.has(EffectEnum.INFESTATION)) {
    numberOfBugsToClone = 2
  }
  if (effects.has(EffectEnum.HORDE)) {
    numberOfBugsToClone = 3
  }
  if (effects.has(EffectEnum.HEART_OF_THE_SWARM)) {
    numberOfBugsToClone = 4
  }
  numberOfBugsToClone = Math.min(numberOfBugsToClone, bugTeam.length)

  for (let i = 0; i < numberOfBugsToClone; i++) {
    let numberOfClones = 1
    const pokemonCloned = bugTeam[i]
    let clonePkm = pokemonCloned.name

    if (pokemonCloned.passive === Passive.VESPIQUEN) {
      numberOfClones = 2
      clonePkm = Pkm.COMBEE
    }

    for (
      let numberOfClone = 0;
      numberOfClone < numberOfClones;
      numberOfClone++
    ) {
      const clone = PokemonFactory.createPokemonFromName(clonePkm, player)
      clone.stacks = pokemonCloned.stacks

      const coord = simulation.getClosestFreeCellToPokemon(
        pokemonCloned,
        teamIndex
      )
      if (coord) {
        const cloneEntity = simulation.addPokemon(
          clone,
          coord.x,
          coord.y,
          teamIndex,
          true
        )
        if (pokemonCloned.items.has(Item.SHED_SHELL)) {
          const team =
            teamIndex === Team.BLUE_TEAM
              ? simulation.blueTeam
              : simulation.redTeam
          const clonedEntity = schemaValues(team).find(
            (p) => p.refToBoardPokemon.id === pokemonCloned.id
          )
          if (clonedEntity) {
            clonedEntity.addMaxHP(
              -0.5 * pokemonCloned.maxHP,
              clonedEntity,
              0,
              false
            )
          }

          cloneEntity.addMaxHP(-0.5 * clone.maxHP, cloneEntity, 0, false)
        }
      }
    }
  }
}

const giveFireShardEffect = new OnStageStartEffect(({ player }) => {
  if (
    getSynergyTier(player.synergies, Synergy.FIRE) === 4 &&
    player.items.includes(Item.FIRE_SHARD) === false &&
    player.life > 2
  ) {
    player.items.push(Item.FIRE_SHARD)
  }
})

const growBerryTreesEffect = new OnStageStartEffect(({ player }) => {
  const nbTrees = getSynergyTier(player.synergies, Synergy.GRASS)
  for (let i = 0; i < nbTrees; i++) {
    player.berryTreesStages[i] = max(3)(player.berryTreesStages[i] + 1)
  }
})

const groundDigEffect = new OnStageStartEffect(({ player, room }) => {
  if (getSynergyTier(player.synergies, Synergy.GROUND) > 0) {
    player.board.forEach((pokemon, pokemonId) => {
      if (
        pokemon.hasSynergy(Synergy.GROUND) &&
        !isOnBench(pokemon) &&
        !(
          pokemon.items.has(Item.CHEF_HAT) &&
          player.synergies.hasSynergyActive(Synergy.GOURMET)
        )
      ) {
        const index = (pokemon.positionY - 1) * BOARD_WIDTH + pokemon.positionX
        const hasAlreadyReachedMaxDepth = player.groundHoles[index] === 5
        const isReachingMaxDepth = player.groundHoles[index] === 4
        if (!hasAlreadyReachedMaxDepth) {
          let buriedItem = isReachingMaxDepth ? player.buriedItems[index] : null
          if (
            pokemon.items.has(Item.EXPLORER_KIT) &&
            isReachingMaxDepth &&
            !buriedItem
          ) {
            if (chance(0.1, pokemon)) {
              buriedItem = Item.BIG_NUGGET
            } else if (chance(0.5, pokemon)) {
              buriedItem = Item.NUGGET
            } else {
              buriedItem = Item.COIN
            }
          }
          room.broadcast(Transfer.DIG, {
            pokemonId,
            buriedItem
          })
          room.clock.setTimeout(() => {
            player.groundHoles[index] = max(5)(player.groundHoles[index] + 1)
            PassiveEffects[pokemon.passive]?.forEach((effect) => {
              if (effect instanceof OnGroundDiggingEffect) {
                effect.apply({ pokemon, player })
              }
            })
            player.board.forEach((pokemon) => {
              // Condition based evolutions on ground hole dig
              if (pokemon.evolutionRule.type === EvolutionRuleType.STATE) {
                EvolutionManager.tryEvolve(pokemon, player, room.state)
              } else if (
                pokemon.evolutionRule.type === EvolutionRuleType.STACK
              ) {
                EvolutionManager.tryEvolve(pokemon, player)
              }
            })
          }, 1000)

          if (buriedItem) {
            room.clock.setTimeout(() => {
              if (buriedItem === Item.COIN) {
                player.addMoney(1, true, null)
              } else if (buriedItem === Item.NUGGET) {
                player.addMoney(3, true, null)
              } else if (buriedItem === Item.BIG_NUGGET) {
                player.addMoney(10, true, null)
              } else if (buriedItem === Item.TREASURE_BOX) {
                player.items.push(...pickNRandomIn(ItemComponents, 2))
              } else if (isIn(SynergyGems, buriedItem)) {
                const type = SynergyGivenByGem[buriedItem]
                player.bonusSynergies.set(
                  type,
                  (player.bonusSynergies.get(type) ?? 0) + 1
                )
                player.items.push(buriedItem)
                player.updateSynergies()
              } else {
                player.items.push(buriedItem)
              }
            }, 2500)
          }
        }
      }
    })
  }
})

export const SynergyEffects: Partial<
  Record<EffectEnum, (Effect | (() => Effect))[]>
> = {
  [EffectEnum.HEART_OF_THE_SWARM]: [bugSwarmSpawnEffect],
  [EffectEnum.DESOLATE_LAND]: [giveFireShardEffect],
  [EffectEnum.INGRAIN]: [growBerryTreesEffect],
  [EffectEnum.GROWTH]: [growBerryTreesEffect],
  [EffectEnum.SPORE]: [growBerryTreesEffect],
  [EffectEnum.OVERGROW]: [growBerryTreesEffect],
  [EffectEnum.TILLER]: [groundDigEffect],
  [EffectEnum.DIGGER]: [groundDigEffect],
  [EffectEnum.DRILLER]: [groundDigEffect],
  [EffectEnum.DEEP_MINER]: [groundDigEffect]
}
