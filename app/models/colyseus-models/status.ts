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
  @type("boolean") pokerus = false
  @type("boolean") locked = false
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
  burnDuration = 0
  burnDamageCooldown = 1000
  silenceDuration = 0
  poisonDuration = 0
  poisonDamageCooldown = 1000
  freezeDuration = 0
  protectDuration = 0
  sleepDuration = 0
  confusionDuration = 0
  woundDuration = 0
  soulDewCooldown = 0
  paralysisDuration = 0
  armorReductionDuration = 0
  runeProtectDuration = 0
  charmDuration = 0
  flinchDuration = 0
  spikeArmorDuration = 0
  magicBounceDuration = 0
  synchroCooldown = 3000
  magmaStormCooldown = 0
  synchro = false
  tree = false
  resurrectingDuration = 0
  doubleDamage = false
  drySkin = false
  drySkinCooldown = 1000
  curseDuration = 0
  pokerusCooldown = 2000
  lockedDuration = 0
  enrageDelay = 35000
  darkHarvest = false
  darkHarvestDuration = 0
  darkHarvestDamageCooldown = 0

  clearNegativeStatus() {
    this.burnDuration = 0
    this.silenceDuration = 0
    this.poisonDuration = 0
    this.freezeDuration = 0
    this.sleepDuration = 0
    this.confusionDuration = 0
    this.woundDuration = 0
    this.paralysisDuration = 0
    this.charmDuration = 0
    this.flinchDuration = 0
    this.armorReductionDuration = 0
    this.curseDuration = 0
    this.curse = false
    this.lockedDuration = 0
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
      this.curse ||
      this.locked
    )
  }

  updateAllStatus(dt: number, pokemon: PokemonEntity, board: Board) {
    if (
      pokemon.effects.has(Effect.POISON_GAS) && 
      this.poisonStacks === 0
    ) {
      this.triggerPoison(1500, pokemon, undefined)
    }

    if (
      pokemon.effects.has(Effect.STICKY_WEB) && 
      !this.paralysis
    ) {
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

    if (this.locked) {
      this.updateLocked(dt, pokemon)
    }

    if (this.pokerus) {
      this.updatePokerus(dt, pokemon, board)
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

    if (
      pokemon.effects.has(Effect.CURSE_OF_FATE) && 
      !pokemon.status.curse
    ) {
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
    this.magmaStormCooldown -= dt
    if (this.magmaStormCooldown <= 0) {
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
    }
  }

  triggerArmorReduction(duration: number, pkm: PokemonEntity) {
    if (!this.runeProtect) {
      this.armorReduction = true

      duration = applyAquaticReduction(duration, pkm)

      if (duration > this.armorReductionDuration) {
        this.armorReductionDuration = Math.round(duration)
      }
    }
  }

  updateArmorReduction(dt: number) {
    this.armorReductionDuration -= dt
    if (this.armorReductionDuration <= 0) {
      this.armorReduction = false
    }
  }

  updateRage(dt: number, pokemon: PokemonEntity) {
    this.enrageDelay -= dt
    if (this.enrageDelay <= 0 && !pokemon.simulation.finished) {
      this.enraged = true
      this.protect = false
      pokemon.addAttackSpeed(100, pokemon, 0, false)
    }
  }

  triggerClearWing(timer: number) {
    if (!this.clearWing) {
      this.clearWing = true
      this.clearWingCooldown = timer
    }
  }

  updateClearWing(dt: number, pkm: PokemonEntity) {
    this.clearWingCooldown -= dt
    if (this.clearWingCooldown <= 0) {
      this.clearWing = false
      this.triggerClearWing(1000)
      pkm.addAttackSpeed(2, pkm, 0, false)
    }
  }

  triggerDrySkin(timer: number) {
    if (!this.drySkin) {
      this.drySkin = true
      this.drySkinCooldown = timer
    }
  }

  updateDrySkin(dt: number, pkm: PokemonEntity) {
    this.drySkinCooldown -= dt
    if (this.drySkinCooldown <= 0) {
      this.drySkin = false
      this.triggerDrySkin(1000)
      pkm.handleHeal(8, pkm, 0, false)
    }
  }

  triggerSynchro() {
    this.synchro = true
    this.synchroCooldown = 3000
  }

  updateSynchro(dt: number, board: Board, pkm: PokemonEntity) {
    this.synchroCooldown -= dt
    if (this.synchroCooldown <= 0) {
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
    }
  }

  triggerSoulDew(timer: number) {
    this.soulDew = true
    this.soulDewCooldown = timer
  }

  updateSoulDew(dt: number, pkm: PokemonEntity) {
    this.soulDewCooldown -= dt
    if (this.soulDewCooldown <= 0) {
      this.soulDew = false
      pkm.addAbilityPower(10, pkm, 0, false)
      pkm.count.soulDewCount++
      if (pkm.items.has(Item.SOUL_DEW)) {
        this.triggerSoulDew(1000)
      }
    }
  }

  triggerDarkHarvest(duration: number) {
    this.darkHarvest = true
    if (duration > this.darkHarvestDuration) {
      this.darkHarvestDuration = duration
      this.darkHarvestDamageCooldown = 0
    }
  }

  updateDarkHarvest(dt: number, pkm: PokemonEntity, board: Board) {
    this.darkHarvestDuration -= dt
    this.darkHarvestDamageCooldown -= dt

    if (this.darkHarvestDamageCooldown <= 0) {
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
          const darkHarvestDamage = [5, 10, 20][pkm.stars - 1] ?? 20
          cell.value.handleSpecialDamage(
            darkHarvestDamage,
            board,
            AttackType.SPECIAL,
            pkm,
            crit,
            true
          )

          const healFactor = 0.3
          pkm.handleHeal(
            Math.round(darkHarvestDamage * healFactor),
            pkm,
            0,
            false
          )
          this.darkHarvestDamageCooldown = 1000
        }
      })
    }

    if (this.darkHarvestDuration <= 0) {
      this.darkHarvest = false
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

      duration = applyAquaticReduction(duration, pkm)

      if (duration > this.burnDuration) {
        this.burnDuration = duration
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
    this.burnDamageCooldown -= dt
    this.burnDuration -= dt

    if (this.burnDamageCooldown <= 0) {
      let burnDamage = Math.ceil(pkm.hp * 0.05)

      if (pkm.simulation.weather === Weather.SUN) {
        burnDamage = burnDamage * 1.3
      } else if (pkm.simulation.weather === Weather.RAIN) {
        burnDamage = burnDamage * 0.7
      }

      if (pkm.items.has(Item.ASSAULT_VEST)) {
        burnDamage = burnDamage * 0.5
      }

      pkm.handleDamage({
        damage: Math.round(burnDamage),
        board,
        attackType: AttackType.TRUE,
        attacker: this.burnOrigin ?? null,
        shouldTargetGainMana: true // Why? Poison doesn't give mana on trigger, so either Poison should or Burn shouldn't.
      })

      this.burnDamageCooldown = 1000
    }

    if (this.burnDuration <= 0) {
      this.healBurn(pkm)
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
      duration = applyAquaticReduction(duration, pkm)

      this.silence = true
      if (duration > this.silenceDuration) {
        this.silenceDuration = duration
        if (origin) {
          this.silenceOrigin = origin
        }
      }
    }
  }

  updateSilence(dt: number) {
    this.silenceDuration -= dt
    if (this.silenceDuration <= 0) {
      this.silence = false
      this.silenceOrigin = undefined
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

      duration = applyAquaticReduction(duration, pkm)

      if (duration > this.poisonDuration) {
        this.poisonDuration = duration
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
    this.poisonDamageCooldown -= dt
    this.poisonDuration -= dt

    if (this.poisonDamageCooldown <= 0) {
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
    }

    if (this.poisonDuration <= 0) {
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
    }
  }

  triggerFreeze(duration: number, pkm: PokemonEntity) {
    if (
      !this.freeze && // freeze cannot be stacked
      !this.runeProtect &&
      !this.skydiving &&
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

      duration = applyAquaticReduction(duration, pkm)

      this.freeze = true
      this.freezeDuration = Math.round(duration)

      if (pkm.items.has(Item.ASPEAR_BERRY)) {
        pkm.eatBerry(Item.ASPEAR_BERRY)
      }
    }
  }

  updateFreeze(dt: number) {
    this.freezeDuration -= dt
    if (this.freezeDuration <= 0) {
      this.freeze = false
    }
  }

  triggerProtect(timer: number) {
    if (!this.protect && !this.enraged) {
      // protect cannot be stacked
      this.protect = true
      this.protectDuration = timer
    }
  }

  updateProtect(dt: number) {
    this.protectDuration -= dt
    if (this.protectDuration <= 0) {
      this.protect = false
    }
  }

  triggerSleep(duration: number, pkm: PokemonEntity) {
    if (
      !this.sleep &&
      !this.runeProtect &&
      !this.skydiving &&
      !pkm.effects.has(Effect.IMMUNITY_SLEEP)
    ) {
      if (pkm.simulation.weather === Weather.NIGHT) {
        duration *= 1.3
      }
      if (pkm.status.enraged) {
        duration = duration / 2
      }

      duration = applyAquaticReduction(duration, pkm)

      this.sleep = true
      this.sleepDuration = Math.round(duration)

      if (pkm.items.has(Item.CHESTO_BERRY)) {
        pkm.eatBerry(Item.CHESTO_BERRY)
      }
    }
  }

  updateSleep(dt: number) {
    this.sleepDuration -= dt
    if (this.sleepDuration <= 0) {
      this.sleep = false
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

      duration = applyAquaticReduction(duration, pkm)

      this.confusion = true
      this.confusionDuration = Math.round(duration)

      if (pkm.items.has(Item.PERSIM_BERRY)) {
        pkm.eatBerry(Item.PERSIM_BERRY)
      }

      if (pkm.passive === Passive.PSYDUCK) {
        pkm.addAbilityPower(100, pkm, 0, false)
      }
    }
  }

  updateConfusion(dt: number) {
    this.confusionDuration -= dt
    if (this.confusionDuration <= 0) {
      this.confusion = false
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

      duration = applyAquaticReduction(duration, pkm)

      this.charm = true
      this.charmDuration = duration
      this.charmOrigin = origin
      if (origin) {
        pkm.targetX = origin?.positionX
        pkm.targetY = origin?.positionY
      }
    }
  }

  updateCharm(dt: number) {
    this.charmDuration -= dt
    if (this.charmDuration <= 0) {
      this.charm = false
      this.charmOrigin = undefined
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

      duration = applyAquaticReduction(duration, pkm)

      if (duration > this.woundDuration) {
        this.woundDuration = duration
        if (origin) {
          this.woundOrigin = origin
        }
      }
    }
  }

  updateWound(dt: number) {
    this.woundDuration -= dt
    if (this.woundDuration <= 0) {
      this.wound = false
      this.woundOrigin = undefined
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

      duration = applyAquaticReduction(duration, pkm)

      if (duration > this.paralysisDuration) {
        this.paralysisDuration = Math.round(duration)
      }

      if (pkm.items.has(Item.CHERI_BERRY)) {
        pkm.eatBerry(Item.CHERI_BERRY)
      }
    }
  }

  updateParalysis(dt: number, pkm: PokemonEntity) {
    this.paralysisDuration -= dt
    if (this.paralysisDuration <= 0) {
      this.healParalysis(pkm)
    }
  }

  healParalysis(pkm: PokemonEntity) {
    if (this.paralysis) {
      this.paralysis = false
      this.paralysisDuration = 0
      pkm.addAttackSpeed(40, pkm, 0, false)
    }
  }

  triggerRuneProtect(timer: number) {
    this.runeProtect = true
    this.clearNegativeStatus()
    if (timer > this.runeProtectDuration) {
      this.runeProtectDuration = timer
    }
  }

  updateRuneProtect(dt: number) {
    this.runeProtectDuration -= dt
    if (this.runeProtectDuration <= 0) {
      this.runeProtect = false
    }
  }

  triggerFlinch(duration: number, pkm: PokemonEntity, origin?: PokemonEntity) {
    if (!this.runeProtect) {
      this.flinch = true
      duration = applyAquaticReduction(duration, pkm)
      if (duration > this.flinchDuration) {
        this.flinchDuration = Math.round(duration)
      }
    }
  }

  updateFlinch(dt: number) {
    this.flinchDuration -= dt
    if (this.flinchDuration <= 0) {
      this.flinch = false
    }
  }

  triggerSpikeArmor(timer: number) {
    this.spikeArmor = true
    if (timer > this.spikeArmorDuration) {
      this.spikeArmorDuration = timer
    }
  }

  updateSpikeArmor(dt: number) {
    this.spikeArmorDuration -= dt
    if (this.spikeArmorDuration <= 0) {
      this.spikeArmor = false
    }
  }

  triggerMagicBounce(timer: number) {
    this.magicBounce = true
    if (timer > this.magicBounceDuration) {
      this.magicBounceDuration = timer
    }
  }

  updateMagicBounce(dt: number) {
    this.magicBounceDuration -= dt
    if (this.magicBounceDuration <= 0) {
      this.magicBounce = false
    }
  }

  triggerResurection(pokemon: PokemonEntity) {
    this.resurection = false
    this.resurecting = true
    this.resurrectingDuration = 2000
    pokemon.status.clearNegativeStatus()
  }

  updateResurecting(dt: number, pokemon: PokemonEntity) {
    this.resurrectingDuration -= dt
    if (this.resurrectingDuration <= 0) {
      this.resurecting = false
      pokemon.resurrect()
      pokemon.toMovingState()
      pokemon.cooldown = 0
    }
  }

  triggerCurse(timer: number) {
    if (!this.runeProtect) {
      if (this.curse) {
        this.curseDuration = 0 // apply curse immediately if already cursed
      } else {
        this.curse = true
        this.curseDuration = timer
      }
    }
  }

  updateCurse(dt: number, board: Board, pokemon: PokemonEntity) {
    this.curseDuration -= dt
    if (this.curseDuration <= 0) {
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
    }
  }

  triggerPokerus() {
    if (!this.pokerus) {
      this.pokerus = true
    }
  }

  updatePokerus(dt: number, pokemon: PokemonEntity, board: Board) {
    this.pokerusCooldown -= dt

    if (this.pokerusCooldown <= 0) {
      pokemon.addAttack(1, pokemon, 0, false)
      pokemon.addAbilityPower(10, pokemon, 0, false)
      let infectCount = 0
      const cells = board.getAdjacentCells(
        pokemon.positionX,
        pokemon.positionY,
        false
      )
      cells.forEach((cell) => {
        if (infectCount < 2 && cell.value !== undefined) {
          if (
            cell.value.team === pokemon.team &&
            cell.value.status.pokerus === false
          ) {
            cell.value.status.triggerPokerus()
            infectCount++
          }
        }
      })
      this.pokerusCooldown = 2000
    }
  }

  triggerLocked(duration: number, pkm: PokemonEntity) {
    if (
      !this.locked && // lock cannot be stacked
      !this.runeProtect
    ) {
      if (pkm.status.enraged) {
        duration = duration / 2
      }

      duration = applyAquaticReduction(duration, pkm)

      this.locked = true
      this.lockedDuration = Math.round(duration)
      pkm.range = 1
    }
  }

  updateLocked(dt: number, pokemon: PokemonEntity) {
    this.lockedDuration -= dt
    if (this.lockedDuration <= 0) {
      this.locked = false
      pokemon.range = pokemon.baseRange
    }
  }

  private applyAquaticReduction(duration: number, pkm: PokemonEntity) : number {
    if (pkm.effects.has(Effect.SWIFT_SWIM)) {
      duration *= 0.7
    } else if (pkm.effects.has(Effect.HYDRATION)) {
      duration *= 0.4
    } else if (pkm.effects.has(Effect.WATER_VEIL)) {
      duration *= 0.1
    }
    return duration
  }
}
