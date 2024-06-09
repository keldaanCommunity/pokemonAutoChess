import { Schema, SetSchema, type } from "@colyseus/schema"
import { nanoid } from "nanoid"
import Count from "../models/colyseus-models/count"
import Player from "../models/colyseus-models/player"
import { Pokemon } from "../models/colyseus-models/pokemon"
import Status from "../models/colyseus-models/status"
import PokemonFactory from "../models/pokemon-factory"
import { getSellPrice } from "../models/shop"
import {
  AttackSprite,
  Emotion,
  IPokemon,
  IPokemonEntity,
  Title,
  Transfer
} from "../types"
import {
  ARMOR_FACTOR,
  DEFAULT_CRIT_CHANCE,
  DEFAULT_CRIT_POWER,
  MANA_SCARF_MANA,
  ON_ATTACK_MANA,
  SCOPE_LENS_MANA
} from "../types/Config"
import { Ability } from "../types/enum/Ability"
import { Effect } from "../types/enum/Effect"
import {
  AttackType,
  BoardEvent,
  Orientation,
  PokemonActionState,
  Rarity,
  Stat,
  Team
} from "../types/enum/Game"
import { Berries, Item } from "../types/enum/Item"
import { Passive } from "../types/enum/Passive"
import { Pkm, PkmIndex } from "../types/enum/Pokemon"
import { SpecialGameRule } from "../types/enum/SpecialGameRule"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"
import { Weather } from "../types/enum/Weather"
import { distanceC, distanceM } from "../utils/distance"
import { clamp, max, min, roundTo2Digits } from "../utils/number"
import { chance, pickRandomIn } from "../utils/random"
import { values } from "../utils/schemas"
import AttackingState from "./attacking-state"
import Board from "./board"
import { IdleState } from "./idle-state"
import MovingState from "./moving-state"
import PokemonState from "./pokemon-state"
import Simulation from "./simulation"

export class PokemonEntity extends Schema implements IPokemonEntity {
  @type("boolean") shiny: boolean
  @type("uint8") positionX: number
  @type("uint8") positionY: number
  @type("string") action = PokemonActionState.WALK
  @type("string") index: string
  @type("string") id: string
  @type("string") orientation = Orientation.DOWNLEFT
  @type("uint16") hp: number
  @type("uint8") pp = 0
  @type("uint8") maxPP: number
  @type("uint16") atk: number
  @type("uint16") def: number
  @type("uint16") speDef: number
  @type("uint8") attackType: AttackType
  @type("uint16") life: number
  @type("uint16") shield = 0
  @type("uint8") team: number
  @type("uint8") range: number
  @type("float32") atkSpeed: number
  @type("int8") targetX = -1
  @type("int8") targetY = -1
  @type("string") attackSprite: AttackSprite
  @type("string") rarity: Rarity
  @type("string") name: Pkm
  @type({ set: "string" }) effects = new SetSchema<Effect>()
  @type({ set: "string" }) items = new SetSchema<Item>()
  @type({ set: "string" }) types = new SetSchema<Synergy>()
  @type("uint8") stars: number
  @type("string") skill: Ability
  @type("string") passive: Passive
  @type(Status) status: Status
  @type(Count) count: Count
  @type("uint8") critChance = DEFAULT_CRIT_CHANCE
  @type("float32") critPower = DEFAULT_CRIT_POWER
  @type("int16") ap = 0
  @type("uint16") healDone: number
  @type("string") emotion: Emotion
  cooldown = 500
  oneSecondCooldown = 1000
  state: PokemonState
  simulation: Simulation
  baseAtk: number
  baseDef: number
  baseSpeDef: number
  baseRange: number
  dodge: number
  physicalDamage: number
  specialDamage: number
  trueDamage: number
  shieldDone: number
  flyingProtection = 0
  growGroundTimer = 3000
  grassHealCooldown = 2000
  sandstormDamageTimer = 0
  fairySplashCooldown = 0
  echo = 0
  isClone = false
  refToBoardPokemon: IPokemon

  constructor(
    pokemon: IPokemon,
    positionX: number,
    positionY: number,
    team: number,
    simulation: Simulation
  ) {
    super()
    this.state = new MovingState()
    this.effects = new SetSchema()
    this.items = new SetSchema()
    this.refToBoardPokemon = pokemon
    pokemon.items.forEach((it) => {
      this.items.add(it)
    })
    this.status = new Status()
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
    this.atk = pokemon.atk
    this.def = pokemon.def
    this.speDef = pokemon.speDef
    this.attackType = pokemon.attackType
    this.hp = pokemon.hp
    this.maxPP = pokemon.maxPP
    this.life = pokemon.hp
    this.atkSpeed = pokemon.atkSpeed
    this.range = pokemon.range
    this.team = team
    this.attackSprite = pokemon.attackSprite
    this.stars = pokemon.stars
    this.skill = pokemon.skill
    this.passive = pokemon.passive
    this.shiny = pokemon.shiny
    this.emotion = pokemon.emotion

    this.dodge = 0
    this.physicalDamage = 0
    this.specialDamage = 0
    this.trueDamage = 0
    this.healDone = 0
    this.shieldDone = 0

    pokemon.types.forEach((type) => {
      this.types.add(type)
    })

    if (
      this.passive === Passive.SUDOWOODO ||
      this.passive === Passive.WOBBUFFET
    ) {
      this.status.tree = true
      this.toIdleState()
    }
  }

  update(
    dt: number,
    board: Board,
    weather: Weather,
    player: Player | undefined
  ) {
    this.state.update(this, dt, board, weather, player)
  }

  getAttackDelay() {
    return 1000 / this.atkSpeed
  }

  get canMove(): boolean {
    return !this.status.freeze && !this.status.sleep && !this.status.resurecting
  }

  get isTargettable(): boolean {
    return !this.status.resurecting
  }

  get player(): Player | undefined {
    return this.team === Team.BLUE_TEAM
      ? this.simulation.bluePlayer
      : this.simulation.redPlayer
  }

