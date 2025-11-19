import { Schema, SetSchema, type } from "@colyseus/schema"
import { nanoid } from "nanoid"
import {
  ARMOR_FACTOR,
  DEFAULT_CRIT_CHANCE,
  DEFAULT_CRIT_POWER,
  ItemStats,
  MONSTER_AP_BUFF_PER_SYNERGY_LEVEL,
  MONSTER_ATTACK_BUFF_PER_SYNERGY_LEVEL,
  ON_ATTACK_MANA
} from "../config"
import Count from "../models/colyseus-models/count"
import Player from "../models/colyseus-models/player"
import { Pokemon, PokemonClasses } from "../models/colyseus-models/pokemon"
import Status from "../models/colyseus-models/status"
import { SynergyEffects } from "../models/effects"
import PokemonFactory from "../models/pokemon-factory"
import { getPokemonData } from "../models/precomputed/precomputed-pokemon-data"
import { getSellPrice } from "../models/shop"
import { Emotion, IPokemon, IPokemonEntity, Title, Transfer } from "../types"
import { Ability } from "../types/enum/Ability"
import { EffectEnum } from "../types/enum/Effect"
import {
  AttackType,
  Orientation,
  PokemonActionState,
  Rarity,
  Stat,
  Team
} from "../types/enum/Game"
import {
  Berries,
  Item,
  SynergyGivenByItem,
  SynergyStones
} from "../types/enum/Item"
import { Passive } from "../types/enum/Passive"
import { Pkm } from "../types/enum/Pokemon"
import { SpecialGameRule } from "../types/enum/SpecialGameRule"
import { Synergy } from "../types/enum/Synergy"
import { Weather } from "../types/enum/Weather"
import { count } from "../utils/array"
import { isOnBench } from "../utils/board"
import { distanceC, distanceM } from "../utils/distance"
import { isPlainFunction } from "../utils/function"
import { clamp, max, min } from "../utils/number"
import { chance, pickNRandomIn, pickRandomIn } from "../utils/random"
import { values } from "../utils/schemas"
import AttackingState from "./attacking-state"
import type { Board } from "./board"
import {
  Effect,
  Effect as EffectClass,
  OnAttackEffect,
  OnDamageDealtEffect,
  OnDamageReceivedEffect,
  OnDeathEffect,
  OnHitEffect,
  OnItemGainedEffect,
  OnItemRemovedEffect,
  OnKillEffect
} from "./effects/effect"
import { ItemEffects } from "./effects/items"
import { PassiveEffects } from "./effects/passives"
import {
  FireHitEffect,
  FlyingProtectionEffect,
  MonsterKillEffect
} from "./effects/synergies"
import { IdleState } from "./idle-state"
import MovingState from "./moving-state"
import PokemonState from "./pokemon-state"
import Simulation from "./simulation"
import { DelayedCommand, SimulationCommand } from "./simulation-command"

export class PokemonEntity extends Schema implements IPokemonEntity {
  @type("boolean") shiny: boolean
  @type("uint8") positionX: number
  @type("uint8") positionY: number
  @type("string") action = PokemonActionState.WALK
  @type("string") index: string
  @type("string") id: string
  @type("string") orientation = Orientation.DOWNLEFT
  @type("uint16") maxHP: number
  @type("uint16") hp: number
  @type("uint16") shield = 0
  @type("uint8") maxPP: number
  @type("uint8") pp = 0
  @type("uint16") atk: number
  @type("uint16") def: number
  @type("uint16") speDef: number
  @type("int16") ap = 0
  @type("int16") luck = 0
  @type("uint8") critChance = DEFAULT_CRIT_CHANCE
  @type("float32") critPower = DEFAULT_CRIT_POWER
  @type("uint8") team: Team
  @type("uint8") range: number
  @type("uint16") speed: number
  @type("string") targetEntityId: string = ""
  @type("int8") targetX = -1
  @type("int8") targetY = -1
  @type("string") rarity: Rarity
  @type("string") name: Pkm
  @type({ set: "string" }) effects = new SetSchema<EffectEnum>()
  @type({ set: "string" }) items = new SetSchema<Item>()
  @type({ set: "string" }) types = new SetSchema<Synergy>()
  @type("uint8") stars: number
  @type("string") skill: Ability
  @type("string") passive: Passive
  @type(Status) status: Status
  @type(Count) count: Count
  @type("uint16") healDone: number
  @type("string") emotion: Emotion
  @type("uint8") stacks: number = 0
  @type("uint8") stacksRequired: number = 0
  cooldown = 500
  oneSecondCooldown = 1000
  state: PokemonState
  simulation: Simulation
  baseTeam: Team
  baseAtk: number
  baseDef: number
  baseSpeDef: number
  baseRange: number
  baseHP: number
  dodge: number
  physicalDamage: number
  specialDamage: number
  trueDamage: number
  physicalDamageReduced: number
  specialDamageReduced: number
  shieldDamageTaken: number
  shieldDone: number
  grassHealCooldown = 2000
  sandstormDamageTimer = 0
  fairySplashCooldown = 0
  isSpawn = false
  refToBoardPokemon: IPokemon
  commands = new Array<SimulationCommand>()
  effectsSet = new Set<EffectClass>()

  constructor(
    pokemon: IPokemon,
    positionX: number,
    positionY: number,
    team: number,
    simulation: Simulation
  ) {
    super()
    this.state = new MovingState()
    this.refToBoardPokemon = pokemon
    pokemon.items.forEach((it) => {
      this.items.add(it)
    })
    this.status = new Status(simulation)
    this.count = new Count()
    this.simulation = simulation

    this.id = nanoid()
    this.rarity = pokemon.rarity
    this.positionX = positionX
    this.positionY = positionY
    this.index = pokemon.index
    this.name = pokemon.name
    this.action = PokemonActionState.WALK
    this.orientation = Orientation.DOWNLEFT
    this.baseAtk = pokemon.atk
    this.baseDef = pokemon.def
    this.baseSpeDef = pokemon.speDef
    this.baseRange = pokemon.range
    this.baseHP = pokemon.hp
    this.atk = pokemon.atk
    this.def = pokemon.def
    this.speDef = pokemon.speDef
    this.maxHP = pokemon.maxHP
    this.maxPP = pokemon.maxPP
    this.hp = pokemon.hp
    this.speed = pokemon.speed
    this.range = pokemon.range
    this.team = team
    this.baseTeam = team
    this.stars = pokemon.stars
    this.skill = pokemon.skill
    this.shiny = pokemon.shiny
    this.emotion = pokemon.emotion
    this.ap = pokemon.ap
    this.luck = pokemon.luck
    this.stacks = pokemon.stacks
    this.stacksRequired = pokemon.stacksRequired
    this.dodge = 0
    this.physicalDamage = 0
    this.specialDamage = 0
    this.trueDamage = 0
    this.physicalDamageReduced = 0
    this.specialDamageReduced = 0
    this.shieldDamageTaken = 0
    this.healDone = 0
    this.shieldDone = 0
    this.resetCooldown(500)

    pokemon.types.forEach((type) => {
      this.types.add(type)
    })

    this.passive = Passive.NONE
    this.changePassive(pokemon.passive)
  }

