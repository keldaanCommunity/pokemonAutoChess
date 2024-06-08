import { Schema, type } from "@colyseus/schema"
import Board from "../../core/board"
import { PokemonEntity } from "../../core/pokemon-entity"
import { IPokemonEntity, IStatus, Transfer } from "../../types"
import { Ability } from "../../types/enum/Ability"
import { Effect } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Passive } from "../../types/enum/Passive"
import { Weather } from "../../types/enum/Weather"
import { max } from "../../utils/number"
import { chance } from "../../utils/random"

export default class Status extends Schema implements IStatus {
  @type("boolean") burn = false
  @type("boolean") silence = false
  @type("number") poisonStacks = 0
  @type("boolean") freeze = false
  @type("boolean") protect = false
  @type("boolean") sleep = false
  @type("boolean") confusion = false
  @type("boolean") wound = false
  @type("boolean") resurection = false
  @type("boolean") resurecting = false
  @type("boolean") paralysis = false
  @type("boolean") armorReduction = false
  @type("boolean") runeProtect = false
  @type("boolean") charm = false
  @type("boolean") flinch = false
  @type("boolean") electricField = false
  @type("boolean") psychicField = false
  @type("boolean") grassField = false
  @type("boolean") fairyField = false
  @type("boolean") spikeArmor = false
  @type("boolean") magicBounce = false
  @type("boolean") light = false
  @type("boolean") curse = false
  @type("boolean") curseVulnerability = false
  @type("boolean") curseWeakness = false
  @type("boolean") curseTorment = false
  @type("boolean") curseFate = false
  @type("boolean") enraged = false
  @type("boolean") skydiving = false
  magmaStorm = false
  soulDew = false
  clearWing = false
  guts = false
  toxicBoost = false
  burnOrigin: PokemonEntity | undefined = undefined
  poisonOrigin: PokemonEntity | undefined = undefined
  silenceOrigin: PokemonEntity | undefined = undefined
  woundOrigin: PokemonEntity | undefined = undefined
  charmOrigin: PokemonEntity | undefined = undefined
  magmaStormOrigin: PokemonEntity | null = null
  clearWingCooldown = 1000
  burnCooldown = 0
  burnDamageCooldown = 1000
  silenceCooldown = 0
  poisonCooldown = 0
  poisonDamageCooldown = 1000
  freezeCooldown = 0
  protectCooldown = 0
  sleepCooldown = 0
  confusionCooldown = 0
  woundCooldown = 0
  soulDewCooldown = 0
  paralysisCooldown = 0
  armorReductionCooldown = 0
  runeProtectCooldown = 0
  charmCooldown = 0
  flinchCooldown = 0
  spikeArmorCooldown = 0
  magicBounceCooldown = 0
  synchroCooldown = 3000
  magmaStormCooldown = 0
  synchro = false
  tree = false
  resurectingCooldown = 0
  doubleDamage = false
  drySkin = false
  drySkinCooldown = 1000
  curseCooldown = 0
  enrageDelay = 35000
  darkHarvest = false
  darkHarvestCooldown = 0
  darkHarvestDamageCooldown = 0

  clearNegativeStatus() {
    this.burnCooldown = 0
    this.silenceCooldown = 0
    this.poisonCooldown = 0
    this.freezeCooldown = 0
    this.sleepCooldown = 0
    this.confusionCooldown = 0
    this.woundCooldown = 0
    this.paralysisCooldown = 0
    this.charmCooldown = 0
    this.flinchCooldown = 0
    this.armorReductionCooldown = 0
    this.curseCooldown = 0
    this.curse = false
  }

  hasNegativeStatus() {
    return (
      this.burn ||
      this.silence ||
      this.poisonStacks > 0 ||
      this.freeze ||
      this.sleep ||
      this.confusion ||
      this.wound ||
      this.paralysis ||
      this.charm ||
      this.flinch ||
      this.armorReduction ||
      this.curse
    )
  }

