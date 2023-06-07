import { Item } from "../types/enum/Item"
import { Orientation, PokemonActionState } from "../types/enum/Game"
import MovingState from "./moving-state"
import AttackingState from "./attacking-state"
import { nanoid } from "nanoid"
import Status from "../models/colyseus-models/status"
import Count from "../models/colyseus-models/count"
import Simulation from "./simulation"
import { Schema, type, ArraySchema, SetSchema } from "@colyseus/schema"
import { AttackStrategy } from "./attack-strategy"
import Board from "./board"
import PokemonState from "./pokemon-state"
import { IPokemonEntity, IPokemon, Emotion, AttackSprite } from "../types"
import { AttackType, Rarity } from "../types/enum/Game"
import { Effect } from "../types/enum/Effect"
import { AbilityStrategy, Ability } from "../types/enum/Ability"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"
import { Pkm } from "../types/enum/Pokemon"
import { IdleState } from "./idle-state"
import PokemonFactory from "../models/pokemon-factory"
import { clamp, roundTo2Digits } from "../utils/number"
import { Passive } from "../types/enum/Passive"
import { DEFAULT_CRIT_CHANCE, DEFAULT_CRIT_DAMAGE } from "../types/Config"
import { removeInArray } from "../utils/array"

export default class PokemonEntity extends Schema implements IPokemonEntity {
  @type("boolean") shiny: boolean
  @type("uint8") positionX: number
  @type("uint8") positionY: number
  @type("string") action = PokemonActionState.WALK
  @type("string") index: string
  @type("string") id: string
  @type("string") orientation = Orientation.DOWNLEFT
  @type("uint16") hp: number
  @type("uint8") mana = 0
  @type("uint8") maxMana: number
  @type("uint16") atk: number
  @type("uint16") def: number
  @type("uint16") speDef: number
  @type("uint8") attackType: AttackType
  @type("uint16") life: number
  @type("uint16") shield = 0
  @type("uint8") team: number
  @type("uint8") range: number
  @type("float32") atkSpeed: number
  @type("uint8") atkSpeedBonus = 0
  @type("int8") targetX = -1
  @type("int8") targetY = -1
  @type("string") attackSprite: AttackSprite
  @type("string") rarity: Rarity
  @type("string") name: Pkm
  @type(["uint8"]) effects = new ArraySchema<Effect>()
  @type({ set: "string" }) items = new SetSchema<Item>()
  @type(["string"]) types = new ArraySchema<Synergy>()
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
  strategy: AttackStrategy
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
  growGroundTimer = 0
  echo = 0
  isClone = false