  update(dt: number, board: Board, player: Player | undefined) {
    this.state.update(this, dt, board, player)
  }

  get canMove(): boolean {
    return (
      !this.status.freeze &&
      !this.status.sleep &&
      !this.status.resurrecting &&
      !this.status.locked
    )
  }

  get canBeCopied(): boolean {
    return this.passive !== Passive.INANIMATE
  }

  get isGhostOpponent(): boolean {
    return this.simulation.isGhostBattle && this.team === Team.RED_TEAM
  }

  isTargettableBy(
    attacker: IPokemonEntity,
    targetEnemies = true,
    targetAllies = false
  ): boolean {
    return (
      !this.status.resurrecting &&
      ((targetAllies && this.team === attacker.team) ||
        (targetEnemies && this.team !== attacker.team) ||
        (attacker.effects.has(EffectEnum.MERCILESS) &&
          attacker.id !== this.id &&
          this.hp <= 0.1 * this.maxHP))
    )
  }

  get player(): Player | undefined {
    const player =
      this.baseTeam === Team.BLUE_TEAM
        ? this.simulation.bluePlayer
        : this.simulation.redPlayer
    if (player instanceof Player) {
      return player
    } else {
      return undefined // PvE or ghost player
    }
  }

  get inSpotlight(): boolean {
    if (!this.player) return false
    const { lightX, lightY } = this.player
    const { positionX, positionY } = this.refToBoardPokemon
    return (
      (positionX === lightX && positionY === lightY) ||
      this.items.has(Item.SHINY_STONE) ||
      (this.passive === Passive.CONVERSION &&
        this.types.has(Synergy.LIGHT) &&
        !this.items.has(Item.LIGHT_BALL))
    )
  }

  hasSynergyEffect(synergy: Synergy): boolean {
    return SynergyEffects[synergy].some((effect) => this.effects.has(effect))
  }

  resetCooldown(baseDuration: number, speed = this.speed) {
    this.cooldown = Math.round(baseDuration / (0.4 + speed * 0.007))
  }

  setTarget(target: IPokemonEntity | null) {
    if (target) {
      this.targetEntityId = target.id
      this.targetX = target.positionX
      this.targetY = target.positionY
    } else {
      this.targetEntityId = ""
      this.targetX = -1
      this.targetY = -1
    }
  }

  handleDamage(params: {
    damage: number
    board: Board
    attackType: AttackType
    attacker: PokemonEntity | null
    shouldTargetGainMana: boolean
    isRetaliation?: boolean
  }) {
    return this.state.handleDamage({ target: this, ...params })
  }

  handleSpecialDamage(
    damage: number,
    board: Board,
    attackType: AttackType,
    attacker: PokemonEntity | null,
    crit: boolean,
    apBoost = true
  ): { death: boolean; takenDamage: number } {
    if (
      this.status.protect ||
      this.status.skydiving ||
      this.status.magicBounce
    ) {
      this.count.spellBlockedCount++
      if (
        this.status.magicBounce &&
        attackType === AttackType.SPECIAL &&
        damage > 0 &&
        attacker &&
        !attacker.items.has(Item.PROTECTIVE_PADS)
      ) {
        this.commands.push(
          new DelayedCommand(() => {
            const bounceCrit =
              crit ||
              (this.effects.has(EffectEnum.ABILITY_CRIT) &&
                chance(this.critChance / 100, this))
            const bounceDamage = Math.round(
              ([0.5, 1][this.stars - 1] ?? 1) *
                damage *
                (1 + this.ap / 100) *
                (bounceCrit ? this.critPower : 1)
            )
            this.broadcastAbility({
              skill: attacker.skill,
              positionX: this.positionX,
              positionY: this.positionY,
              targetX: attacker.positionX,
              targetY: attacker.positionY
            })
            attacker.handleDamage({
              damage: bounceDamage,
              board,
              attackType: AttackType.SPECIAL,
              attacker: this,
              shouldTargetGainMana: true,
              isRetaliation: true // important to not trigger infinite loop between two magic bounces
            })
          }, 500)
        )
      }
      return { death: false, takenDamage: 0 }
    } else {
      let specialDamage =
        damage + (damage * (attacker && apBoost ? attacker.ap : 0)) / 100
      if (attacker && attacker.effects.has(EffectEnum.DOUBLE_DAMAGE)) {
        specialDamage *= 2
        attacker.effects.delete(EffectEnum.DOUBLE_DAMAGE)
      }
      if (
        this.effects.has(EffectEnum.STRANGE_STEAM) ||
        (attacker && attacker.effects.has(EffectEnum.STRANGE_STEAM))
      ) {
        specialDamage *= 1.2
      }
      if (crit && attacker && this.items.has(Item.ROCKY_HELMET) === false) {
        specialDamage *= attacker.critPower
      }
      if (
        attacker &&
        attacker.items.has(Item.POKEMONOMICON) &&
        attackType === AttackType.SPECIAL
      ) {
        this.status.triggerBurn(3000, this, attacker)
      }
      if (attacker?.passive === Passive.BERSERK) {
        attacker.addAbilityPower(5, attacker, 0, false, false)
      }

      const damageResult = this.state.handleDamage({
        target: this,
        damage: specialDamage,
        board,
        attackType,
        attacker,
        shouldTargetGainMana: true
      })

      if (
        this.items.has(Item.POWER_LENS) &&
        specialDamage >= 1 &&
        attacker &&
        !attacker.items.has(Item.PROTECTIVE_PADS) &&
        attackType === AttackType.SPECIAL
      ) {
        const speDef = this.status.armorReduction
          ? Math.round(this.speDef / 2)
          : this.speDef
        const damageAfterReduction = specialDamage / (1 + ARMOR_FACTOR * speDef)
        const damageBlocked = min(0)(specialDamage - damageAfterReduction)
        attacker.handleDamage({
          damage: Math.round(damageBlocked),
          board,
          attackType: AttackType.SPECIAL,
          attacker: this,
          shouldTargetGainMana: true,
          isRetaliation: true // important to not trigger infinite loop between two power lenses
        })
      }
      return damageResult
    }
  }