  updateAllStatus(dt: number, pokemon: PokemonEntity, board: Board) {
    if (pokemon.effects.has(Effect.POISON_GAS) && this.poisonStacks === 0) {
      this.triggerPoison(1500, pokemon, undefined)
    }

    if (pokemon.effects.has(Effect.STICKY_WEB) && !this.paralysis) {
      this.triggerParalysis(2000, pokemon)
    }

    if (pokemon.status.runeProtect) {
      this.updateRuneProtect(dt)
    }

    if (this.burn) {
      this.updateBurn(dt, pokemon, board)
    }

    if (this.poisonStacks > 0) {
      this.updatePoison(dt, pokemon, board)
    }

    if (this.sleep) {
      this.updateSleep(dt)
    }

    if (this.silence) {
      this.updateSilence(dt)
    }

    if (this.protect) {
      this.updateProtect(dt)
    }

    if (this.freeze) {
      this.updateFreeze(dt)
    }

    if (this.confusion) {
      this.updateConfusion(dt)
    }

    if (this.wound) {
      this.updateWound(dt)
    }

    if (this.soulDew) {
      this.updateSoulDew(dt, pokemon)
    }

    if (this.darkHarvest) {
      this.updateDarkHarvest(dt, pokemon, board)
    }

    if (this.paralysis) {
      this.updateParalysis(dt, pokemon)
    }

    if (this.armorReduction) {
      this.updateArmorReduction(dt)
    }

    if (this.charm) {
      this.updateCharm(dt)
    }

    if (this.flinch) {
      this.updateFlinch(dt)
    }

    if (this.spikeArmor) {
      this.updateSpikeArmor(dt)
    }

    if (this.magicBounce) {
      this.updateMagicBounce(dt)
    }

    if (this.synchro) {
      this.updateSynchro(dt, board, pokemon)
    }

    if (this.resurecting) {
      this.updateResurecting(dt, pokemon)
    }

    if (this.magmaStorm) {
      this.updateMagmaStorm(dt, board, pokemon)
    }

    if (this.clearWing) {
      this.updateClearWing(dt, pokemon)
    }

    if (this.drySkin) {
      this.updateDrySkin(dt, pokemon)
    }

    if (this.curse) {
      this.updateCurse(dt, board, pokemon)
    }

    if (!this.enraged) {
      this.updateRage(dt, pokemon)
    }

    if (
      pokemon.effects.has(Effect.CURSE_OF_VULNERABILITY) &&
      !pokemon.status.flinch
    ) {
      this.triggerFlinch(30000, pokemon)
    }

    if (
      pokemon.effects.has(Effect.CURSE_OF_WEAKNESS) &&
      !pokemon.status.paralysis
    ) {
      this.triggerParalysis(30000, pokemon)
    }

    if (
      pokemon.effects.has(Effect.CURSE_OF_TORMENT) &&
      !pokemon.status.silence
    ) {
      this.triggerSilence(30000, pokemon)
    }

    if (pokemon.effects.has(Effect.CURSE_OF_FATE) && !pokemon.status.curse) {
      this.triggerCurse(5000)
    }
  }

  triggerMagmaStorm(pkm: PokemonEntity, origin: PokemonEntity | null) {
    if (!this.magmaStorm && origin) {
      this.magmaStorm = true
      this.magmaStormCooldown = 500
      this.magmaStormOrigin = origin
    }
  }

  updateMagmaStorm(dt: number, board: Board, pkm: PokemonEntity) {
    if (this.magmaStormCooldown - dt <= 0) {
      this.magmaStorm = false
      const adjacentCells = board.getAdjacentCells(pkm.positionX, pkm.positionY)
      for (let i = 0; i < adjacentCells.length; i++) {
        const cell = adjacentCells[i]
        if (cell && cell.value && cell.value.team === pkm.team) {
          cell.value.status.triggerMagmaStorm(cell.value, this.magmaStormOrigin)
          break
        }
      }
      pkm.simulation.room.broadcast(Transfer.ABILITY, {
        id: pkm.simulation.id,
        skill: Ability.MAGMA_STORM,
        positionX: pkm.positionX,
        positionY: pkm.positionY,
        targetX: pkm.positionX,
        targetY: pkm.positionY
      })
      pkm.handleSpecialDamage(
        80,
        board,
        AttackType.SPECIAL,
        this.magmaStormOrigin,
        false
      )
      this.magmaStormOrigin = null
      this.magmaStormCooldown = 0
    } else {
      this.magmaStormCooldown -= dt
    }
  }

