import { Berries, Item } from "../types/enum/Item"
import { Orientation, PokemonActionState, Team } from "../types/enum/Game"
import MovingState from "./moving-state"
import AttackingState from "./attacking-state"
import { nanoid } from "nanoid"
import Status from "../models/colyseus-models/status"
import Count from "../models/colyseus-models/count"
import Simulation from "./simulation"
import { Schema, type, SetSchema } from "@colyseus/schema"
import { AbilityStrategies } from "./abilities/abilities"
import Board from "./board"
import PokemonState from "./pokemon-state"
import { IPokemonEntity, IPokemon, Emotion, AttackSprite } from "../types"
import { AttackType, Rarity } from "../types/enum/Game"
import { Effect } from "../types/enum/Effect"
import { Ability } from "../types/enum/Ability"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"
import { Pkm } from "../types/enum/Pokemon"
import { IdleState } from "./idle-state"
import PokemonFactory from "../models/pokemon-factory"
import { clamp, max, min, roundTo2Digits } from "../utils/number"
import { Passive } from "../types/enum/Passive"
import {
  DEFAULT_CRIT_CHANCE,
  DEFAULT_CRIT_DAMAGE,
  DELTA_ORB_MANA,
  MANA_SCARF_MANA,
  ON_ATTACK_MANA,
  SCOPE_LENS_MANA
} from "../types/Config"
import { chance } from "../utils/random"
import { distanceC } from "../utils/distance"
import { AbilityStrategy } from "./abilities/ability-strategy"
import Player from "../models/colyseus-models/player"
import { values } from "../utils/schemas"

export default class PokemonEntity extends Schema implements IPokemonEntity {
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
  @type("float32") critDamage = DEFAULT_CRIT_DAMAGE
  @type("uint16") ap = 0
  @type("uint16") healDone: number
  @type("string") emotion: Emotion
  cooldown = 500
  manaCooldown = 1000
  state: MovingState
  simulation: Simulation
  strategy: AbilityStrategy
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
    this.strategy = AbilityStrategies[pokemon.skill]

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