  handleHeal(
    heal: number,
    caster: PokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    return this.state.handleHeal(this, heal, caster, apBoost, crit)
  }

  addShield(
    shield: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    return this.state.addShield(this, shield, caster, apBoost, crit)
  }

  changeState(state: PokemonState) {
    this.state.onExit(this)
    this.state = state
    this.state.onEnter(this)
  }

  toMovingState() {
    if (this.passive === Passive.INANIMATE) return
    this.changeState(new MovingState())
  }

  toAttackingState() {
    if (this.passive === Passive.INANIMATE) return
    this.changeState(new AttackingState())
  }

  toIdleState() {
    this.changeState(new IdleState())
  }

  addPP(value: number, caster: IPokemonEntity, apBoost: number, crit: boolean) {
    value = Math.round(
      value *
        (1 + (apBoost * caster.ap) / 100) *
        (crit ? caster.critPower : 1) *
        (this.status.fatigue && value > 0 ? 0.5 : 1)
    )

    if (
      !(value > 0 && this.status.silence) &&
      !(value > 0 && this.status.protect) &&
      !this.status.resurrecting &&
      !(value < 0 && this.status.tree) // cannot lose PP if tree
    ) {
      this.pp = clamp(this.pp + value, 0, this.maxPP * 2 - 1)
    }
  }

  addCritChance(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value =
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)

    // for every 5% crit chance > 100, +10 crit power
    this.critChance += value