  triggerArmorReduction(duration: number, pkm: PokemonEntity) {
    if (!this.runeProtect) {
      this.armorReduction = true
      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration *= 0.7
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration *= 0.4
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration *= 0.1
      }

      if (duration > this.armorReductionCooldown) {
        this.armorReductionCooldown = Math.round(duration)
      }
    }
  }

  updateArmorReduction(dt: number) {
    if (this.armorReductionCooldown - dt <= 0) {
      this.armorReduction = false
    } else {
      this.armorReductionCooldown -= dt
    }
  }

  updateRage(dt: number, pokemon: PokemonEntity) {
    if (this.enrageDelay - dt <= 0 && !pokemon.simulation.finished) {
      this.enraged = true
      this.protect = false
      pokemon.addAttackSpeed(100, pokemon, 0, false)
    } else {
      this.enrageDelay -= dt
    }
  }

  triggerClearWing(timer: number) {
    if (!this.clearWing) {
      this.clearWing = true
      this.clearWingCooldown = timer
    }
  }

  updateClearWing(dt: number, pkm: PokemonEntity) {
    if (this.clearWingCooldown - dt <= 0) {
      this.clearWing = false
      this.triggerClearWing(1000)
      pkm.addAttackSpeed(2, pkm, 0, false)
    } else {
      this.clearWingCooldown -= dt
    }
  }

  triggerDrySkin(timer: number) {
    if (!this.drySkin) {
      this.drySkin = true
      this.drySkinCooldown = timer
    }
  }

  updateDrySkin(dt: number, pkm: PokemonEntity) {
    if (this.drySkinCooldown - dt <= 0) {
      this.drySkin = false
      this.triggerDrySkin(1000)
      pkm.handleHeal(8, pkm, 0, false)
    } else {
      this.drySkinCooldown -= dt
    }
  }

  triggerSynchro() {
    this.synchro = true
    this.synchroCooldown = 3000
  }

  updateSynchro(dt: number, board: Board, pkm: PokemonEntity) {
    if (this.synchroCooldown - dt <= 0) {
      this.synchro = false
      this.triggerSynchro()
      if (this.burn && this.burnOrigin) {
        this.burnOrigin.status.triggerBurn(3000, this.burnOrigin, pkm)
      }
      if (this.poisonStacks && this.poisonOrigin) {
        this.poisonOrigin.status.triggerPoison(3000, this.poisonOrigin, pkm)
      }
      if (this.wound && this.woundOrigin) {
        this.woundOrigin.status.triggerWound(3000, this.woundOrigin, pkm)
      }
      if (this.silence && this.silenceOrigin) {
        this.silenceOrigin.status.triggerSilence(3000, this.silenceOrigin, pkm)
      }
    } else {
      this.synchroCooldown -= dt
    }
  }

  triggerSoulDew(timer: number) {
    this.soulDew = true
    this.soulDewCooldown = timer
  }

  updateSoulDew(dt: number, pkm: PokemonEntity) {
    if (this.soulDewCooldown - dt <= 0) {
      this.soulDew = false
      pkm.addAbilityPower(8, pkm, 0, false)
      pkm.count.soulDewCount++
      if (pkm.items.has(Item.SOUL_DEW)) {
        this.triggerSoulDew(1000)
      }
    } else {
      this.soulDewCooldown -= dt
    }
  }

  triggerDarkHarvest(duration: number) {
    this.darkHarvest = true
    if (duration > this.darkHarvestCooldown) {
      this.darkHarvestCooldown = duration
      this.darkHarvestDamageCooldown = 0
    }
  }

  updateDarkHarvest(dt: number, pkm: PokemonEntity, board: Board) {
    if (this.darkHarvestDamageCooldown - dt <= 0) {
      pkm.simulation.room.broadcast(Transfer.ABILITY, {
        id: pkm.simulation.id,
        skill: Ability.DARK_HARVEST,
        positionX: pkm.positionX,
        positionY: pkm.positionY
      })
      const crit = pkm.items.has(Item.REAPER_CLOTH)
        ? chance(pkm.critChance)
        : false
      board.getAdjacentCells(pkm.positionX, pkm.positionY).forEach((cell) => {
        if (cell?.value && cell.value.team !== pkm.team) {
          const darkHarvestDamage = [8, 16, 24][pkm.stars - 1] ?? 24
          cell.value.handleSpecialDamage(
            darkHarvestDamage,
            board,
            AttackType.SPECIAL,
            pkm,
            crit,
            true
          )

          const healFactor = [0.2, 0.3, 0.4][pkm.stars - 1] ?? 0.4
          pkm.handleHeal(
            Math.round(darkHarvestDamage * healFactor),
            pkm,
            0,
            false
          )
          this.darkHarvestDamageCooldown = 1000
        }
      })
    } else {
      this.darkHarvestDamageCooldown -= dt
    }

    if (this.darkHarvestCooldown - dt <= 0) {
      this.darkHarvest = false
    } else {
      this.darkHarvestCooldown -= dt
    }
  }

  triggerBurn(
    duration: number,
    pkm: PokemonEntity,
    origin: PokemonEntity | undefined
  ) {
    if (
      !pkm.effects.has(Effect.IMMUNITY_BURN) &&
      !this.runeProtect &&
      pkm.passive !== Passive.WATER_BUBBLE
    ) {
      this.burn = true

      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration = Math.round(duration * 0.7)
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration = Math.round(duration * 0.4)
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration = Math.round(duration * 0.1)
      }

      if (duration > this.burnCooldown) {
        this.burnCooldown = duration
        if (origin) {
          this.burnOrigin = origin
        }
      }

      if (pkm.passive === Passive.GUTS && !this.guts) {
        this.guts = true
        pkm.addAttack(5, pkm, 0, false)
      }

      if (pkm.items.has(Item.RAWST_BERRY)) {
        pkm.eatBerry(Item.RAWST_BERRY)
      }
    }
  }

  updateBurn(dt: number, pkm: PokemonEntity, board: Board) {
    if (this.burnDamageCooldown - dt <= 0) {
      if (this.burnOrigin) {
        let burnDamage = Math.ceil(pkm.hp * 0.05)
        if (pkm.simulation.weather === Weather.SUN) {
          burnDamage = Math.round(burnDamage * 1.3)
        } else if (pkm.simulation.weather === Weather.RAIN) {
          burnDamage = Math.round(burnDamage * 0.7)
        }

        if (pkm.items.has(Item.ASSAULT_VEST)) {
          burnDamage = Math.round(burnDamage * 0.5)
        }

        pkm.handleDamage({
          damage: burnDamage,
          board,
          attackType: AttackType.TRUE,
          attacker: this.burnOrigin,
          shouldTargetGainMana: true
        })
        this.burnDamageCooldown = 1000
      }
    } else {
      this.burnDamageCooldown -= dt
    }

    if (this.burnCooldown - dt <= 0) {
      this.healBurn(pkm)
    } else {
      this.burnCooldown -= dt
    }
  }

  healBurn(pkm: PokemonEntity) {
    this.burn = false
    this.burnOrigin = undefined
    this.burnDamageCooldown = 1000
    if (pkm.passive === Passive.GUTS && this.poisonStacks === 0) {
      this.guts = false
      pkm.addAttack(-5, pkm, 0, false)
    }
  }

  triggerSilence(duration: number, pkm: PokemonEntity, origin?: PokemonEntity) {
    if (!this.runeProtect && !this.tree) {
      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration = Math.round(duration * 0.7)
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration = Math.round(duration * 0.4)
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration = Math.round(duration * 0.1)
      }

      this.silence = true
      if (duration > this.silenceCooldown) {
        this.silenceCooldown = duration
        if (origin) {
          this.silenceOrigin = origin
        }
      }
    }
  }

  updateSilence(dt: number) {
    if (this.silenceCooldown - dt <= 0) {
      this.silence = false
      this.silenceOrigin = undefined
    } else {
      this.silenceCooldown -= dt
    }
  }

  triggerPoison(
    duration: number,
    pkm: PokemonEntity,
    origin: PokemonEntity | undefined
  ) {
    if (!pkm.effects.has(Effect.IMMUNITY_POISON) && !this.runeProtect) {
      let maxStacks = 3
      if (origin) {
        this.poisonOrigin = origin
        if (origin.effects.has(Effect.VENOMOUS)) {
          maxStacks = 4
        }
        if (origin.effects.has(Effect.TOXIC)) {
          maxStacks = 5
        }
      }
      this.poisonStacks = max(maxStacks)(this.poisonStacks + 1)

      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration = Math.round(duration * 0.7)
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration = Math.round(duration * 0.4)
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration = Math.round(duration * 0.1)
      }

      if (duration > this.poisonCooldown) {
        this.poisonCooldown = duration
      }
      if (pkm.passive === Passive.GUTS && !this.guts) {
        this.guts = true
        pkm.addAttack(5, pkm, 0, false)
      }

      if (pkm.passive === Passive.TOXIC_BOOST && !this.toxicBoost) {
        this.toxicBoost = true
        pkm.addAttack(10, pkm, 0, false)
      }

      if (pkm.items.has(Item.PECHA_BERRY)) {
        pkm.eatBerry(Item.PECHA_BERRY)
      }
    }
  }

  updatePoison(dt: number, pkm: PokemonEntity, board: Board) {
    if (this.poisonDamageCooldown - dt <= 0) {
      let poisonDamage = Math.ceil(pkm.hp * 0.05 * this.poisonStacks)
      if (pkm.simulation.weather === Weather.RAIN) {
        poisonDamage *= 0.7
      }

      if (pkm.items.has(Item.ASSAULT_VEST)) {
        poisonDamage *= 0.5
      }
      if (pkm.passive === Passive.TOXIC_BOOST) {
        poisonDamage *= 0.5
      }

      if (
        pkm.passive === Passive.POISON_HEAL ||
        pkm.passive === Passive.GLIGAR
      ) {
        pkm.handleHeal(Math.round(poisonDamage), pkm, 0, false)
      } else {
        pkm.handleDamage({
          damage: Math.round(poisonDamage),
          board,
          attackType: AttackType.TRUE,
          attacker: this.poisonOrigin ?? null,
          shouldTargetGainMana: false
        })
      }

      if (pkm.effects.has(Effect.POISON_GAS)) {
        // reapply poison stack on every poison tick if in poison gas
        this.triggerPoison(1500, pkm, undefined)
      }

      this.poisonDamageCooldown = 1000
    } else {
      this.poisonDamageCooldown -= dt
    }

    if (this.poisonCooldown - dt <= 0) {
      this.poisonStacks = 0
      this.poisonOrigin = undefined
      this.poisonDamageCooldown = 1000
      if (pkm.passive === Passive.GUTS && !this.burn) {
        this.guts = false
        pkm.addAttack(-5, pkm, 0, false)
      }
      if (pkm.passive === Passive.TOXIC_BOOST) {
        this.toxicBoost = false
        pkm.addAttack(-10, pkm, 0, false)
      }
    } else {
      this.poisonCooldown = this.poisonCooldown - dt
    }
  }

  triggerFreeze(duration: number, pkm: PokemonEntity) {
    if (
      !this.freeze && // freeze cannot be stacked
      !this.runeProtect &&
      !pkm.effects.has(Effect.IMMUNITY_FREEZE)
    ) {
      if (pkm.simulation.weather === Weather.SNOW) {
        duration *= 1.3
      } else if (pkm.simulation.weather === Weather.SUN) {
        duration *= 0.7
      }
      if (pkm.status.enraged) {
        duration = duration / 2
      }
      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration *= 0.7
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration *= 0.4
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration *= 0.1
      }

      this.freeze = true
      this.freezeCooldown = Math.round(duration)

      if (pkm.items.has(Item.ASPEAR_BERRY)) {
        pkm.eatBerry(Item.ASPEAR_BERRY)
      }
    }
  }

  updateFreeze(dt: number) {
    if (this.freezeCooldown - dt <= 0) {
      this.freeze = false
    } else {
      this.freezeCooldown -= dt
    }
  }

  triggerProtect(timer: number) {
    if (!this.protect && !this.enraged) {
      // protect cannot be stacked
      this.protect = true
      this.protectCooldown = timer
    }
  }

  updateProtect(dt: number) {
    if (this.protectCooldown - dt <= 0) {
      this.protect = false
    } else {
      this.protectCooldown -= dt
    }
  }

  triggerSleep(duration: number, pkm: PokemonEntity) {
    if (
      !this.sleep &&
      !this.runeProtect &&
      !pkm.effects.has(Effect.IMMUNITY_SLEEP)
    ) {
      if (pkm.simulation.weather === Weather.NIGHT) {
        duration *= 1.3
      }
      if (pkm.status.enraged) {
        duration = duration / 2
      }
      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration *= 0.7
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration *= 0.4
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration *= 0.1
      }

      this.sleep = true
      this.sleepCooldown = Math.round(duration)

      if (pkm.items.has(Item.CHESTO_BERRY)) {
        pkm.eatBerry(Item.CHESTO_BERRY)
      }
    }
  }

  updateSleep(dt: number) {
    if (this.sleepCooldown - dt <= 0) {
      this.sleep = false
    } else {
      this.sleepCooldown = this.sleepCooldown - dt
    }
  }

  triggerConfusion(duration: number, pkm: PokemonEntity) {
    if (
      !this.confusion &&
      !this.runeProtect &&
      !pkm.effects.has(Effect.IMMUNITY_CONFUSION)
    ) {
      if (pkm.simulation.weather === Weather.SANDSTORM) {
        duration *= 1.3
      }
      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration *= 0.7
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration *= 0.4
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration *= 0.1
      }

      this.confusion = true
      this.confusionCooldown = Math.round(duration)

      if (pkm.items.has(Item.PERSIM_BERRY)) {
        pkm.eatBerry(Item.PERSIM_BERRY)
      }

      if (pkm.passive === Passive.PSYDUCK) {
        pkm.addAbilityPower(100, pkm, 0, false)
      }
    }
  }

  updateConfusion(dt: number) {
    if (this.confusionCooldown - dt <= 0) {
      this.confusion = false
    } else {
      this.confusionCooldown -= dt
    }
  }

  triggerCharm(
    duration: number,
    pkm: IPokemonEntity,
    origin: PokemonEntity,
    apBoost = false
  ) {
    if (!this.charm && !this.runeProtect) {
      const boost = apBoost && origin ? (duration * origin.ap) / 100 : 0
      duration = duration + boost
      if (pkm.simulation.weather === Weather.MISTY) {
        duration *= 1.3
      }
      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration *= 0.7
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration *= 0.4
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration *= 0.1
      }
      this.charm = true
      this.charmCooldown = duration
      this.charmOrigin = origin
      if (origin) {
        pkm.targetX = origin?.positionX
        pkm.targetY = origin?.positionY
      }
    }
  }

  updateCharm(dt: number) {
    if (this.charmCooldown - dt <= 0) {
      this.charm = false
      this.charmOrigin = undefined
    } else {
      this.charmCooldown -= dt
    }
  }

  triggerWound(
    duration: number,
    pkm: PokemonEntity,
    origin: PokemonEntity | undefined
  ) {
    if (!this.runeProtect) {
      this.wound = true
      if (pkm.simulation.weather === Weather.BLOODMOON) {
        duration *= 1.3
      }
      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration *= 0.7
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration *= 0.4
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration *= 0.1
      }

      if (duration > this.woundCooldown) {
        this.woundCooldown = duration
        if (origin) {
          this.woundOrigin = origin
        }
      }
    }
  }

  updateWound(dt: number) {
    if (this.woundCooldown - dt <= 0) {
      this.wound = false
      this.woundOrigin = undefined
    } else {
      this.woundCooldown -= dt
    }
  }

  triggerParalysis(duration: number, pkm: PokemonEntity) {
    if (!this.runeProtect && !pkm.effects.has(Effect.IMMUNITY_PARALYSIS)) {
      if (!this.paralysis) {
        this.paralysis = true
        pkm.addAttackSpeed(-40, pkm, 0, false)
      }
      if (pkm.simulation.weather === Weather.STORM) {
        duration *= 1.3
      }
      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration *= 0.7
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration *= 0.4
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration *= 0.1
      }

      if (duration > this.paralysisCooldown) {
        this.paralysisCooldown = Math.round(duration)
      }

      if (pkm.items.has(Item.CHERI_BERRY)) {
        pkm.eatBerry(Item.CHERI_BERRY)
      }
    }
  }

  updateParalysis(dt: number, pkm: PokemonEntity) {
    if (this.paralysisCooldown - dt <= 0) {
      this.healParalysis(pkm)
    } else {
      this.paralysisCooldown -= dt
    }
  }

  healParalysis(pkm: PokemonEntity) {
    if (this.paralysis) {
      this.paralysis = false
      this.paralysisCooldown = 0
      pkm.addAttackSpeed(40, pkm, 0, false)
    }
  }

  triggerRuneProtect(timer: number) {
    this.runeProtect = true
    this.clearNegativeStatus()
    if (timer > this.runeProtectCooldown) {
      this.runeProtectCooldown = timer
    }
  }

  updateRuneProtect(dt: number) {
    if (this.runeProtectCooldown - dt <= 0) {
      this.runeProtect = false
    } else {
      this.runeProtectCooldown -= dt
    }
  }

  triggerFlinch(duration: number, pkm: PokemonEntity, origin?: PokemonEntity) {
    if (!this.runeProtect) {
      this.flinch = true
      if (pkm.effects.has(Effect.SWIFT_SWIM)) {
        duration *= 0.7
      } else if (pkm.effects.has(Effect.HYDRATION)) {
        duration *= 0.4
      } else if (pkm.effects.has(Effect.WATER_VEIL)) {
        duration *= 0.1
      }
      if (duration > this.flinchCooldown) {
        this.flinchCooldown = Math.round(duration)
      }
    }
  }

  updateFlinch(dt: number) {
    if (this.flinchCooldown - dt <= 0) {
      this.flinch = false
    } else {
      this.flinchCooldown -= dt
    }
  }

  triggerSpikeArmor(timer: number) {
    this.spikeArmor = true
    if (timer > this.spikeArmorCooldown) {
      this.spikeArmorCooldown = timer
    }
  }

  updateSpikeArmor(dt: number) {
    if (this.spikeArmorCooldown - dt <= 0) {
      this.spikeArmor = false
    } else {
      this.spikeArmorCooldown -= dt
    }
  }

  triggerMagicBounce(timer: number) {
    this.magicBounce = true
    if (timer > this.magicBounceCooldown) {
      this.magicBounceCooldown = timer
    }
  }

  updateMagicBounce(dt: number) {
    if (this.magicBounceCooldown - dt <= 0) {
      this.magicBounce = false
    } else {
      this.magicBounceCooldown -= dt
    }
  }

  triggerResurection(pokemon: PokemonEntity) {
    this.resurection = false
    this.resurecting = true
    this.resurectingCooldown = 2000
    pokemon.status.clearNegativeStatus()
  }

  updateResurecting(dt: number, pokemon: PokemonEntity) {
    if (this.resurectingCooldown - dt <= 0) {
      this.resurecting = false
      pokemon.resurrect()
      pokemon.toMovingState()
      pokemon.cooldown = 0
    } else {
      this.resurectingCooldown -= dt
    }
  }

  triggerCurse(timer: number) {
    if (!this.runeProtect) {
      if (this.curse) {
        this.curseCooldown = 0 // apply curse immediately if already cursed
      } else {
        this.curse = true
        this.curseCooldown = timer
      }
    }
  }

  updateCurse(dt: number, board: Board, pokemon: PokemonEntity) {
    if (this.curseCooldown - dt <= 0) {
      this.curse = false
      pokemon.handleDamage({
        damage: 9999,
        board,
        attacker: null,
        attackType: AttackType.TRUE,
        shouldTargetGainMana: false
      })
      pokemon.simulation.room.broadcast(Transfer.ABILITY, {
        id: pokemon.simulation.id,
        skill: "CURSE_EFFECT",
        positionX: pokemon.positionX,
        positionY: pokemon.positionY,
        orientation: pokemon.orientation
      })
    } else {
      this.curseCooldown -= dt
    }
  }
}