  get inLightCell(): boolean {
    if (!this.player) return false
    const { lightX, lightY } = this.player
    if (this.team === Team.BLUE_TEAM) {
      return this.positionX === lightX && this.positionY === lightY - 1
    } else {
      return this.positionX === lightX && this.positionY === 5 - (lightY - 1)
    }
  }

  hasSynergyEffect(synergy: Synergy): boolean {
    return SynergyEffects[synergy].some((effect) => this.effects.has(effect))
  }

  handleDamage(params: {
    damage: number
    board: Board
    attackType: AttackType
    attacker: PokemonEntity | null
    shouldTargetGainMana: boolean
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
        damage > 0
      ) {
        const bounceCrit =
          crit || (this.items.has(Item.REAPER_CLOTH) && chance(this.critChance))
        const bounceDamage = Math.round(
          ([0.5, 1][this.stars - 1] ?? 1) *
            damage *
            (1 + this.ap / 100) *
            (bounceCrit ? this.critPower : 1)
        )
        // not handleSpecialDamage to not trigger infinite loop between two magic bounces
        attacker?.handleDamage({
          damage: bounceDamage,
          board,
          attackType: AttackType.SPECIAL,
          attacker: this,
          shouldTargetGainMana: true
        })
      }
      return { death: false, takenDamage: 0 }
    } else {
      let specialDamage =
        damage + (damage * (attacker && apBoost ? attacker.ap : 0)) / 100
      if (attacker && attacker.status.doubleDamage) {
        specialDamage *= 2
        attacker.status.doubleDamage = false
      }
      if (crit && attacker && this.items.has(Item.ROCKY_HELMET) === false) {
        specialDamage = Math.round(specialDamage * attacker.critPower)
      }
      if (
        attacker &&
        attacker.items.has(Item.POKEMONOMICON) &&
        attackType === AttackType.SPECIAL
      ) {
        this.status.triggerBurn(3000, this, attacker)
        this.status.triggerWound(3000, this, attacker)
      }
      if (
        this.items.has(Item.POWER_LENS) &&
        specialDamage >= 1 &&
        attacker &&
        attackType === AttackType.SPECIAL
      ) {
        attacker.handleDamage({
          damage: Math.round(specialDamage / (1 + ARMOR_FACTOR * this.speDef)),
          board,
          attackType: AttackType.SPECIAL,
          attacker: this,
          shouldTargetGainMana: true
        })
      }
      return this.state.handleDamage({
        target: this,
        damage: specialDamage,
        board,
        attackType,
        attacker,
        shouldTargetGainMana: true
      })
    }
  }

  handleHeal(
    heal: number,
    caster: IPokemonEntity,
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
    this.changeState(new MovingState())
  }

  toAttackingState() {
    this.changeState(new AttackingState())
  }

  toIdleState() {
    this.changeState(new IdleState())
  }

  addPP(value: number, caster: IPokemonEntity, apBoost: number, crit: boolean) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )

    if (
      !this.status.silence &&
      !this.status.protect &&
      !this.status.resurecting &&
      !(value < 0 && this.status.tree) // cannot lose PP if tree
    ) {
      this.pp = clamp(this.pp + value, 0, this.maxPP)
    }
  }

  addCritChance(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )

    // for every 5% crit chance > 100, +0.1 crit power
    this.critChance += value

    if (this.critChance > 100) {
      const overCritChance = Math.round(this.critChance - 100)
      this.addCritPower(overCritChance / 50, this, 0, false)
      this.critChance = 100
    }
  }

  addCritPower(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    
    this.critPower = Math.max(0, roundTo2Digits(this.critPower + value))
  }

  addMaxHP(value: number) {
    this.hp = min(1)(this.hp + value)
    this.life = max(this.hp)(this.life + value)
  }

  addDodgeChance(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    this.dodge = max(0.9)(this.dodge + value)
  }

  addAbilityPower(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    this.ap = min(-100)(this.ap + value)
  }

  addDefense(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    this.def = min(0)(this.def + value)
  }

  addSpecialDefense(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    this.speDef = min(0)(this.speDef + value)
  }

  addAttack(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    this.atk = min(1)(this.atk + value)
  }

  addAttackSpeed(
    value: number,
    caster: IPokemonEntity,
    apBoost: number,
    crit: boolean
  ) {
    value = Math.round(
      value * (1 + (apBoost * caster.ap) / 100) * (crit ? caster.critPower : 1)
    )
    const currentAtkSpeedBonus = 100 * (this.atkSpeed / 0.75 - 1)
    const atkSpeedBonus = currentAtkSpeedBonus + value
    this.atkSpeed = clamp(
      roundTo2Digits(0.75 * (1 + atkSpeedBonus / 100)),
      0.4,
      2.5
    )
  }

  addPsychicField() {
    this.status.psychicField = true
    if (this.passive === Passive.SURGE_SURFER) {
      this.addAttackSpeed(30, this, 0, false)
    }
  }

  removePsychicField() {
    this.status.psychicField = false
    if (this.passive === Passive.SURGE_SURFER) {
      this.addAttackSpeed(-30, this, 0, false)
    }
  }

  addElectricField() {
    this.status.electricField = true
    if (this.passive === Passive.SURGE_SURFER) {
      this.addAttackSpeed(30, this, 0, false)
    }
  }

  removeElectricField() {
    this.status.electricField = false
    if (this.passive === Passive.SURGE_SURFER) {
      this.addAttackSpeed(-30, this, 0, false)
    }
  }

  moveTo(x: number, y: number, board: Board) {
    board.swapValue(this.positionX, this.positionY, x, y)
    this.toMovingState()
    this.cooldown = 100 // for faster retargeting
  }

  skydiveTo(x: number, y: number, board: Board) {
    board.swapValue(this.positionX, this.positionY, x, y)
    this.status.skydiving = true
    this.toMovingState()
    this.cooldown = 1000 // 500ms for flying up and 500ms for skydive anim
  }

  // called after every attack, no matter if it's successful or not
  onAttack({
    target,
    board,
    physicalDamage,
    specialDamage,
    trueDamage,
    totalDamage
  }: {
    target: PokemonEntity
    board: Board
    physicalDamage: number
    specialDamage: number
    trueDamage: number
    totalDamage: number
  }) {
    this.addPP(ON_ATTACK_MANA, this, 0, false)

    if (this.items.has(Item.BLUE_ORB)) {
      this.count.staticHolderCount++
      if (this.count.staticHolderCount > 2) {
        this.count.staticHolderCount = 0
        // eslint-disable-next-line no-unused-vars

        const nbBounces = 3
        const closestEnemies = new Array<PokemonEntity>()
        board.forEach(
          (x: number, y: number, enemy: PokemonEntity | undefined) => {
            if (enemy && this.team !== enemy.team) {
              closestEnemies.push(enemy)
            }
          }
        )
        closestEnemies.sort((a, b) => {
          const distanceA = distanceC(
            a.positionX,
            a.positionY,
            this.positionX,
            this.positionY
          )
          const distanceB = distanceC(
            b.positionX,
            b.positionY,
            this.positionX,
            this.positionY
          )
          return distanceA - distanceB
        })

        let previousTg: PokemonEntity = this
        let tg: PokemonEntity | undefined = target

        for (let i = 0; i < nbBounces; i++) {
          tg = closestEnemies[i]
          if (tg) {
            this.simulation.room.broadcast(Transfer.ABILITY, {
              id: this.simulation.id,
              skill: "LINK_CABLE_link",
              positionX: previousTg.positionX,
              positionY: previousTg.positionY,
              targetX: tg.positionX,
              targetY: tg.positionY
            })
            tg.handleSpecialDamage(10, board, AttackType.SPECIAL, this, false)
            tg.addPP(-20, this, 0, false)
            tg.count.manaBurnCount++
            previousTg = tg
          } else {
            break
          }
        }
      }
    }

    if (
      this.name === Pkm.MINIOR_KERNEL_BLUE ||
      this.name === Pkm.MINIOR_KERNEL_GREEN ||
      this.name === Pkm.MINIOR_KERNEL_RED ||
      this.name === Pkm.MINIOR_KERNEL_ORANGE
    ) {
      const cells = board.getAdjacentCells(target.positionX, target.positionY)
      const targets = cells
        .filter((cell) => cell.value && this.team != cell.value.team)
        .map((cell) => cell.value!)
        .concat(target)
      targets.forEach((t) => {
        this.simulation.room.broadcast(Transfer.ABILITY, {
          id: this.simulation.id,
          skill: Ability.SHIELDS_DOWN,
          targetX: t.positionX,
          targetY: t.positionY
        })
        if (this.name === Pkm.MINIOR_KERNEL_BLUE) {
          t.handleDamage({
            damage: physicalDamage,
            board,
            attackType: AttackType.SPECIAL,
            attacker: this,
            shouldTargetGainMana: false
          })
        }
        if (this.name === Pkm.MINIOR_KERNEL_RED) {
          t.handleDamage({
            damage: Math.ceil(physicalDamage * 1.5),
            board,
            attackType: AttackType.PHYSICAL,
            attacker: this,
            shouldTargetGainMana: false
          })
        }
        if (this.name === Pkm.MINIOR_KERNEL_ORANGE) {
          t.handleDamage({
            damage: Math.ceil(physicalDamage * 0.5),
            board,
            attackType: AttackType.TRUE,
            attacker: this,
            shouldTargetGainMana: false
          })
        }
      })
      if (this.name === Pkm.MINIOR_KERNEL_GREEN) {
        cells.forEach((v) => {
          if (v && v.value && v.value.team === this.team) {
            v.value.handleHeal(physicalDamage, this, 0, false)
          }
        })
      }
    }

    if (this.items.has(Item.CHOICE_SCARF) && totalDamage > 0) {
      const cells = board.getAdjacentCells(target.positionX, target.positionY)
      const candidateTargets = cells
        .filter((cell) => cell.value && this.team != cell.value.team)
        .map((cell) => cell.value!)
      candidateTargets.sort((a, b) => a.life - b.life) // target lowest life first

      let targetCount = 1
      candidateTargets.forEach((target) => {
        if (targetCount > 0) {
          if (physicalDamage > 0) {
            target.handleDamage({
              damage: Math.ceil(0.5 * physicalDamage),
              board,
              attackType: AttackType.PHYSICAL,
              attacker: this,
              shouldTargetGainMana: true
            })
          }
          if (specialDamage > 0) {
            target.handleDamage({
              damage: Math.ceil(0.5 * specialDamage),
              board,
              attackType: AttackType.SPECIAL,
              attacker: this,
              shouldTargetGainMana: true
            })
          }
          if (trueDamage > 0) {
            target.handleDamage({
              damage: Math.ceil(0.5 * trueDamage),
              board,
              attackType: AttackType.TRUE,
              attacker: this,
              shouldTargetGainMana: true
            })
          }

          targetCount--
        }
      })
    }

    if (this.items.has(Item.SOOTHE_BELL)) {
      let closestAlly: PokemonEntity | null = null
      let minDistance = 16
      board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
        if (ally && ally !== this && this.team === ally.team) {
          const distanceToTarget = distanceC(
            ally.positionX,
            ally.positionY,
            this.targetX,
            this.targetY
          )
          if (distanceToTarget < minDistance) {
            closestAlly = ally
            minDistance = distanceToTarget
          }
        }
      })

      if (closestAlly != null) {
        const closestAllyFound = closestAlly as PokemonEntity // typescript is dumb
        const shield = Math.round(totalDamage * 0.33)
        closestAllyFound.addShield(shield, this, 0, false)
      }
    }

    if (this.items.has(Item.MANA_SCARF)) {
      this.addPP(MANA_SCARF_MANA, this, 0, false)
    }

    if (this.effects.has(Effect.TELEPORT_NEXT_ATTACK)) {
      const crit =
        this.items.has(Item.REAPER_CLOTH) && chance(this.critChance / 100)
      target.handleSpecialDamage(
        [15, 30, 60][this.stars - 1],
        board,
        AttackType.SPECIAL,
        this,
        crit
      )
      this.effects.delete(Effect.TELEPORT_NEXT_ATTACK)
    }

    if (this.effects.has(Effect.SHADOW_PUNCH_NEXT_ATTACK)) {
      const crit =
        this.items.has(Item.REAPER_CLOTH) && chance(this.critChance / 100)
      target.handleSpecialDamage(
        [30, 60, 120][this.stars - 1],
        board,
        AttackType.SPECIAL,
        this,
        crit
      )
      this.effects.delete(Effect.SHADOW_PUNCH_NEXT_ATTACK)
    }

    if (this.passive === Passive.SHARED_VISION) {
      board.forEach((x: number, y: number, ally: PokemonEntity | undefined) => {
        if (
          ally &&
          ally.passive === Passive.SHARED_VISION &&
          this.team === ally.team
        ) {
          ally.targetX = this.targetX
          ally.targetY = this.targetY
        }
      })
    }
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

    if (this.name === Pkm.MINIOR) {
      this.addAttackSpeed(4, this, 1, false)
    }

    if (this.passive === Passive.DREAM_CATCHER && target.status.sleep) {
      const allies = board.cells.filter(
        (p) => p && p.team === this.team && p.id !== this.id
      ) as PokemonEntity[]
      const alliesHit = allies
        .sort(
          (a, b) =>
            distanceM(
              a.positionX,
              a.positionY,
              this.positionX,
              this.positionY
            ) -
            distanceM(b.positionX, b.positionY, this.positionX, this.positionY)
        )
        .slice(0, 2)

      alliesHit.forEach((ally) => {
        ally.addShield(10, ally, 1, false)
        ally.simulation.room.broadcast(Transfer.ABILITY, {
          id: ally.simulation.id,
          skill: Ability.MOON_DREAM,
          positionX: ally.positionX,
          positionY: ally.positionY
        })
      })
    }

    if (this.items.has(Item.UPGRADE)) {
      this.addAttackSpeed(5, this, 0, false)
      this.count.upgradeCount++
    }

    if (this.items.has(Item.MAGMARIZER)) {
      this.addAttack(1, this, 0, false)
      target.status.triggerBurn(2000, target, this)
      this.count.magmarizerCount++
    }

    if (this.items.has(Item.ELECTIRIZER)) {
      this.status.triggerParalysis(2000, this)
      target.status.triggerParalysis(2000, target)
    }

    if (target.items.has(Item.INCENSE) && chance(15 / 100)) {
      this.status.triggerCharm(2000, target, this)
    }

    // Synergy effects on hit

    if (this.types.has(Synergy.ICE)) {
      let freezeChance = 0
      if (this.effects.has(Effect.CHILLY)) {
        freezeChance = 0.1
      } else if (this.effects.has(Effect.FROSTY)) {
        freezeChance = 0.2
      } else if (this.effects.has(Effect.FREEZING)) {
        freezeChance = 0.3
      } else if (this.effects.has(Effect.SHEER_COLD)) {
        freezeChance = 0.4
      }
      if (chance(freezeChance)) {
        target.status.triggerFreeze(2000, target)
      }
    }

    if (this.hasSynergyEffect(Synergy.FIRE)) {
      let burnChance = 0
      if (this.effects.has(Effect.BLAZE)) {
        burnChance = 0.3
      } else if (this.effects.has(Effect.VICTORY_STAR)) {
        burnChance = 0.4
        this.addAttack(1, this, 0, false)
      } else if (this.effects.has(Effect.DROUGHT)) {
        burnChance = 0.5
        this.addAttack(2, this, 0, false)
      } else if (this.effects.has(Effect.DESOLATE_LAND)) {
        burnChance = 1
        this.addAttack(3, this, 0, false)
      }
      if (chance(burnChance)) {
        target.status.triggerBurn(2000, target, this)
      }
    }

    if (this.hasSynergyEffect(Synergy.MONSTER)) {
      let flinchChance = 0
      if (this.effects.has(Effect.PURSUIT)) {
        flinchChance = 0.3
      } else if (this.effects.has(Effect.BRUTAL_SWING)) {
        flinchChance = 0.4
      } else if (this.effects.has(Effect.POWER_TRIP)) {
        flinchChance = 0.5
      }
      if (chance(flinchChance)) {
        target.status.triggerFlinch(3000, target, this)
      }
    }

    if (this.hasSynergyEffect(Synergy.GHOST)) {
      if (chance(0.25)) {
        target.status.triggerSilence(2000, target, this)
      }
    }

    let poisonChance = 0
    if (this.effects.has(Effect.POISONOUS)) {
      poisonChance = 0.3
    }
    if (this.effects.has(Effect.VENOMOUS)) {
      poisonChance = 0.6
    }
    if (this.effects.has(Effect.TOXIC)) {
      poisonChance = 1.0
    }
    if (poisonChance > 0 && chance(poisonChance)) {
      target.status.triggerPoison(4000, target, this)
    }

    if (this.types.has(Synergy.WILD)) {
      const woundChance = 0.25
      if (chance(woundChance)) {
        target.status.triggerWound(3000, target, this)
      }
    }

    // Ability effects on hit
    if (target.status.spikeArmor && this.range === 1) {
      this.status.triggerWound(2000, this, target)
      this.handleDamage({
        damage: Math.round(target.def * (1 + target.ap / 100)),
        board,
        attackType: AttackType.SPECIAL,
        attacker: target,
        shouldTargetGainMana: true
      })
    }

    if (target.effects.has(Effect.SHELL_TRAP) && physicalDamage > 0) {
      const cells = board.getAdjacentCells(target.positionX, target.positionY)
      const crit =
        target.items.has(Item.REAPER_CLOTH) && chance(target.critChance)
      target.effects.delete(Effect.SHELL_TRAP)
      this.simulation.room.broadcast(Transfer.ABILITY, {
        id: this.simulation.id,
        skill: "SHELL_TRAP_trigger",
        positionX: target.positionX,
        positionY: target.positionX,
        orientation: target.orientation
      })
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
  onDamageDealt({ target, damage }: { target: PokemonEntity; damage: number }) {
    if (this.hasSynergyEffect(Synergy.HUMAN)) {
      let lifesteal = 0
      if (this.effects.has(Effect.MEDITATE)) {
        lifesteal = 0.15
      } else if (this.effects.has(Effect.FOCUS_ENERGY)) {
        lifesteal = 0.3
      } else if (this.effects.has(Effect.CALM_MIND)) {
        lifesteal = 0.6
      }
      this.handleHeal(Math.ceil(lifesteal * damage), this, 0, false)
    }

    if (this.items.has(Item.SHELL_BELL)) {
      this.handleHeal(Math.ceil(0.33 * damage), this, 0, false)
    }
  }

  onDamageReceived({
    attacker,
    damage,
    board
  }: {
    attacker: PokemonEntity | null
    damage: number
    board: Board
  }) {
    // Items effects
    if (
      this.items.has(Item.DEFENSIVE_RIBBON) &&
      this.count.defensiveRibbonCount < 20 &&
      damage > 0
    ) {
      this.count.defensiveRibbonCount++
      if (this.count.defensiveRibbonCount % 2 === 0) {
        this.addAttack(1, this, 0, false)
        this.addDefense(1, this, 0, false)
        this.addAttackSpeed(5, this, 0, false)
      }
    }

    if (
      this.items.has(Item.SMOKE_BALL) &&
      this.life > 0 &&
      this.life < 0.33 * this.hp
    ) {
      const cells = board.getAdjacentCells(this.positionX, this.positionY)
      cells.forEach((cell) => {
        const index = cell.y * board.columns + cell.x
        if (board.effects[index] !== Effect.GAS) {
          board.effects[index] = Effect.GAS
          this.simulation.room.broadcast(Transfer.BOARD_EVENT, {
            simulationId: this.simulation.id,
            type: BoardEvent.GAS,
            x: cell.x,
            y: cell.y
          })
        }
        if (cell.value) {
          cell.value.effects.add(Effect.GAS)
          if (cell.value.team !== this.team) {
            cell.value.status.triggerParalysis(3000, cell.value)
          }
        }
      })
      this.items.delete(Item.SMOKE_BALL)
      this.flyAway(board)
    }

    // Flying protection
    if (
      this.flyingProtection > 0 &&
      this.life > 0 &&
      this.canMove &&
      !this.status.paralysis
    ) {
      const pcLife = this.life / this.hp

      if (this.effects.has(Effect.TAILWIND) && pcLife < 0.2) {
        this.flyAway(board)
        this.flyingProtection--
      } else if (this.effects.has(Effect.FEATHER_DANCE) && pcLife < 0.2) {
        this.status.triggerProtect(2000)
        this.flyAway(board)
        this.flyingProtection--
      } else if (this.effects.has(Effect.MAX_AIRSTREAM)) {
        if (
          (this.flyingProtection === 2 && pcLife < 0.5) ||
          (this.flyingProtection === 1 && pcLife < 0.2)
        ) {
          this.status.triggerProtect(2000)
          this.flyAway(board)
          this.flyingProtection--
        }
      } else if (this.effects.has(Effect.SKYDIVE)) {
        if (
          (this.flyingProtection === 2 && pcLife < 0.5) ||
          (this.flyingProtection === 1 && pcLife < 0.2)
        ) {
          const destination =
            this.state.getFarthestTargetCoordinateAvailablePlace(this, board)
          if (destination) {
            this.status.triggerProtect(2000)
            this.simulation.room.broadcast(Transfer.ABILITY, {
              id: this.simulation.id,
              skill: "FLYING_TAKEOFF",
              positionX: this.positionX,
              positionY: this.positionY,
              targetX: destination.target.positionX,
              targetY: destination.target.positionY
            })
            this.skydiveTo(destination.x, destination.y, board)
            this.flyingProtection--
            setTimeout(() => {
              this.simulation.room.broadcast(Transfer.ABILITY, {
                id: this.simulation.id,
                skill: "FLYING_SKYDIVE",
                positionX: destination.x,
                positionY: destination.y,
                targetX: destination.target.positionX,
                targetY: destination.target.positionY
              })
            }, 500)

            setTimeout(() => {
              if (destination.target?.hp > 0) {
                destination.target.handleSpecialDamage(
                  1.5 * this.atk,
                  board,
                  AttackType.PHYSICAL,
                  this,
                  chance(this.critChance)
                )
              }
            }, 1000)
          }
        }
      }
    }

    // Fighting knockback
    if (
      this.count.fightingBlockCount > 0 &&
      this.count.fightingBlockCount % 10 === 0 &&
      distanceC(this.positionX, this.positionY, this.targetX, this.targetY) ===
        1
    ) {
      const targetAtContact = board.getValue(this.targetX, this.targetY)
      const destination = this.state.getAvailablePlaceCoordinatesInRange(
        this,
        board,
        4
      )
      if (destination && targetAtContact) {
        targetAtContact.shield = 0
        targetAtContact.handleDamage({
          damage: this.atk,
          board,
          attackType: AttackType.PHYSICAL,
          attacker: this,
          shouldTargetGainMana: true
        })
        targetAtContact.moveTo(destination.x, destination.y, board)
      }
    }

    // Berries trigger
    const berry = values(this.items).find(
      (item) => Berries.includes(item) || item === Item.BERRY_JUICE
    )
    if (berry && this.life > 0 && this.life < 0.5 * this.hp) {
      this.eatBerry(berry)
    }

    // Reduce sleep duration
    if (this.status.sleepCooldown > 0) {
      this.status.sleepCooldown -= 500
    }

    // Reduce charm duration
    if (this.status.charmCooldown > 0 && attacker === this.status.charmOrigin) {
      this.status.charmCooldown -= 500
    }

    // Other passives
    if (this.passive === Passive.MIMIKYU && this.life / this.hp < 0.5) {
      this.index = PkmIndex[Pkm.MIMIKYU_BUSTED]
      this.name = Pkm.MIMIKYU_BUSTED
      this.passive = Passive.MIMIKYU_BUSTED
      this.addAttackSpeed(30, this, 0, false)
      this.status.triggerProtect(2000)
    }
  }

  onCriticalAttack({ target, board }: { target: PokemonEntity; board: Board }) {
    target.count.crit++

    // proc fairy splash damage for both the attacker and the target
    ;[this, target].forEach((pokemon) => {
      if (
        pokemon.fairySplashCooldown === 0 &&
        (pokemon.effects.has(Effect.FAIRY_WIND) ||
          pokemon.effects.has(Effect.STRANGE_STEAM) ||
          pokemon.effects.has(Effect.AROMATIC_MIST) ||
          pokemon.effects.has(Effect.MOON_FORCE))
      ) {
        let damage = 0
        if (pokemon.effects.has(Effect.AROMATIC_MIST)) {
          damage = 15
        } else if (pokemon.effects.has(Effect.FAIRY_WIND)) {
          damage = 30
        } else if (pokemon.effects.has(Effect.STRANGE_STEAM)) {
          damage = 50
        } else if (pokemon.effects.has(Effect.MOON_FORCE)) {
          damage = 70
        }

        const isCritReceived = pokemon === target
        const splashTarget = isCritReceived ? this : target
        const distance = distanceC(
          pokemon.positionX,
          pokemon.positionY,
          splashTarget.positionX,
          splashTarget.positionY
        )

        pokemon.count.fairyCritCount++
        pokemon.fairySplashCooldown = 1

        const hasEyeContact =
          pokemon.targetX === target.positionX &&
          pokemon.targetY === target.positionY &&
          target.targetX === pokemon.positionX &&
          target.targetY === pokemon.positionY

        if (distance <= 1) {
          // melee range
          splashTarget.handleSpecialDamage(
            damage,
            board,
            AttackType.SPECIAL,
            pokemon,
            false
          )
        }

        if (hasEyeContact) {
          splashTarget.status.triggerCharm(2000, splashTarget, pokemon)
        }
      }
    })

    if (this.items.has(Item.SCOPE_LENS)) {
      this.addPP(SCOPE_LENS_MANA, this, 0, false)
      target.addPP(-SCOPE_LENS_MANA, this, 0, false)
      target.count.manaBurnCount++
    }

    if (this.items.has(Item.RAZOR_FANG)) {
      target.status.triggerArmorReduction(4000, target)
    }

    if (target.items.has(Item.BABIRI_BERRY)) {
      target.status.triggerProtect(2000)
      target.handleHeal(20, target, 0, false)
      target.items.delete(Item.BABIRI_BERRY)
      target.refToBoardPokemon.items.delete(Item.BABIRI_BERRY)
    }
  }

  // called after killing an opponent (does not proc if resurection)
  onKill({ target, board }: { target: PokemonEntity; board: Board }) {
    if (this.passive === Passive.SOUL_HEART) {
      this.addPP(10, this, 0, false)
      this.addAbilityPower(10, this, 0, false)
    }

    if (this.items.has(Item.AMULET_COIN) && this.player) {
      this.player.money += 1
      this.count.moneyCount += 1
      this.count.amuletCoinCount += 1
    }
    if (
      this.effects.has(Effect.PURSUIT) ||
      this.effects.has(Effect.BRUTAL_SWING) ||
      this.effects.has(Effect.POWER_TRIP)
    ) {
      const isPursuit = this.effects.has(Effect.PURSUIT)
      const isBrutalSwing = this.effects.has(Effect.BRUTAL_SWING)
      const isPowerTrip = this.effects.has(Effect.POWER_TRIP)

      if (isPursuit || isBrutalSwing || isPowerTrip) {
        let lifeBoost = 0,
          attackBoost = 0,
          apBoost = 0
        if (isPursuit) {
          lifeBoost = 30
          attackBoost = 3
          apBoost = 10
        } else if (isBrutalSwing) {
          lifeBoost = 60
          attackBoost = 6
          apBoost = 20
        } else if (isPowerTrip) {
          lifeBoost = 100
          attackBoost = 10
          apBoost = 30
        }
        if (this.life > 0) {
          this.addMaxHP(lifeBoost)
          this.addAttack(attackBoost, this, 0, false)
          this.addAbilityPower(apBoost, this, 0, false)
        }
      }
    }

    if (this.passive === Passive.BEAST_BOOST_ATK) {
      this.addAttack(5, this, 0, false)
    }
    if (this.passive === Passive.BEAST_BOOST_AP) {
      this.addAbilityPower(10, this, 0, false)
    }

    board.forEach(
      (x, y, v) =>
        v &&
        v.passive === Passive.MOXIE &&
        v.team === this.team &&
        v.addAttack(target.stars, v, 0, false)
    )

    if (
      target.effects.has(Effect.ODD_FLOWER) ||
      target.effects.has(Effect.GLOOM_FLOWER) ||
      target.effects.has(Effect.VILE_FLOWER) ||
      target.effects.has(Effect.SUN_FLOWER)
    ) {
      if (!target.simulation.flowerSpawn[target.team]) {
        target.simulation.flowerSpawn[target.team] = true
        const spawnSpot = this.state.getFarthestTargetCoordinateAvailablePlace(
          target,
          board
        )
        if (spawnSpot) {
          let flowerSpawnName = Pkm.ODDISH
          if (target.effects.has(Effect.GLOOM_FLOWER)) {
            flowerSpawnName = Pkm.GLOOM
          } else if (target.effects.has(Effect.VILE_FLOWER)) {
            flowerSpawnName = Pkm.VILEPLUME
          } else if (target.effects.has(Effect.SUN_FLOWER)) {
            flowerSpawnName = Pkm.BELLOSSOM
          }

          target.simulation.addPokemon(
            PokemonFactory.createPokemonFromName(
              flowerSpawnName,
              target.player
            ),
            spawnSpot.x,
            spawnSpot.y,
            target.team,
            true
          )
        }
      }

      const floraSpawn = board.cells.find(
        (entity) =>
          entity &&
          entity.team === target.team &&
          [Pkm.ODDISH, Pkm.GLOOM, Pkm.VILEPLUME, Pkm.BELLOSSOM].includes(
            entity.name
          )
      )
      const randomItem = pickRandomIn(
        values(target.items).filter((item) => item !== Item.COMFEY)
      )
      if (floraSpawn && randomItem && floraSpawn.items.size < 3) {
        floraSpawn.items.add(randomItem)
        floraSpawn.simulation.applyItemEffect(floraSpawn, randomItem)
        target.items.delete(randomItem)
      }
    }

    if (target.items.has(Item.COMFEY)) {
      const nearestAvailableCoordinate =
        this.state.getNearestTargetCoordinateAvailablePlace(target, board)
      if (nearestAvailableCoordinate) {
        target.simulation.addPokemon(
          PokemonFactory.createPokemonFromName(Pkm.COMFEY, target.player),
          nearestAvailableCoordinate.x,
          nearestAvailableCoordinate.y,
          target.team
        )
      }
    }

    if (this.passive === Passive.GRIM_NEIGH) {
      this.addAbilityPower(30, this, 0, false)
    }
  }

  // called after death (does not proc if resurection)
  onDeath({ board }: { board: Board }) {
    const isWorkUp = this.effects.has(Effect.BULK_UP)
    const isRage = this.effects.has(Effect.RAGE)
    const isAngerPoint = this.effects.has(Effect.ANGER_POINT)

    if (isWorkUp || isRage || isAngerPoint) {
      const heal = 30
      let speedBoost = 0
      if (isWorkUp) {
        speedBoost = 20
      } else if (isRage) {
        speedBoost = 25
      } else if (isAngerPoint) {
        speedBoost = 30
      }
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const _pokemon = this // beware of closure vars
      this.simulation.room.clock.setTimeout(() => {
        board.forEach((x, y, value) => {
          if (
            value &&
            value.team == _pokemon.team &&
            value.types.has(Synergy.FIELD)
          ) {
            value.count.fieldCount++
            value.handleHeal(heal, _pokemon, 0, false)
            value.addAttackSpeed(speedBoost, value, 0, false)
          }
        })
      }, 16) // delay to next tick, targeting 60 ticks per second
    }

    if (this.status.curseVulnerability) {
      this.simulation.applyCurse(Effect.CURSE_OF_VULNERABILITY, this.team)
    }
    if (this.status.curseWeakness) {
      this.simulation.applyCurse(Effect.CURSE_OF_WEAKNESS, this.team)
    }
    if (this.status.curseTorment) {
      this.simulation.applyCurse(Effect.CURSE_OF_TORMENT, this.team)
    }
    if (this.status.curseFate) {
      this.simulation.applyCurse(Effect.CURSE_OF_FATE, this.team)
    }

    if (this.passive === Passive.CORSOLA && this.player) {
      const galarCorsola = this.refToBoardPokemon.evolutionRule.evolve(
        this.refToBoardPokemon as Pokemon,
        this.player,
        this.simulation.stageLevel
      )
      galarCorsola.evolutionRule.tryEvolve(
        galarCorsola,
        this.player,
        this.simulation.stageLevel
      )
    }
  }

  flyAway(board: Board) {
    const flyAwayCell = board.getFlyAwayCell(this.positionX, this.positionY)
    if (flyAwayCell) {
      this.moveTo(flyAwayCell.x, flyAwayCell.y, board)
    }
  }

  applyStat(stat: Stat, value: number) {
    switch (stat) {
      case Stat.ATK:
        this.addAttack(value, this, 0, false)
        break
      case Stat.DEF:
        this.addDefense(value, this, 0, false)
        break
      case Stat.SPE_DEF:
        this.addSpecialDefense(value, this, 0, false)
        break
      case Stat.AP:
        this.addAbilityPower(value, this, 0, false)
        break
      case Stat.PP:
        this.addPP(value, this, 0, false)
        break
      case Stat.ATK_SPEED:
        this.addAttackSpeed(value, this, 0, false)
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
        this.addMaxHP(value)
        break
    }
  }

  resurrect() {
    const cloneForStatsReference = PokemonFactory.createPokemonFromName(
      this.name
    )
    this.life = cloneForStatsReference.hp
    this.shield = 0
    this.pp = 0
    this.ap = 0
    this.atk = cloneForStatsReference.atk
    this.def = cloneForStatsReference.def
    this.speDef = cloneForStatsReference.speDef
    this.atkSpeed = cloneForStatsReference.atkSpeed
    this.critChance = DEFAULT_CRIT_CHANCE
    this.critPower = DEFAULT_CRIT_POWER
    this.count = new Count()
    this.status.clearNegativeStatus()
    this.effects.clear()
    this.simulation.applySynergyEffects(this)
    this.simulation.applyItemsEffects(this)
    this.simulation.applyWeatherEffects(this)
    this.status.resurection = false // prevent reapplying max revive again
    this.shield = 0 // prevent reapplying shield again
    this.flyingProtection = 0 // prevent flying effects twice
    SynergyEffects[Synergy.FOSSIL].forEach((fossilResurectEffect) =>
      this.effects.delete(fossilResurectEffect)
    ) // prevent resurecting fossils twice

    // does not trigger postEffects (iron defense, normal shield, rune protect, focus band, delta orb, flame orb...)
  }

  eatBerry(berry: Item, stealedFrom?: PokemonEntity) {
    switch (berry) {
      case Item.AGUAV_BERRY:
        this.handleHeal(this.hp - this.life, this, 0, false)
        this.status.triggerConfusion(3000, this)
        break
      case Item.APICOT_BERRY:
        this.handleHeal(20, this, 0, false)
        this.addSpecialDefense(20, this, 0, false)
        break
      case Item.ASPEAR_BERRY:
        this.status.freeze = false
        this.status.freezeCooldown = 0
        this.effects.add(Effect.IMMUNITY_FREEZE)
        this.handleHeal(20, this, 0, false)
        this.addAttackSpeed(15, this, 0, false)
        break
      case Item.CHERI_BERRY:
        this.status.healParalysis(this)
        this.effects.add(Effect.IMMUNITY_PARALYSIS)
        this.handleHeal(20, this, 0, false)
        this.addAttack(10, this, 0, false)
        break
      case Item.CHESTO_BERRY:
        this.status.sleep = false
        this.status.sleepCooldown = 0
        this.effects.add(Effect.IMMUNITY_SLEEP)
        this.handleHeal(20, this, 0, false)
        this.addAbilityPower(15, this, 0, false)
        break
      case Item.GANLON_BERRY:
        this.handleHeal(20, this, 0, false)
        this.addDefense(20, this, 0, false)
        break
      case Item.JABOCA_BERRY:
        this.handleHeal(20, this, 0, false)
        this.status.triggerSpikeArmor(10000)
        break
      case Item.LANSAT_BERRY:
        this.handleHeal(20, this, 0, false)
        this.addCritChance(50, this, 0, false)
        break
      case Item.LEPPA_BERRY:
        this.handleHeal(20, this, 0, false)
        this.addPP(50, this, 0, false)
        break
      case Item.LIECHI_BERRY:
        this.handleHeal(20, this, 0, false)
        this.addAttack(15, this, 0, false)
        break
      case Item.LUM_BERRY:
        this.handleHeal(20, this, 0, false)
        this.status.clearNegativeStatus()
        this.status.triggerRuneProtect(5000)
        break
      case Item.ORAN_BERRY:
        this.handleHeal(20, this, 0, false)
        this.addShield(80, this, 0, false)
        break
      case Item.PECHA_BERRY:
        this.handleHeal(50, this, 0, false)
        this.status.poisonOrigin = undefined
        this.status.poisonStacks = 0
        this.status.poisonDamageCooldown = 0
        this.effects.add(Effect.IMMUNITY_POISON)
        break
      case Item.PERSIM_BERRY:
        this.status.confusion = false
        this.status.confusionCooldown = 0
        this.effects.add(Effect.IMMUNITY_CONFUSION)
        this.handleHeal(20, this, 0, false)
        this.addSpecialDefense(10, this, 0, false)
        break
      case Item.PETAYA_BERRY:
        this.handleHeal(20, this, 0, false)
        this.addAbilityPower(80, this, 0, false)
        break
      case Item.ROWAP_BERRY:
        this.handleHeal(20, this, 0, false)
        this.status.triggerMagicBounce(10000)
        break
      case Item.RAWST_BERRY:
        this.status.healBurn(this)
        this.effects.add(Effect.IMMUNITY_BURN)
        this.handleHeal(20, this, 0, false)
        this.addDefense(10, this, 0, false)
        break
      case Item.SALAC_BERRY:
        this.handleHeal(20, this, 0, false)
        this.addAttackSpeed(50, this, 0, false)
        break
      case Item.SITRUS_BERRY:
        this.effects.add(Effect.BUFF_HEAL_RECEIVED)
        this.handleHeal(20, this, 0, false)
        break
      case Item.BERRY_JUICE:
        this.handleHeal(this.hp - this.life, this, 0, false)
        break
    }

    if (stealedFrom) {
      stealedFrom.items.delete(berry)
      stealedFrom.refToBoardPokemon.items.delete(berry)
    } else {
      this.items.delete(berry)
      this.refToBoardPokemon.items.delete(berry)
    }

    if (this.passive === Passive.GLUTTON) {
      this.refToBoardPokemon.hp += 20
      if (this.refToBoardPokemon.hp > 750) {
        this.player?.titles.add(Title.GLUTTON)
      }
    }

    if (
      this.passive === Passive.SHUCKLE &&
      Berries.includes(berry) &&
      this.player
    ) {
      this.player.items.push(Item.BERRY_JUICE)
    }
  }
}