    if (this.critChance > 100) {
      const overCritChance = Math.round(this.critChance - 100)
      this.addCritPower(overCritChance, this, 0, false)
      this.critChance = 100
    }
  }

  addCritPower(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value =
      (value / 100) *
      (1 + (apBoost * caster.ap) / 100) *
      (crit ? caster.critPower : 1)

    this.critPower = min(0)(this.critPower + value)
  }

  addMaxHP(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent = false
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    this.maxHP = min(1)(this.maxHP + value)
    if (this.hp > 0) {
      // careful to not heal a KO pokemon
      this.hp = clamp(this.hp + value, 1, this.maxHP)
    }
    if (permanent && !this.isGhostOpponent) {
      ;(this.refToBoardPokemon as Pokemon).addMaxHP(value, this.player)
    }
  }

  addDodgeChance(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value =
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    this.dodge = clamp(this.dodge + value, 0, 0.9)
  }

  addAbilityPower(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent = false
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    const update = (target: { ap: number }) => {
      target.ap = min(-100)(target.ap + value)
    }
    update(this)
    if (permanent && !this.isGhostOpponent) {
      update(this.refToBoardPokemon)
    }
  }

  addLuck(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent = false
  ) {
    value =
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    const update = (target: { luck: number }) => {
      target.luck = clamp(target.luck + value, -100, +100)
    }
    update(this)
    if (permanent && !this.isGhostOpponent) {
      update(this.refToBoardPokemon)
    }
  }

  addDefense(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent = false
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    const update = (target: { def: number }) => {
      target.def = min(0)(target.def + value)
    }
    update(this)
    if (permanent && !this.isGhostOpponent) {
      update(this.refToBoardPokemon)
    }
  }

  addSpecialDefense(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent = false
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    const update = (target: { speDef: number }) => {
      target.speDef = min(0)(target.speDef + value)
    }
    update(this)
    if (permanent && !this.isGhostOpponent) {
      update(this.refToBoardPokemon)
    }
  }

  addAttack(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent = false
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    const update = (target: { atk: number }) => {
      target.atk = min(1)(target.atk + value)
    }
    update(this)
    if (permanent && !this.isGhostOpponent) {
      update(this.refToBoardPokemon)
    }
  }

  addSpeed(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean,
    permanent = false
  ) {
    if (this.passive === Passive.MELMETAL) {
      this.addAttack(value * 0.5, caster, apBoost, crit, permanent)
    } else {
      value =
        value *
        (1 + (apBoost * caster.ap) / 100) *
        (crit ? caster.critPower : 1)
      const update = (target: { speed: number }) => {
        target.speed = clamp(target.speed + value, 0, 300)
      }
      update(this)
      if (permanent && !this.isGhostOpponent) {
        update(this.refToBoardPokemon)
      }
    }
  }

  addItem(item: Item, permanent = false) {
    const type = SynergyGivenByItem[item]
    if (
      this.items.size >= 3 ||
      (SynergyStones.includes(item) && this.types.has(type)) ||
      ((item === Item.EVIOLITE || item === Item.RARE_CANDY) &&
        !this.refToBoardPokemon.hasEvolution) ||
      (item === Item.RARE_CANDY && this.items.has(Item.EVIOLITE))
    ) {
      return
    }

    if (this.items.has(item) == false) {
      this.items.add(item)
      this.applyItemEffect(item)
    }
    if (permanent && !this.isGhostOpponent) {
      this.refToBoardPokemon.items.add(item)
    }

    if (type && !this.types.has(type)) {
      this.types.add(type)
      this.simulation.applySynergyEffects(this, type)
    }
  }

  removeItem(item: Item, permanent = false) {
    this.items.delete(item)
    this.removeItemEffect(item)
    if (permanent && !this.isGhostOpponent) {
      this.refToBoardPokemon.items.delete(item)
    }
  }

  applyItemEffect(item: Item) {
    Object.entries(ItemStats[item] ?? {}).forEach(([stat, value]) => {
      this.applyStat(stat as Stat, value)
    })

    ItemEffects[item]?.forEach((effectOrEffectFn) => {
      const effect: Effect = isPlainFunction(effectOrEffectFn)
        ? effectOrEffectFn()
        : effectOrEffectFn
      if (effect instanceof OnItemGainedEffect) {
        effect.apply(this, item) // OnItemGainedEffect from ItemEffects are applied immediately and not added to effectsSet
      } else if (effect instanceof OnItemRemovedEffect) {
        return // OnItemRemovedEffect from ItemEffects are handled separately in removeItemEffect when removing items and not added to effectsSet
      } else {
        this.effectsSet.add(effect)
      }
    })

    this.getEffects(OnItemGainedEffect).forEach((effect) => {
      effect.apply(this, item)
    })
  }

  removeItemEffect(item: Item) {
    Object.entries(ItemStats[item] ?? {}).forEach(([stat, value]) =>
      this.applyStat(stat as Stat, -value)
    )

    const type = SynergyGivenByItem[item]
    const default_types = getPokemonData(this.name).types
    if (type && !default_types.includes(type)) {
      this.types.delete(type)
      SynergyEffects[type].forEach((effectName) => {
        this.effects.delete(effectName)
        this.effectsSet.forEach((effect) => {
          if (effect.origin === effectName) this.effectsSet.delete(effect)
        })
      })
    }

    ItemEffects[item]?.forEach((effectOrEffectFn) => {
      const effect: Effect = isPlainFunction(effectOrEffectFn)
        ? effectOrEffectFn()
        : effectOrEffectFn
      if (effect instanceof OnItemRemovedEffect)
        effect.apply(this, item) // OnItemRemovedEffect from ItemEffects are applied here because they are not added to effectsSet
      else if (effectOrEffectFn instanceof EffectClass)
        this.effectsSet.delete(effect)
      else if (isPlainFunction(effectOrEffectFn)) {
        this.effectsSet.forEach((e) => {
          /* delete all effects of the same class
             NOTE: all item effects declared as functions should have their own class, which should be the case because the only reason to use a function to create a new instance of effect
             instead of linking directly to an effect instance is to be able to store internal state for this effect, like stacks, which are stored as private fields of a specific class
           */
          if (e.constructor === effect.constructor) this.effectsSet.delete(e)
        })
      }
    })

    // apply the other OnItemRemovedEffects that could be present from other sources (passives, synergies, ...)
    this.getEffects(OnItemRemovedEffect).forEach((effect) => {
      effect.apply(this, item)
    })
  }

  moveTo(x: number, y: number, board: Board, forcedDisplacement: boolean) {
    if (forcedDisplacement && this.items.has(Item.HEAVY_DUTY_BOOTS)) return
    const target = board.getEntityOnCell(x, y)
    if (
      forcedDisplacement &&
      target &&
      target?.items.has(Item.HEAVY_DUTY_BOOTS)
    )
      return
    this.toMovingState()
    if (target) target.toMovingState()

    board.swapCells(this.positionX, this.positionY, x, y)
    this.cooldown = 100 // for faster retargeting
  }

  skydiveTo(x: number, y: number, board: Board) {
    this.status.skydiving = true
    board.swapCells(this.positionX, this.positionY, x, y)
    if (this.state instanceof MovingState === false) {
      this.toMovingState()
    }
    this.cooldown = 1500 // 500ms for flying up, 500ms for skydive anim, 500ms to reposition after landing
  }

  // called after every attack, no matter if it's successful or not
  onAttack({
    target,
    board,
    physicalDamage,
    specialDamage,
    trueDamage,
    totalDamage,
    isTripleAttack,
    hasAttackKilled
  }: {
    target: PokemonEntity
    board: Board
    physicalDamage: number
    specialDamage: number
    trueDamage: number
    totalDamage: number
    isTripleAttack: boolean
    hasAttackKilled: boolean
  }) {
    this.addPP(ON_ATTACK_MANA, this, 0, false)

    if (target.effects.has(EffectEnum.OBSTRUCT)) {
      this.addDefense(-2, target, 0, false)
    }

    this.getEffects(OnAttackEffect).forEach((effect) => {
      effect.apply({
        pokemon: this,
        target,
        board,
        physicalDamage,
        specialDamage,
        trueDamage,
        totalDamage,
        isTripleAttack,
        hasAttackKilled
      })
    })
  }

  // called after every successful basic attack (not dodged or protected)
  onHit({
    target,
    board,
    totalTakenDamage,
    physicalDamage,
    specialDamage,
    trueDamage
  }: {
    target: PokemonEntity
    board: Board
    totalTakenDamage: number
    physicalDamage: number
    specialDamage: number
    trueDamage: number
  }) {
    if (this.passive === Passive.BERRY_EATER) {
      for (const item of target.items.values()) {
        Berries.includes(item) && this.eatBerry(item, target)
      }
    }

    if (target.passive === Passive.PSYDUCK && chance(0.1, this)) {
      target.status.triggerConfusion(3000, target, target)
    }

    if (this.name === Pkm.MINIOR) {
      this.addSpeed(5, this, 1, false)
    }

    if (this.passive === Passive.DREAM_CATCHER && target.status.sleep) {
      const allies = board.cells.filter(
        (p) => p && p.team === this.team && p.id !== this.id
      ) as PokemonEntity[]
      const alliesHit = allies
        .sort(
          (a, b) =>
            distanceM(a.positionX, a.positionY, this.targetX, this.targetY) -
            distanceM(b.positionX, b.positionY, this.targetX, this.targetY)
        )
        .slice(0, 2)

      alliesHit.forEach((ally) => {
        ally.addShield(10, ally, 1, false)
        ally.broadcastAbility({ skill: Ability.MOON_DREAM })
      })
    }

    this.getEffects(OnHitEffect).forEach((effect) => {
      effect.apply({
        attacker: this,
        target,
        board,
        totalTakenDamage,
        physicalDamage,
        specialDamage,
        trueDamage
      })
    })

    if (this.hasSynergyEffect(Synergy.ICE) && this.types.has(Synergy.ICE)) {
      const nbIcyRocks =
        this.player && this.simulation.weather === Weather.SNOW
          ? count(this.player.items, Item.ICY_ROCK)
          : 0

      const freezeChance = 0.3 + nbIcyRocks * 0.05
      if (chance(freezeChance, this)) {
        target.status.triggerFreeze(2000, target)
      }
    }

    if (this.hasSynergyEffect(Synergy.FIRE)) {
      let burnChance = 0.3
      const nbHeatRocks =
        this.player && this.simulation.weather === Weather.SUN
          ? count(this.player.items, Item.HEAT_ROCK)
          : 0
      burnChance += nbHeatRocks * 0.05
      if (chance(burnChance, this)) {
        target.status.triggerBurn(3000, target, this)
      }
    }

    if (this.hasSynergyEffect(Synergy.MONSTER)) {
      const flinchChance = 0.3
      if (chance(flinchChance, this)) {
        target.status.triggerFlinch(3000, target, this)
      }
    }

    if (this.hasSynergyEffect(Synergy.GHOST)) {
      const silenceChance = 0.15
      if (chance(silenceChance, this)) {
        target.status.triggerSilence(2000, target, this)
      }
    }

    if (this.hasSynergyEffect(Synergy.POISON)) {
      let poisonChance = 0
      if (this.effects.has(EffectEnum.POISONOUS)) {
        poisonChance = 0.3
      }
      if (this.effects.has(EffectEnum.VENOMOUS)) {
        poisonChance = 0.6
      }
      if (this.effects.has(EffectEnum.TOXIC)) {
        poisonChance = 1.0
      }
      if (target.player) {
        const nbSmellyClays = count(target.player.items, Item.SMELLY_CLAY)
        poisonChance -= nbSmellyClays * 0.15
      }
      if (poisonChance > 0 && chance(poisonChance, this)) {
        target.status.triggerPoison(4000, target, this)
      }
    }

    if (this.hasSynergyEffect(Synergy.WILD)) {
      const woundChance = 0.25
      if (chance(woundChance, this)) {
        target.status.triggerWound(3000, target, this)
      }
    }

    // Ability effects on hit
    if (
      target.status.spikeArmor &&
      distanceC(
        this.positionX,
        this.positionY,
        target.positionX,
        target.positionY
      ) === 1 &&
      !this.items.has(Item.PROTECTIVE_PADS)
    ) {
      const crit =
        target.effects.has(EffectEnum.ABILITY_CRIT) &&
        chance(target.critChance / 100, this)
      const defFactor = [0.6, 0.8, 1][target.stars - 1] ?? 1
      const damage = Math.round(
        target.def *
          defFactor *
          (1 + target.ap / 100) *
          (crit ? target.critPower : 1)
      )
      this.status.triggerWound(2000, this, target)
      this.handleDamage({
        damage,
        board,
        attackType: AttackType.SPECIAL,
        attacker: target,
        isRetaliation: true,
        shouldTargetGainMana: true
      })
    }

    if (target.effects.has(EffectEnum.SHELL_TRAP) && physicalDamage > 0) {
      const cells = board.getAdjacentCells(target.positionX, target.positionY)
      const crit =
        target.effects.has(EffectEnum.ABILITY_CRIT) &&
        chance(target.critChance / 100, this)
      target.effects.delete(EffectEnum.SHELL_TRAP)
      target.broadcastAbility({ skill: "SHELL_TRAP_trigger" })
      cells.forEach((cell) => {
        if (cell.value && cell.value.team !== target.team) {
          cell.value.handleSpecialDamage(
            100,
            board,
            AttackType.SPECIAL,
            target,
            crit,
            true
          )
        }
      })
    }
  }

  // called whenever the unit deals damage, by basic attack or ability
  onDamageDealt({
    target,
    damage,
    attackType,
    isRetaliation
  }: {
    target: PokemonEntity
    damage: number
    attackType: AttackType
    isRetaliation: boolean
  }) {
    this.getEffects(OnDamageDealtEffect).forEach((effect) => {
      effect.apply({
        pokemon: this,
        target,
        damage,
        attackType,
        isRetaliation
      })
    })

    if (
      this.simulation.weather === Weather.BLOODMOON &&
      target.status.wound &&
      this.player &&
      this.player.items.includes(Item.BLOOD_STONE)
    ) {
      const nbBloodStones = count(this.player.items, Item.BLOOD_STONE)
      if (nbBloodStones > 0) {
        this.handleHeal(Math.ceil(0.2 * nbBloodStones * damage), this, 0, false)
      }
    }
  }

  onDamageReceived({
    attacker,
    damage,
    board,
    attackType,
    isRetaliation
  }: {
    attacker: PokemonEntity | null
    damage: number
    board: Board
    attackType: AttackType
    isRetaliation: boolean
  }) {
    // Berries trigger
    const berry = values(this.items).find((item) => Berries.includes(item))
    if (berry && this.hp > 0 && this.hp < 0.5 * this.maxHP) {
      this.eatBerry(berry)
    }

    // Reduce sleep duration
    if (this.status.sleepCooldown > 0) {
      this.status.sleepCooldown -= 300
    }

    // Reduce charm duration
    if (this.status.charmCooldown > 0 && attacker === this.status.charmOrigin) {
      this.status.charmCooldown -= 500
    }

    // Other effects
    this.getEffects(OnDamageReceivedEffect).forEach((effect) => {
      effect.apply({
        pokemon: this,
        attacker,
        board,
        damage,
        attackType,
        isRetaliation
      })
    })
  }

  onCriticalAttack({
    target,
    board,
    damage
  }: {
    target: PokemonEntity
    board: Board
    damage: number
  }) {
    // proc fairy splash damage for both the attacker and the target
    if (
      target.fairySplashCooldown === 0 &&
      target.hasSynergyEffect(Synergy.FAIRY)
    ) {
      let shockDamageFactor = 0.3
      if (target.effects.has(EffectEnum.AROMATIC_MIST)) {
        shockDamageFactor += 0.2
      } else if (target.effects.has(EffectEnum.FAIRY_WIND)) {
        shockDamageFactor += 0.4
      } else if (target.effects.has(EffectEnum.STRANGE_STEAM)) {
        shockDamageFactor += 0.6
      } else if (target.effects.has(EffectEnum.MOON_FORCE)) {
        shockDamageFactor += 0.8
      }

      const shockDamage = shockDamageFactor * damage
      target.count.fairyCritCount++
      target.fairySplashCooldown = 250

      const distance = distanceC(
        this.positionX,
        this.positionY,
        target.positionX,
        target.positionY
      )

      if (distance <= 1 && this.items.has(Item.PROTECTIVE_PADS) === false) {
        // melee range
        this.handleDamage({
          damage: shockDamage,
          board,
          attackType: AttackType.SPECIAL,
          attacker: target,
          isRetaliation: true,
          shouldTargetGainMana: true
        })
      }
    }

    if (this.items.has(Item.SCOPE_LENS)) {
      const ppStolen = max(target.pp)(10)
      this.addPP(ppStolen, this, 0, false)
      target.addPP(-ppStolen, this, 0, false)
      target.count.manaBurnCount++
    }

    if (this.items.has(Item.RAZOR_FANG)) {
      target.status.triggerArmorReduction(2000, target)
    }

    if (target.items.has(Item.BABIRI_BERRY)) {
      target.eatBerry(Item.BABIRI_BERRY)
    }
  }

  // called after killing an opponent (does not proc if resurrection)
  onKill({
    target,
    board,
    attackType
  }: {
    target: PokemonEntity
    board: Board
    attackType: AttackType
  }) {
    if (!this.isGhostOpponent) {
      this.refToBoardPokemon.killCount++
    }
    this.getEffects(OnKillEffect).forEach((effect) => {
      effect.apply({ attacker: this, target, board, attackType })
    })

    // cannot be moved to passive effects because it needs to work on any kill from any unit, spawn included
    board.forEach(
      (x, y, v) =>
        v &&
        v.passive === Passive.MOXIE &&
        v.team === this.team &&
        v.addAttack(target.stars, v, 0, false)
    )

    if (
      this.player &&
      this.simulation.room.state.specialGameRule ===
        SpecialGameRule.BLOOD_MONEY &&
      !target.isSpawn
    ) {
      this.player.addMoney(1, true, this)
      this.count.moneyCount += 1
    }

    if (
      target.name === Pkm.MAGIKARP &&
      target.shiny &&
      target.simulation.stageLevel === 1 &&
      this.player
    ) {
      this.player.addMoney(10, true, this)
      this.count.moneyCount += 10
    }
  }

  onDeath({
    board,
    attacker
  }: {
    board: Board
    attacker: PokemonEntity | null
  }) {
    if (!this.isGhostOpponent) {
      this.refToBoardPokemon.deathCount++
    }
    this.getEffects(OnDeathEffect).forEach((effect) =>
      effect.apply({ pokemon: this, board, attacker })
    )

    if (this.status.curseVulnerability) {
      this.simulation.applyCurse(EffectEnum.CURSE_OF_VULNERABILITY, this.team)
    }
    if (this.status.curseWeakness) {
      this.simulation.applyCurse(EffectEnum.CURSE_OF_WEAKNESS, this.team)
    }
    if (this.status.curseTorment) {
      this.simulation.applyCurse(EffectEnum.CURSE_OF_TORMENT, this.team)
    }
    if (this.status.curseFate) {
      this.simulation.applyCurse(EffectEnum.CURSE_OF_FATE, this.team)
    }

    // Trigger Last Respects ability for adjacent allies
    // When this Pokemon dies, any adjacent ally with Last Respects ability
    // immediately gains full PP to cast their ability
    board
      .getAdjacentCells(this.positionX, this.positionY)
      .filter(
        (c) =>
          c.value?.passive === Passive.LAST_RESPECTS &&
          c.value?.team === this.team
      )
      .map((c) => c.value)
      .forEach((p) => p?.addPP(p.maxPP - p.pp, p, 0, false))
  }

  flyAway(board: Board) {
    const flyAwayCell = board.getFlyAwayCell(this.positionX, this.positionY)
    if (flyAwayCell) {
      this.moveTo(flyAwayCell.x, flyAwayCell.y, board, false)
    }
  }

  applyStat(stat: Stat, value: number, permanent = false) {
    switch (stat) {
      case Stat.ATK:
        this.addAttack(value, this, 0, false, permanent)
        break
      case Stat.DEF:
        this.addDefense(value, this, 0, false, permanent)
        break
      case Stat.SPE_DEF:
        this.addSpecialDefense(value, this, 0, false, permanent)
        break
      case Stat.AP:
        this.addAbilityPower(value, this, 0, false, permanent)
        break
      case Stat.PP:
        this.addPP(value, this, 0, false)
        break
      case Stat.SPEED:
        this.addSpeed(value, this, 0, false, permanent)
        break
      case Stat.CRIT_CHANCE:
        this.addCritChance(value, this, 0, false)
        break
      case Stat.CRIT_POWER:
        this.addCritPower(value, this, 0, false)
        break
      case Stat.SHIELD:
        this.addShield(value, this, 0, false)
        break
      case Stat.HP:
        this.addMaxHP(value, this, 0, false, permanent)
        break
      case Stat.LUCK:
        this.addLuck(value, this, 0, false, permanent)
        break
      case Stat.RANGE:
        this.range = min(1)(this.range + value)
    }
  }

  resurrect() {
    this.hp = this.maxHP
    this.pp = 0
    this.status.clearNegativeStatus()

    if (this.items.has(Item.SACRED_ASH)) {
      const team =
        this.team === Team.BLUE_TEAM
          ? this.simulation.blueTeam
          : this.simulation.redTeam
      if (!team) return
      const alliesAlive: IPokemonEntity[] = values(team).filter(
        (e) => e.hp > 0 || e.status.resurrecting
      )
      let koAllies: Pokemon[] = []
      if (this.player) {
        koAllies = values(this.player.board).filter(
          (p) =>
            p.id !== this.refToBoardPokemon.id &&
            !isOnBench(p) &&
            !alliesAlive.some((ally) => ally.refToBoardPokemon.id === p.id) &&
            !(
              p.name === Pkm.COMFEY &&
              alliesAlive.some((ally) => ally.items.has(Item.COMFEY))
            ) // don't respawn comfey if an ally has it
        )
      } else if (this.name === Pkm.HO_OH) {
        // HoOh marowak pve round
        koAllies = alliesAlive.some((p) => p.name === Pkm.LUGIA)
          ? []
          : [
              PokemonFactory.createPokemonFromName(Pkm.LUGIA, {
                shiny: this.shiny,
                emotion: Emotion.ANGRY
              })
            ]
      }

      const spawns = pickNRandomIn(koAllies, 3)
      spawns.forEach((spawn) => {
        const coord = this.simulation.getClosestFreeCellToPokemonEntity(this)
        if (!coord) return
        const mon = PokemonFactory.createPokemonFromName(spawn.name, {
          emotion: spawn.emotion,
          shiny: spawn.shiny
        })
        const spawnedEntity = this.simulation.addPokemon(
          mon,
          coord.x,
          coord.y,
          this.team,
          true
        )
        spawnedEntity.shield = 0 // remove existing shield
        spawnedEntity
          .getEffects(FlyingProtectionEffect)
          .forEach((effect: FlyingProtectionEffect) => {
            effect.flyingProtection = 0 // prevent flying effects twice
          })
        SynergyEffects[Synergy.FOSSIL].forEach((e) =>
          spawnedEntity.effects.delete(e)
        )
      })
    }

    const stackingItems = [Item.MUSCLE_BAND, Item.SOUL_DEW, Item.UPGRADE]

    const removedItems = [Item.DYNAMAX_BAND, Item.SACRED_ASH, Item.MAX_REVIVE]

    stackingItems.forEach((item) => {
      if (this.items.has(item)) {
        this.removeItemEffect(item)
        this.applyItemEffect(item)
      }
    })

    removedItems.forEach((item) => {
      if (this.items.has(item)) {
        this.removeItem(item)
      }
    })

    const resetMonsterStacks = (effect: MonsterKillEffect) => {
      const attackBoost =
        MONSTER_ATTACK_BUFF_PER_SYNERGY_LEVEL[effect.synergyLevel] ??
        MONSTER_ATTACK_BUFF_PER_SYNERGY_LEVEL.at(-1)
      const apBoost =
        MONSTER_AP_BUFF_PER_SYNERGY_LEVEL[effect.synergyLevel] ??
        MONSTER_AP_BUFF_PER_SYNERGY_LEVEL.at(-1)
      this.addAttack(-effect.count * attackBoost, this, 0, false)
      this.addAbilityPower(-effect.count * apBoost, this, 0, false)
      this.addMaxHP(-effect.hpBoosted, this, 0, false)
      effect.hpBoosted = 0
      effect.count = 0
    }

    const resetFireStacks = (effect: FireHitEffect) => {
      const removalAmount = -effect.count * effect.synergyLevel
      this.addAttack(removalAmount, this, 0, false)
      effect.count = 0
    }

    const resetSoundStacks = (effect: EffectEnum) => {
      const synergyLevel = SynergyEffects[Synergy.SOUND].indexOf(effect)
      const attackBoost =
        ([2, 1, 1][synergyLevel] ?? 0) * -this.count.soundCryCount
      const speedBoost =
        ([0, 5, 5][synergyLevel] ?? 0) * -this.count.soundCryCount
      const manaBoost =
        ([0, 0, 3][synergyLevel] ?? 0) * -this.count.soundCryCount
      this.addAttack(attackBoost, this, 0, false)
      this.addSpeed(speedBoost, this, 0, false)
      this.addPP(manaBoost, this, 0, false)
      this.count.soundCryCount = 0
    }

    this.effectsSet.forEach((effect) => {
      if (effect instanceof MonsterKillEffect) {
        resetMonsterStacks(effect)
      } else if (effect instanceof FireHitEffect) {
        resetFireStacks(effect)
      } else if (effect instanceof FlyingProtectionEffect) {
        effect.flyingProtection = 0 // prevent flying effects twice
      }
    })
    const soundEffect = SynergyEffects[Synergy.SOUND].find((effect) =>
      this.player?.effects.has(effect)
    )
    if (soundEffect) {
      resetSoundStacks(soundEffect)
    }

    this.status.resurrection = false // prevent resurrecting again
    this.shield = 0 // remove existing shield
  }

  eatBerry(berry: Item, stealedFrom?: PokemonEntity, inPuffin = false) {
    const heal = (val) =>
      inPuffin
        ? this.addShield(val, this, 0, false)
        : this.handleHeal(val, this, 0, false)

    switch (berry) {
      case Item.AGUAV_BERRY:
        heal(min(50)(0.5 * this.maxHP))
        this.status.triggerConfusion(3000, this, this)
        break
      case Item.APICOT_BERRY:
        heal(50)
        this.addSpecialDefense(20, this, 0, false)
        break
      case Item.ASPEAR_BERRY:
        this.status.freeze = false
        this.status.freezeCooldown = 0
        this.effects.add(EffectEnum.IMMUNITY_FREEZE)
        heal(50)
        this.addSpeed(15, this, 0, false)
        break
      case Item.CHERI_BERRY:
        this.status.healParalysis(this)
        this.effects.add(EffectEnum.IMMUNITY_PARALYSIS)
        heal(50)
        this.addAttack(10, this, 0, false)
        break
      case Item.CHESTO_BERRY:
        this.status.sleepCooldown = 0
        this.effects.add(EffectEnum.IMMUNITY_SLEEP)
        heal(50)
        this.addAbilityPower(50, this, 0, false)
        break
      case Item.GANLON_BERRY:
        heal(50)
        this.addDefense(20, this, 0, false)
        break
      case Item.JABOCA_BERRY:
        heal(50)
        this.status.triggerSpikeArmor(10000)
        break
      case Item.LANSAT_BERRY:
        heal(50)
        this.addCritChance(50, this, 0, false)
        break
      case Item.LEPPA_BERRY:
        heal(50)
        this.addPP(50, this, 0, false)
        break
      case Item.LIECHI_BERRY:
        heal(50)
        this.addAttack(15, this, 0, false)
        break
      case Item.LUM_BERRY:
        heal(50)
        this.status.clearNegativeStatus()
        this.status.triggerRuneProtect(5000)
        break
      case Item.ORAN_BERRY:
        heal(50)
        this.addShield(80, this, 0, false)
        break
      case Item.PECHA_BERRY:
        heal(100)
        this.status.poisonOrigin = undefined
        this.status.poisonStacks = 0
        this.status.poisonDamageCooldown = 0
        this.effects.add(EffectEnum.IMMUNITY_POISON)
        break
      case Item.PERSIM_BERRY:
        this.status.confusion = false
        this.status.confusionCooldown = 0
        this.effects.add(EffectEnum.IMMUNITY_CONFUSION)
        heal(50)
        this.addSpecialDefense(10, this, 0, false)
        break
      case Item.PETAYA_BERRY:
        heal(50)
        this.addAbilityPower(80, this, 0, false)
        break
      case Item.ROWAP_BERRY:
        heal(50)
        this.status.triggerMagicBounce(10000)
        break
      case Item.RAWST_BERRY:
        this.status.healBurn(this)
        this.effects.add(EffectEnum.IMMUNITY_BURN)
        heal(50)
        this.addDefense(10, this, 0, false)
        break
      case Item.SALAC_BERRY:
        heal(50)
        this.addSpeed(50, this, 0, false)
        break
      case Item.SITRUS_BERRY:
        this.effects.add(EffectEnum.BUFF_HEAL_RECEIVED)
        heal(100)
        break
      case Item.BERRY_JUICE:
        heal(this.maxHP - this.hp)
        break
      case Item.BABIRI_BERRY:
        heal(50)
        this.status.triggerProtect(2000)
        break
    }

    if (stealedFrom) {
      stealedFrom.removeItem(berry, true)
    } else {
      this.removeItem(berry, true)
    }

    if (this.passive === Passive.GLUTTON) {
      this.applyStat(Stat.HP, 10, true)
      if (this.refToBoardPokemon.hp > 750) {
        this.player?.titles.add(Title.GLUTTON)
      }
    }

    if (this.effects.has(EffectEnum.BERRY_JUICE)) {
      this.addShield(100, this, 0, false)
    }
  }

  broadcastAbility({
    skill = this.skill,
    ap = this.ap,
    positionX = this.positionX,
    positionY = this.positionY,
    orientation = this.orientation,
    targetX = this.targetX,
    targetY = this.targetY,
    delay
  }: {
    skill?: Ability | string
    ap?: number
    positionX?: number
    positionY?: number
    orientation?: Orientation | number
    targetX?: number
    targetY?: number
    delay?: number
  }) {
    const room = this.simulation.room
    const players = room.state.players
    for (const client of room.clients) {
      const player = players.get(client.auth.uid)
      if (player && player.spectatedPlayerId) {
        const spectatedPlayer = players.get(player.spectatedPlayerId)
        if (
          spectatedPlayer &&
          spectatedPlayer.simulationId === this.simulation.id
        ) {
          client.send(Transfer.ABILITY, {
            id: this.simulation.id,
            skill,
            ap,
            positionX,
            positionY,
            orientation,
            targetX,
            targetY,
            delay
          })
        }
      }
    }
  }

  changePassive(newPassive: Passive) {
    if (this.passive === newPassive) {
      return
    }

    // remove old passive effects
    if (this.passive) {
      const oldPassiveEffects = PassiveEffects[this.passive] ?? []
      oldPassiveEffects.forEach((effect) => {
        if (effect instanceof EffectClass) {
          this.effectsSet.delete(effect)
        }
      })
    }

    // set new passive
    this.passive = newPassive

    // apply new passive effects
    const newPassiveEffects = PassiveEffects[newPassive] ?? []
    for (const effect of newPassiveEffects) {
      if (isPlainFunction(effect)) this.effectsSet.add(effect())
      else if (effect instanceof EffectClass) this.effectsSet.add(effect)
    }
  }

  getEffects<T extends new (...args: any[]) => any>(
    effectClass: T
  ): InstanceType<T>[] {
    return [...this.effectsSet.values()]
      .filter(
        (effect): effect is InstanceType<T> => effect instanceof effectClass
      )
      .sort((a, b) => b.priority - a.priority)
  }

  addStack(amount = 1) {
    if (!this.player) return
    this.refToBoardPokemon.stacks += amount
    this.stacks = this.refToBoardPokemon.stacks
    //logger.debug(`${this.name} gained a stack (${this.stacks}/${this.stacksRequired})`)
    if (this.stacks === this.stacksRequired) {
      const pokemonEvolved = this.refToBoardPokemon.evolutionRule.tryEvolve(
        this.refToBoardPokemon as Pokemon,
        this.player,
        this.simulation.stageLevel
      )
      if (pokemonEvolved) {
        // evolve mid-fight ; does not gain immediately the new stats, this will be done at the end of the fight
        this.index = pokemonEvolved.index
        this.name = pokemonEvolved.name
        this.refToBoardPokemon = pokemonEvolved
      }
    }
    return
  }
}