  update(dt: number, board: Board, weather: string) {
    this.state.update(this, dt, board, weather)
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
    if (this.status.protect) {
      this.count.spellBlockedCount++
      return { death: false, takenDamage: 0 }
    } else {
      let specialDamage =
        damage + (damage * (attacker && apBoost ? attacker.ap : 0)) / 100
      if (attacker && attacker.status.doubleDamage) {
        specialDamage *= 2
        attacker.status.doubleDamage = false
      }
      if (crit && attacker && this.items.has(Item.ROCKY_HELMET) === false) {
        specialDamage = Math.round(specialDamage * attacker.critDamage)
      }
      if (attacker && attacker.items.has(Item.POKEMONOMICON)) {
        this.status.triggerBurn(3000, this, attacker, board)
        this.status.triggerWound(3000, this, attacker, board)
      }
      if (this.items.has(Item.POWER_LENS) && specialDamage >= 1 && attacker) {
        attacker.handleDamage({
          damage: Math.round(0.5 * specialDamage),
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

  handleHeal(heal: number, caster: IPokemonEntity, apBoost: number) {
    return this.state.handleHeal(this, heal, caster, apBoost)
  }

  addShield(shield: number, caster: IPokemonEntity, apBoost?: boolean) {
    return this.state.addShield(this, shield, caster, apBoost)
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

  addPP(pp: number) {
    if (
      !this.status.silence &&
      !this.status.protect &&
      !this.status.resurecting &&
      !(pp < 0 && this.status.tree) // cannot lose PP if tree
    ) {
      this.pp = clamp(this.pp + pp, 0, this.maxPP)
    }
  }

  addCritChance(value: number) {
    // for every 5% crit chance > 100, +0.1 crit damage
    this.critChance += value

    if (this.critChance > 100) {
      const overCritChance = Math.round(this.critChance - 100)
      this.addCritDamage(overCritChance / 50)
      this.critChance = 100
    }
  }

  addMaxHP(value: number) {
    this.hp = min(1)(this.hp + value)
  }

  addDodgeChance(value: number) {
    this.dodge = max(0.9)(this.dodge + value)
  }

  addAbilityPower(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    this.ap = min(0)(Math.round(this.ap + Math.round(value + boost)))
  }

  addDefense(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    this.def = min(0)(this.def + Math.round(value + boost))
  }

  addSpecialDefense(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    this.speDef = min(0)(this.speDef + Math.round(value + boost))
  }

  addAttack(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    this.atk = min(0)(this.atk + Math.round(value + boost))
  }

  addAttackSpeed(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    const currentAtkSpeedBonus = 100 * (this.atkSpeed / 0.75 - 1)
    const atkSpeedBonus = currentAtkSpeedBonus + value + boost
    this.atkSpeed = clamp(
      roundTo2Digits(0.75 * (1 + atkSpeedBonus / 100)),
      0.4,
      2.5
    )
  }

  addPsychicField() {
    this.status.psychicField = true
    if (this.passive === Passive.SURGE_SURFER) {
      this.addAttackSpeed(30, false)
    }
  }

  removePsychicField() {
    this.status.psychicField = false
    if (this.passive === Passive.SURGE_SURFER) {
      this.addAttackSpeed(-30, false)
    }
  }

  addElectricField() {
    this.status.electricField = true
    if (this.passive === Passive.SURGE_SURFER) {
      this.addAttackSpeed(30, false)
    }
  }

  removeElectricField() {
    this.status.electricField = false
    if (this.passive === Passive.SURGE_SURFER) {
      this.addAttackSpeed(-30, false)
    }
  }

  addCritDamage(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    this.critDamage = Math.max(
      0,
      roundTo2Digits(this.critDamage + value + boost)
    )
  }

  moveTo(x: number, y: number, board: Board) {
    board.swapValue(this.positionX, this.positionY, x, y)
    this.toMovingState()
    this.cooldown = 100 // for faster retargeting
  }

  // called after every attack, no matter if it's successful or not
  onAttack({
    target,
    board,
    physicalDamage,
    trueDamage,
    totalDamage
  }: {
    target: PokemonEntity
    board: Board
    physicalDamage: number
    trueDamage: number
    totalDamage: number
  }) {
    this.addPP(ON_ATTACK_MANA)

    if (this.items.has(Item.BLUE_ORB)) {
      this.count.staticHolderCount++
      if (this.count.staticHolderCount > 2) {
        this.count.staticHolderCount = 0
        // eslint-disable-next-line no-unused-vars
        let c = 2
        board.forEach((x, y, tg) => {
          if (tg && this.team != tg.team && c > 0) {
            tg.count.staticCount++
            tg.addPP(-20)
            tg.count.manaBurnCount++
            c--
          }
        })
      }
    }

    if (this.items.has(Item.CHOICE_SCARF) && totalDamage > 0) {
      const cells = board.getAdjacentCells(target.positionX, target.positionY)
      let targetCount = 1
      cells.forEach((cell) => {
        if (cell.value && this.team != cell.value.team && targetCount > 0) {
          if (physicalDamage > 0) {
            cell.value.handleDamage({
              damage: Math.ceil(0.5 * physicalDamage),
              board,
              attackType: AttackType.PHYSICAL,
              attacker: this,
              shouldTargetGainMana: true
            })
          }
          if (trueDamage > 0) {
            cell.value.handleDamage({
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

    if (this.items.has(Item.LEFTOVERS)) {
      const neighbours = [-1, 0, 1]
      neighbours.forEach((offset) => {
        const value = board.getValue(this.positionX + offset, this.positionY)
        if (value && value.team === this.team) {
          value.handleHeal(value.hp * 0.05, this, 0)
        }
      })
    }

    if (this.items.has(Item.MANA_SCARF)) {
      this.addPP(MANA_SCARF_MANA)
    }
    if (this.status.deltaOrbStacks > 0) {
      this.addPP(DELTA_ORB_MANA * this.status.deltaOrbStacks)
    }

    if (this.effects.has(Effect.TELEPORT_NEXT_ATTACK)) {
      const crit =
        this.items.has(Item.REAPER_CLOTH) && chance(this.critChance / 100)
      if (crit) {
        this.onCritical(target, board)
      }
      target.handleSpecialDamage(
        [15, 30, 60][this.stars - 1],
        board,
        AttackType.SPECIAL,
        this,
        crit
      )
      this.effects.delete(Effect.TELEPORT_NEXT_ATTACK)
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

  // called after every successful attack (not dodged or protected)
  onHit({
    target,
    board,
    totalTakenDamage
  }: {
    target: PokemonEntity
    board: Board
    totalTakenDamage: number
  }) {
    // Item effects on hit

    if (target && target.items.has(Item.SMOKE_BALL)) {
      this.status.triggerParalysis(5000, this)
    }

    if (this.items.has(Item.UPGRADE)) {
      this.addAttackSpeed(5)
      this.count.upgradeCount++
    }

    // Synergy effects on hit

    if (this.hasSynergyEffect(Synergy.ICE)) {
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
        this.addAttack(1)
      } else if (this.effects.has(Effect.DROUGHT)) {
        burnChance = 0.5
        this.addAttack(2)
      } else if (this.effects.has(Effect.DESOLATE_LAND)) {
        burnChance = 1
        this.addAttack(3)
      }
      if (chance(burnChance)) {
        target.status.triggerBurn(2000, target, this, board)
      }
    }

    if (this.hasSynergyEffect(Synergy.AQUATIC)) {
      const burnManaChance = this.effects.has(Effect.SWIFT_SWIM)
        ? 0.35
        : this.effects.has(Effect.HYDRATION)
        ? 0.45
        : 0.55
      const manaGain = this.effects.has(Effect.SWIFT_SWIM)
        ? 15
        : this.effects.has(Effect.HYDRATION)
        ? 30
        : 45
      if (chance(burnManaChance)) {
        target.addPP(-20)
        target.count.manaBurnCount++
        this.addPP(manaGain)
      }
    }

    if (this.hasSynergyEffect(Synergy.GHOST)) {
      if (chance(1 / 2)) {
        target.status.triggerSilence(3000, target, this, board)
      }
    }

    let poisonChance = 0
    if (this.effects.has(Effect.POISONOUS)) {
      poisonChance = 0.3
    }
    if (this.effects.has(Effect.VENOMOUS)) {
      poisonChance = 0.5
    }
    if (this.effects.has(Effect.TOXIC)) {
      poisonChance = 0.7
    }
    if (poisonChance > 0) {
      if (Math.random() < poisonChance) {
        target.status.triggerPoison(4000, target, this)
      }
    }

    // Ability effects on hit
    if (target.status.spikeArmor && this.range === 1) {
      this.status.triggerWound(2000, this, target, board)
      this.handleDamage({
        damage: Math.round(target.def * (1 + target.ap / 100)),
        board,
        attackType: AttackType.SPECIAL,
        attacker: target,
        shouldTargetGainMana: true
      })
    }

    const berry = values(this.items).find((item) => Berries.includes(item))
    if (this.life < 0.5 * this.hp && berry) {
      let berryEaten = false
      switch (berry) {
        case Item.AGUAV_BERRY:
          berryEaten = true
          this.handleHeal(this.hp - this.life, this, 0)
          this.status.triggerConfusion(3000, this)
          break
        case Item.APICOT_BERRY:
          berryEaten = true
          this.addSpecialDefense(20)
          break
        case Item.GANLON_BERRY:
          berryEaten = true
          this.addDefense(20)
          break
        case Item.JABOCA_BERRY:
          berryEaten = true
          this.status.triggerSpikeArmor(10000)
          break
        case Item.LANSAT_BERRY:
          berryEaten = true
          this.addCritChance(50)
          break
        case Item.LIECHI_BERRY:
          berryEaten = true
          this.addAttack(15)
          break
        case Item.LUM_BERRY:
          berryEaten = true
          this.status.clearNegativeStatus()
          this.status.triggerRuneProtect(10000)
          break
        case Item.ORAN_BERRY:
          berryEaten = true
          this.addShield(100, this)
          break
        case Item.PETAYA_BERRY:
          berryEaten = true
          this.addAbilityPower(100)
          break
        case Item.ROWAP_BERRY:
          berryEaten = true
          this.status.triggerMagicBounce(10000)
          break
        case Item.SALAC_BERRY:
          berryEaten = true
          this.addAttackSpeed(50)
          break
        case Item.SITRUS_BERRY:
          berryEaten = true
          this.effects.add(Effect.BUFF_HEAL_RECEIVED)
          this.handleHeal(20, this, 0)
          break
      }
      if (berryEaten) {
        this.items.delete(berry)
        this.refToBoardPokemon.items.delete(berry)
      }
    }
  }

  // called whenever the unit deals damage, by basic attack or ability
  onDamageDealt({ target, damage }: { target: PokemonEntity; damage: number }) {
    if (this.hasSynergyEffect(Synergy.HUMAN)) {
      let lifesteal = 0
      if (this.effects.has(Effect.MEDITATE)) {
        lifesteal = 0.1
      } else if (this.effects.has(Effect.FOCUS_ENERGY)) {
        lifesteal = 0.25
      } else if (this.effects.has(Effect.CALM_MIND)) {
        lifesteal = 0.5
      }
      this.handleHeal(Math.ceil(lifesteal * damage), this, 0)
    }

    if (this.items.has(Item.SHELL_BELL)) {
      this.handleHeal(Math.ceil(0.3 * damage), this, 0)
    }
  }

  onCritical(target: PokemonEntity, board: Board) {
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
          damage = 60
        } else if (pokemon.effects.has(Effect.MOON_FORCE)) {
          damage = 80
        }

        const splashTarget = pokemon === this ? target : this

        if (
          distanceC(
            pokemon.positionX,
            pokemon.positionY,
            splashTarget.positionX,
            splashTarget.positionY
          ) <= 1
        ) {
          // melee range
          pokemon.count.fairyCritCount++
          splashTarget.handleDamage({
            damage,
            board,
            attackType: AttackType.SPECIAL,
            attacker: pokemon,
            shouldTargetGainMana: false
          })
        } else {
          // not at range, charm it instead
          splashTarget.status.triggerCharm(2000, splashTarget)
        }

        pokemon.fairySplashCooldown = 1
      }
    })

    if (this.items.has(Item.SCOPE_LENS)) {
      this.addPP(SCOPE_LENS_MANA)
      target.addPP(-SCOPE_LENS_MANA)
      target.count.manaBurnCount++
    }

    if (this.items.has(Item.RAZOR_FANG)) {
      target.status.triggerArmorReduction(4000)
    }

    if (target.items.has(Item.BABIRI_BERRY)) {
      target.status.triggerProtect(2000)
      target.handleHeal(20, target, 0)
      target.items.delete(Item.BABIRI_BERRY)
      target.refToBoardPokemon.items.delete(Item.BABIRI_BERRY)
    }
  }

  onKill(target: PokemonEntity, board: Board) {
    if (this.items.has(Item.AMULET_COIN) && this.player) {
      this.player.money += 1
      this.count.moneyCount++
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
        let lifeBoost = 0
        let attackBoost = 0
        if (isPursuit) {
          lifeBoost = 30
          attackBoost = 3
        } else if (isBrutalSwing) {
          lifeBoost = 60
          attackBoost = 6
        } else if (isPowerTrip) {
          lifeBoost = 90
          attackBoost = 9
        }
        this.addMaxHP(lifeBoost)
        this.handleHeal(lifeBoost, this, 0)
        this.addAttack(attackBoost)
        this.count.monsterExecutionCount++
      }
    }

    if (this.passive === Passive.BEAST_BOOST) {
      this.addAttack(5)
    }

    board.forEach(
      (x, y, v) =>
        v &&
        v.passive === Passive.MOXIE &&
        v.team === this.team &&
        v.addAttack(target.stars)
    )

    if (
      target.effects.has(Effect.ODD_FLOWER) ||
      target.effects.has(Effect.GLOOM_FLOWER) ||
      target.effects.has(Effect.VILE_FLOWER) ||
      target.effects.has(Effect.SUN_FLOWER)
    ) {
      if (!target.simulation.flowerSpawn[target.team]) {
        target.simulation.flowerSpawn[target.team] = true
        const nearestAvailableCoordinate =
          this.state.getFarthestTargetCoordinateAvailablePlace(target, board)
        if (nearestAvailableCoordinate) {
          if (target.effects.has(Effect.ODD_FLOWER)) {
            target.simulation.addPokemon(
              PokemonFactory.createPokemonFromName(Pkm.ODDISH, target.player),
              nearestAvailableCoordinate.x,
              nearestAvailableCoordinate.y,
              target.team,
              true
            )
          } else if (target.effects.has(Effect.GLOOM_FLOWER)) {
            target.simulation.addPokemon(
              PokemonFactory.createPokemonFromName(Pkm.GLOOM, target.player),
              nearestAvailableCoordinate.x,
              nearestAvailableCoordinate.y,
              target.team,
              true
            )
          } else if (target.effects.has(Effect.VILE_FLOWER)) {
            target.simulation.addPokemon(
              PokemonFactory.createPokemonFromName(
                Pkm.VILEPLUME,
                target.player
              ),
              nearestAvailableCoordinate.x,
              nearestAvailableCoordinate.y,
              target.team,
              true
            )
          } else if (target.effects.has(Effect.SUN_FLOWER)) {
            target.simulation.addPokemon(
              PokemonFactory.createPokemonFromName(
                Pkm.BELLOSSOM,
                target.player
              ),
              nearestAvailableCoordinate.x,
              nearestAvailableCoordinate.y,
              target.team,
              true
            )
          }
        }
      }
    }

    if (this.passive === Passive.GRIM_NEIGH) {
      this.addAbilityPower(30)
    }
  }

  // called after every ability cast
  onCast() {
    if (this.items.has(Item.LEPPA_BERRY)) {
      this.items.delete(Item.LEPPA_BERRY)
      this.refToBoardPokemon.items.delete(Item.LEPPA_BERRY)
      this.addPP(50)
    }
  }

  flyAway(board: Board) {
    const flyAwayCell = board.getFlyAwayCell(this.positionX, this.positionY)
    this.flyingProtection--
    if (flyAwayCell) {
      this.moveTo(flyAwayCell.x, flyAwayCell.y, board)
    }
  }

  resetStats() {
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
    this.critDamage = DEFAULT_CRIT_DAMAGE
    this.count = new Count()
    this.status.clearNegativeStatus()
    this.effects.clear()
    this.simulation.applySynergyEffects(this)
    this.simulation.applyItemsEffects(this)
    this.simulation.applyWeatherEffects(this)
    this.status.resurection = false // prevent reapplying max revive again
    this.shield = 0 // prevent reapplying shield again
    SynergyEffects[Synergy.FOSSIL].forEach((fossilResurectEffect) =>
      this.effects.delete(fossilResurectEffect)
    ) // prevent resurecting fossils twice

    // does not trigger postEffects (iron defense, normal shield, rune protect, focus band, delta orb, flame orb...)
  }
}