export function getStrongestUnit(pokemons: PokemonEntity[]): PokemonEntity {
  /*
    strongest is defined as:
    1) number of items
    2) stars level
    3) rarity cost
    */
  let strongest,
    bestScore = 0
  pokemons.forEach((pokemon) => {
    const score = getUnitScore(pokemon)
    if (score > bestScore) {
      bestScore = score
      strongest = pokemon
    }
  })
  return strongest
}

export function getUnitScore(pokemon: PokemonEntity | IPokemon) {
  let score = 0
  score += 100 * pokemon.items.size
  score += 10 * pokemon.stars
  score += getSellPrice(pokemon.name, pokemon.shiny)
  return score
}

export function canSell(
  pkm: Pkm,
  specialGameRule: SpecialGameRule | undefined | null
) {
  if (specialGameRule === SpecialGameRule.DITTO_PARTY && pkm === Pkm.DITTO) {
    return false
  }

  return true
}

export function getMoveSpeed(
  pokemon: IPokemonEntity,
  weather: Weather
): number {
  let moveSpeed = 1
  if (weather === Weather.SNOW) {
    moveSpeed -= 0.25
  }
  if (pokemon.status.paralysis) {
    moveSpeed -= 0.4
  }

  if (pokemon.effects.has(Effect.QUICK_FEET)) {
    moveSpeed += 0.3
  } else if (pokemon.effects.has(Effect.RUN_AWAY)) {
    moveSpeed += 0.5
  } else if (pokemon.effects.has(Effect.HUSTLE)) {
    moveSpeed += 0.8
  } else if (pokemon.effects.has(Effect.BERSERK)) {
    moveSpeed += 1.0
  }

  return moveSpeed
}