export function getStrongestUnit<T extends Pokemon | IPokemonEntity>(
  pokemons: T[]
): T {
  /*
    strongest is defined as:
    1) number of items
    2) stars level
    3) rarity cost
    */
  const pokemonScores = pokemons.map((pokemon) => getUnitScore(pokemon))
  const bestScore = Math.max(...pokemonScores)
  return pickRandomIn(pokemons.filter((p, i) => pokemonScores[i] === bestScore))
}

export function getUnitScore(pokemon: IPokemonEntity | IPokemon) {
  let score = 0
  score += 100 * pokemon.items.size
  score += 10 * pokemon.stars
  score += getSellPrice(pokemon, null, true)
  return score
}

export function canSell(
  pkm: Pkm,
  specialGameRule: SpecialGameRule | undefined | null
) {
  if (specialGameRule === SpecialGameRule.DITTO_PARTY && pkm === Pkm.DITTO) {
    return false
  }

  return new PokemonClasses[pkm](pkm).canBeSold
}

export function getMoveSpeed(pokemon: IPokemonEntity): number {
  // at 0 speed in normal conditions, the factor should be 0.5
  // at 100 speed, the factor should be 1.5
  // at max 300 speed, it's 3.5 = 143ms per cell
  const speed = pokemon.status.paralysis ? pokemon.speed / 2 : pokemon.speed
  return 0.5 + speed / 100
}