  constructor(
    pokemon: IPokemon,
    positionX: number,
    positionY: number,
    team: number,
    simulation: Simulation
  ) {
    super()

    this.state = new MovingState()
    this.effects = new ArraySchema()
    this.items = new SetSchema()
    pokemon.items.forEach((it) => {
      this.items.add(it)
    })
    this.status = new Status()
    this.count = new Count()
    this.simulation = simulation
    this.strategy = AbilityStrategy[pokemon.skill]

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
    this.maxMana = pokemon.maxMana
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
      this.types.push(type)
    })

    if (this.passive === Passive.TREE) {
      this.status.tree = true
      this.toIdleState()
    }
  }

  update(dt: number, board: Board, climate: string) {
    this.state.update(this, dt, board, climate)
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

  handleDamage(params: {
    damage: number
    board: Board
    attackType: AttackType
    attacker: PokemonEntity
    dodgeable: boolean
    shouldTargetGainMana: boolean
    shouldAttackerGainMana: boolean
  }) {
    return this.state.handleDamage({ target: this, ...params })
  }

  handleSpecialDamage(
    damage: number,
    board: Board,
    attackType: AttackType,
    attacker: PokemonEntity,
    crit: boolean
  ): { death: boolean; takenDamage: number } {
    if (this.status.runeProtect) {
      this.count.spellBlockedCount++
      return { death: false, takenDamage: 0 }
    } else {
      let specialDamage = damage + (damage * attacker.ap) / 100
      if (crit && this.items.has(Item.ROCKY_HELMET) === false) {
        specialDamage = Math.round(specialDamage * attacker.critDamage)
      }
      if (attacker && attacker.items.has(Item.POKEMONOMICON)) {
        this.status.triggerBurn(2000, this, attacker, board)
        this.status.triggerWound(2000, this, attacker, board)
      }
      if (this.items.has(Item.POWER_LENS) && specialDamage >= 1) {
        attacker.handleDamage({
          damage: Math.round(0.5 * specialDamage),
          board,
          attackType: AttackType.SPECIAL,
          attacker: this,
          dodgeable: false,
          shouldAttackerGainMana: false,
          shouldTargetGainMana: true
        })
      }
      return this.state.handleDamage({
        target: this,
        damage: specialDamage,
        board,
        attackType,
        attacker,
        dodgeable: false,
        shouldAttackerGainMana: false,
        shouldTargetGainMana: true
      })
    }
  }

  handleHeal(heal: number, caster: IPokemonEntity, apBoost: number) {
    return this.state.handleHeal(this, heal, caster, apBoost)
  }

  handleShield(shield: number, caster: IPokemonEntity, apBoost?: boolean) {
    return this.state.handleShield(this, shield, caster, apBoost)
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

  setMana(mana: number) {
    if (
      !this.status.silence &&
      !this.status.protect &&
      !this.status.resurecting
    ) {
      this.mana = Math.max(0, Math.min(mana, this.maxMana))
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

  addDodgeChance(value: number) {
    this.dodge = Math.min(0.9, this.dodge + value)
  }

  addAbilityPower(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    this.ap = Math.round(this.ap + Math.round(value + boost))
  }

  addDefense(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    this.def = Math.max(0, this.def + Math.round(value + boost))
  }

  addSpecialDefense(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    this.speDef = Math.max(0, this.speDef + Math.round(value + boost))
  }

  addAttack(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    this.atk = Math.max(0, this.atk + Math.round(value + boost))
  }

  addAttackSpeed(value: number, apBoost = false) {
    const boost = apBoost ? (value * this.ap) / 100 : 0
    this.atkSpeedBonus += value + boost
    this.atkSpeed = clamp(
      roundTo2Digits(0.75 * (1 + this.atkSpeedBonus / 100)),
      0.4,
      2.5
    )
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
    this.positionX = x
    this.positionY = y
    this.toMovingState()
    this.cooldown = 100 // for faster retargeting
  }

  // called after every successful attack (not dodged or protected)
  onAttack(
    target: PokemonEntity,
    board: Board,
    damageDealt: number,
    shouldAttackerGainMana: boolean
  ) {
    if (shouldAttackerGainMana) {
      this.setMana(this.mana + 5)
    }
    if (
      this.effects.includes(Effect.CALM_MIND) ||
      this.effects.includes(Effect.FOCUS_ENERGY) ||
      this.effects.includes(Effect.MEDITATE)
    ) {
      let lifesteal = 0
      if (this.effects.includes(Effect.MEDITATE)) {
        lifesteal = 0.15
      } else if (this.effects.includes(Effect.FOCUS_ENERGY)) {
        lifesteal = 0.3
      } else if (this.effects.includes(Effect.CALM_MIND)) {
        lifesteal = 0.6
      }
      this.handleHeal(Math.floor(lifesteal * damageDealt), this, 0)
    }
    if (this.items.has(Item.SHELL_BELL)) {
      this.handleHeal(Math.floor(0.3 * damageDealt), this, 0)
    }

    if (
      this.effects.includes(Effect.BLAZE) ||
      this.effects.includes(Effect.VICTORY_STAR) ||
      this.effects.includes(Effect.DROUGHT) ||
      this.effects.includes(Effect.DESOLATE_LAND)
    ) {
      let burnChance = 0
      if (this.effects.includes(Effect.BLAZE)) {
        burnChance = 0.2
      } else if (this.effects.includes(Effect.VICTORY_STAR)) {
        burnChance = 0.2
      } else if (this.effects.includes(Effect.DROUGHT)) {
        burnChance = 0.3
      } else if (this.effects.includes(Effect.DESOLATE_LAND)) {
        burnChance = 0.4
      }
      if (Math.random() < burnChance) {
        target.status.triggerBurn(2000, target, this, board)
      }
    }
  }

  onCritical(target: PokemonEntity, board: Board) {
    target.count.crit++

    if (
      this.effects.includes(Effect.FAIRY_WIND) ||
      this.effects.includes(Effect.STRANGE_STEAM) ||
      this.effects.includes(Effect.AROMATIC_MIST)
    ) {
      let d = 0
      if (this.effects.includes(Effect.AROMATIC_MIST)) {
        d = 10
      } else if (this.effects.includes(Effect.FAIRY_WIND)) {
        d = 30
      } else if (this.effects.includes(Effect.STRANGE_STEAM)) {
        d = 60
      }
      const cells = board.getAdjacentCells(this.positionX, this.positionY)

      cells.forEach((cell) => {
        if (cell.value && this.team != cell.value.team) {
          cell.value.count.fairyCritCount++
          cell.value.handleDamage({
            damage: d,
            board,
            attackType: AttackType.SPECIAL,
            attacker: this,
            dodgeable: false,
            shouldAttackerGainMana: false,
            shouldTargetGainMana: true
          })
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
        d = 30
      } else if (target.effects.includes(Effect.STRANGE_STEAM)) {
        d = 60
      }
      const cells = board.getAdjacentCells(target.positionX, target.positionY)

      cells.forEach((cell) => {
        if (cell.value && target.team != cell.value.team) {
          cell.value.count.fairyCritCount++
          cell.value.handleDamage({
            damage: d,
            board,
            attackType: AttackType.SPECIAL,
            attacker: target,
            dodgeable: false,
            shouldAttackerGainMana: false,
            shouldTargetGainMana: true
          })
        }
      })
    }

    if (this.items.has(Item.SCOPE_LENS)) {
      this.setMana(this.mana + 15)
      target.setMana(target.mana - 15)
      target.count.manaBurnCount++
    }
  }

  onKill(target: PokemonEntity, board: Board) {
    if (
      this.items.has(Item.AMULET_COIN) &&
      this.team === 0 &&
      this.simulation.player &&
      this.count.moneyCount < 5
    ) {
      this.simulation.player.money += 1
      this.count.moneyCount++
    }
    if (
      this.effects.includes(Effect.PURSUIT) ||
      this.effects.includes(Effect.BRUTAL_SWING) ||
      this.effects.includes(Effect.POWER_TRIP)
    ) {
      const isPursuit = this.effects.includes(Effect.PURSUIT)
      const isBrutalSwing = this.effects.includes(Effect.BRUTAL_SWING)
      const isPowerTrip = this.effects.includes(Effect.POWER_TRIP)

      if (isPursuit || isBrutalSwing || isPowerTrip) {
        let defBoost = 0
        let healBoost = 0
        let attackBoost = 0
        if (isPursuit) {
          defBoost = 2
          healBoost = 30
          attackBoost = 3
        } else if (isBrutalSwing) {
          defBoost = 4
          healBoost = 60
          attackBoost = 6
        } else if (isPowerTrip) {
          defBoost = 6
          healBoost = 90
          attackBoost = 9
        }
        this.addSpecialDefense(defBoost)
        this.addDefense(defBoost)
        this.handleHeal(healBoost, this, 0)
        this.addAttack(attackBoost)
        this.count.monsterExecutionCount++
      }
    }

    if (
      target.effects.includes(Effect.ODD_FLOWER) ||
      target.effects.includes(Effect.GLOOM_FLOWER) ||
      target.effects.includes(Effect.VILE_FLOWER) ||
      target.effects.includes(Effect.SUN_FLOWER)
    ) {
      if (!target.simulation.flowerSpawn[target.team]) {
        target.simulation.flowerSpawn[target.team] = true
        const nearestAvailableCoordinate =
          this.state.getFarthestTargetCoordinateAvailablePlace(target, board)
        if (nearestAvailableCoordinate) {
          if (target.effects.includes(Effect.ODD_FLOWER)) {
            target.simulation.addPokemon(
              PokemonFactory.createPokemonFromName(Pkm.ODDISH),
              nearestAvailableCoordinate.x,
              nearestAvailableCoordinate.y,
              target.team,
              true
            )
          } else if (target.effects.includes(Effect.GLOOM_FLOWER)) {
            target.simulation.addPokemon(
              PokemonFactory.createPokemonFromName(Pkm.GLOOM),
              nearestAvailableCoordinate.x,
              nearestAvailableCoordinate.y,
              target.team,
              true
            )
          } else if (target.effects.includes(Effect.VILE_FLOWER)) {
            target.simulation.addPokemon(
              PokemonFactory.createPokemonFromName(Pkm.VILEPLUME),
              nearestAvailableCoordinate.x,
              nearestAvailableCoordinate.y,
              target.team,
              true
            )
          } else if (target.effects.includes(Effect.SUN_FLOWER)) {
            target.simulation.addPokemon(
              PokemonFactory.createPokemonFromName(Pkm.BELLOSSOM),
              nearestAvailableCoordinate.x,
              nearestAvailableCoordinate.y,
              target.team,
              true
            )
          }
        }
      }
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
    this.mana = 0
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
    this.status.resurection = false // prevent reapplying max revive again
    this.shield = 0 // prevent reapplying shield again
    SynergyEffects[Synergy.FOSSIL].forEach((fossilResurectEffect) =>
      removeInArray(this.effects, fossilResurectEffect)
    ) // prevent resurecting fossils twice

    // does not trigger postEffects (iron defense, normal shield, rune protect, focus band, delta orb, flame orb...)
  }
}
