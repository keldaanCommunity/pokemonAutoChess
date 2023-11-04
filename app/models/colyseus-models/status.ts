import { Schema, type } from "@colyseus/schema"
import Board from "../../core/board"
import PokemonEntity from "../../core/pokemon-entity"
import { IPokemonEntity, IStatus, Transfer } from "../../types"
import { Effect } from "../../types/enum/Effect"
import { AttackType } from "../../types/enum/Game"
import { Item } from "../../types/enum/Item"
import { Weather } from "../../types/enum/Weather"
import { max } from "../../utils/number"
import { Ability } from "../../types/enum/Ability"
import { Passive } from "../../types/enum/Passive"
import { Synergy } from "../../types/enum/Synergy"

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
  @type("boolean") electricField = false
  @type("boolean") psychicField = false
  @type("boolean") grassField = false
  @type("boolean") fairyField = false
  @type("boolean") spikeArmor = false
  @type("boolean") magicBounce = false
  @type("boolean") light = false
  magmaStorm = false
  soulDew = false
  deltaOrbStacks = 0
  clearWing = false
  guts = false
  burnOrigin: PokemonEntity | undefined = undefined
  poisonOrigin: PokemonEntity | undefined = undefined
  silenceOrigin: PokemonEntity | undefined = undefined
  woundOrigin: PokemonEntity | undefined = undefined
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
  }

  updateAllStatus(dt: number, pokemon: PokemonEntity, board: Board) {
    if (pokemon.effects.has(Effect.POISON_GAS) && this.poisonStacks === 0) {
      this.triggerPoison(1500, pokemon, undefined)
    }

    if (
      pokemon.effects.has(Effect.STEALTH_ROCKS) &&
      !pokemon.types.has(Synergy.ROCK) &&
      !pokemon.types.has(Synergy.FLYING) &&
      !this.wound
    ) {
      pokemon.handleDamage({
        damage: 10,
        board,
        attackType: AttackType.PHYSICAL,
        attacker: null,
        shouldTargetGainMana: true
      })
      this.triggerWound(1000, pokemon, undefined, board)
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

    if (this.paralysis) {
      this.updateParalysis(dt, pokemon)
    }

    if (this.armorReduction) {
      this.updateArmorReduction(dt)
    }

    if (this.charm) {
      this.updateCharm(dt)
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
      this.magmaStormCooldown = this.magmaStormCooldown - dt
    }
  }

  triggerArmorReduction(timer: number) {
    if (!this.runeProtect) {
      this.armorReduction = true
      if (timer > this.armorReductionCooldown) {
        this.armorReductionCooldown = timer
      }
    }
  }

  updateArmorReduction(dt: number) {
    if (this.armorReductionCooldown - dt <= 0) {
      this.armorReduction = false
    } else {
      this.armorReductionCooldown = this.armorReductionCooldown - dt
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
      pkm.addAttackSpeed(2, false)
    } else {
      this.clearWingCooldown = this.clearWingCooldown - dt
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
      pkm.handleHeal(8, pkm, 0)
    } else {
      this.drySkinCooldown = this.drySkinCooldown - dt
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
        this.burnOrigin.status.triggerBurn(3000, this.burnOrigin, pkm, board)
      }
      if (this.poisonStacks && this.poisonOrigin) {
        this.poisonOrigin.status.triggerPoison(3000, this.poisonOrigin, pkm)
      }
      if (this.wound && this.woundOrigin) {
        this.woundOrigin.status.triggerWound(3000, this.woundOrigin, pkm, board)
      }
      if (this.silence && this.silenceOrigin) {
        this.silenceOrigin.status.triggerSilence(
          3000,
          this.silenceOrigin,
          pkm,
          board
        )
      }
    } else {
      this.synchroCooldown = this.synchroCooldown - dt
    }
  }

  triggerSoulDew(timer: number) {
    this.soulDew = true
    this.soulDewCooldown = timer
  }

  updateSoulDew(dt: number, pkm: PokemonEntity) {
    if (this.soulDewCooldown - dt <= 0) {
      this.soulDew = false
      pkm.addAbilityPower(8)
      pkm.count.soulDewCount++
      if (pkm.items.has(Item.SOUL_DEW)) {
        this.triggerSoulDew(1000)
      }
    } else {
      this.soulDewCooldown = this.soulDewCooldown - dt
    }
  }

  triggerBurn(
    timer: number,
    pkm: PokemonEntity,
    origin: PokemonEntity | undefined,
    board: Board
  ) {
    // fluffy tail prevents burn but not rune protect
    if (
      !pkm.effects.has(Effect.IMMUNITY_BURN) &&
      (!this.runeProtect ||
        (pkm.items.has(Item.FLAME_ORB) && !pkm.items.has(Item.FLUFFY_TAIL))) // can escape flame orb burn only with fluffy tail
    ) {
      this.burn = true
      if (timer > this.burnCooldown) {
        this.burnCooldown = timer
        if (origin) {
          this.burnOrigin = origin
        }
      }

      if (pkm.passive === Passive.GUTS && !this.guts) {
        this.guts = true
        pkm.addAttack(5, false)
      }

      if (pkm.items.has(Item.RAWST_BERRY)) {
        this.healBurn(pkm)
        pkm.items.delete(Item.RAWST_BERRY)
        pkm.refToBoardPokemon.items.delete(Item.RAWST_BERRY)
        pkm.effects.add(Effect.IMMUNITY_BURN)
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
      this.burnDamageCooldown = this.burnDamageCooldown - dt
    }

    if (this.burnCooldown - dt <= 0) {
      this.healBurn(pkm)
    } else {
      this.burnCooldown = this.burnCooldown - dt
    }
  }

  healBurn(pkm: PokemonEntity) {
    this.burn = false
    this.burnOrigin = undefined
    this.burnDamageCooldown = 0
    if (pkm.passive === Passive.GUTS && this.poisonStacks === 0) {
      this.guts = false
      pkm.addAttack(-5, false)
    }
  }

  triggerSilence(
    timer: number,
    pkm: PokemonEntity,
    origin: PokemonEntity | undefined,
    board: Board
  ) {
    if (!this.runeProtect && !this.tree) {
      this.silence = true
      if (timer > this.silenceCooldown) {
        this.silenceCooldown = timer
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
      this.silenceCooldown = this.silenceCooldown - dt
    }
  }

  triggerPoison(
    timer: number,
    pkm: PokemonEntity,
    origin: PokemonEntity | undefined
  ) {
    if (!this.runeProtect && !pkm.effects.has(Effect.IMMUNITY_POISON)) {
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
      if (timer > this.poisonCooldown) {
        this.poisonCooldown = timer
      }
      if (pkm.passive === Passive.GUTS && !this.guts) {
        this.guts = true
        pkm.addAttack(5, false)
      }

      if (pkm.items.has(Item.PECHA_BERRY)) {
        this.poisonOrigin = undefined
        this.poisonStacks = 0
        this.poisonDamageCooldown = 0
        pkm.items.delete(Item.PECHA_BERRY)
        pkm.refToBoardPokemon.items.delete(Item.PECHA_BERRY)
        pkm.effects.add(Effect.IMMUNITY_POISON)
      }
    }
  }

  updatePoison(dt: number, pkm: PokemonEntity, board: Board) {
    if (this.poisonDamageCooldown - dt <= 0) {
      let poisonDamage = Math.ceil(pkm.hp * 0.05 * this.poisonStacks)
      if (pkm.simulation.weather === Weather.RAIN) {
        poisonDamage = Math.round(poisonDamage * 0.7)
      }

      if (pkm.items.has(Item.ASSAULT_VEST)) {
        poisonDamage = Math.round(poisonDamage * 0.5)
      }

      if (
        pkm.passive === Passive.POISON_HEAL ||
        pkm.passive === Passive.GLIGAR
      ) {
        pkm.handleHeal(poisonDamage, pkm, 0)
      } else {
        pkm.handleDamage({
          damage: poisonDamage,
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
      if (pkm.passive === Passive.GUTS && !this.burn) {
        this.guts = false
        pkm.addAttack(-5, false)
      }
    } else {
      this.poisonCooldown = this.poisonCooldown - dt
    }
  }

  triggerFreeze(timer: number, pkm: PokemonEntity) {
    if (
      !this.freeze && // freeze cannot be stacked
      !this.runeProtect &&
      !pkm.effects.has(Effect.IMMUNITY_FREEZE)
    ) {
      if (pkm.simulation.weather === Weather.SNOW) {
        timer = Math.round(timer * 1.3)
      } else if (pkm.simulation.weather === Weather.SUN) {
        timer = Math.round(timer * 0.7)
      }
      this.freeze = true
      this.freezeCooldown = timer

      if (pkm.items.has(Item.ASPEAR_BERRY)) {
        this.freeze = false
        this.freezeCooldown = 0
        pkm.items.delete(Item.ASPEAR_BERRY)
        pkm.refToBoardPokemon.items.delete(Item.ASPEAR_BERRY)
        pkm.effects.add(Effect.IMMUNITY_FREEZE)
      }
    }
  }

  updateFreeze(dt: number) {
    if (this.freezeCooldown - dt <= 0) {
      this.freeze = false
    } else {
      this.freezeCooldown = this.freezeCooldown - dt
    }
  }

  triggerProtect(timer: number) {
    if (!this.protect) {
      // protect cannot be stacked
      this.protect = true
      this.protectCooldown = timer
    }
  }

  updateProtect(dt: number) {
    if (this.protectCooldown - dt <= 0) {
      this.protect = false
    } else {
      this.protectCooldown = this.protectCooldown - dt
    }
  }

  triggerSleep(timer: number, pkm: PokemonEntity) {
    if (
      !this.sleep &&
      !this.runeProtect &&
      !pkm.effects.has(Effect.IMMUNITY_SLEEP)
    ) {
      if (pkm.simulation.weather === Weather.NIGHT) {
        timer = Math.round(timer * 1.3)
      }
      this.sleep = true
      this.sleepCooldown = timer

      if (pkm.items.has(Item.CHESTO_BERRY)) {
        this.sleep = false
        this.sleepCooldown = 1000
        pkm.items.delete(Item.CHESTO_BERRY)
        pkm.refToBoardPokemon.items.delete(Item.CHESTO_BERRY)
        pkm.effects.add(Effect.IMMUNITY_SLEEP)
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

  triggerConfusion(
    timer: number,
    pkm: PokemonEntity,
    origin: IPokemonEntity | undefined = undefined,
    apBoost = false
  ) {
    if (
      !this.confusion &&
      !this.runeProtect &&
      !pkm.effects.has(Effect.IMMUNITY_CONFUSION)
    ) {
      const boost = apBoost && origin ? (timer * origin.ap) / 100 : 0
      timer = timer + boost
      if (pkm.simulation.weather === Weather.SANDSTORM) {
        timer = Math.round(timer * 1.3)
      }
      this.confusion = true
      this.confusionCooldown = timer

      if (pkm.items.has(Item.PERSIM_BERRY)) {
        this.confusion = false
        this.confusionCooldown = 1000
        pkm.items.delete(Item.PERSIM_BERRY)
        pkm.refToBoardPokemon.items.delete(Item.PERSIM_BERRY)
        pkm.effects.add(Effect.IMMUNITY_CONFUSION)
      }
    }
  }

  updateConfusion(dt: number) {
    if (this.confusionCooldown - dt <= 0) {
      this.confusion = false
    } else {
      this.confusionCooldown = this.confusionCooldown - dt
    }
  }

  triggerCharm(
    timer: number,
    pkm: IPokemonEntity,
    origin: IPokemonEntity | undefined = undefined,
    apBoost = false
  ) {
    if (!this.charm && !this.runeProtect) {
      const boost = apBoost && origin ? (timer * origin.ap) / 100 : 0
      timer = timer + boost
      if (pkm.simulation.weather === Weather.MISTY) {
        timer = Math.round(timer * 1.3)
      }
      this.charm = true
      this.charmCooldown = timer
    }
  }

  updateCharm(dt: number) {
    if (this.charmCooldown - dt <= 0) {
      this.charm = false
    } else {
      this.charmCooldown = this.charmCooldown - dt
    }
  }

  triggerWound(
    timer: number,
    pkm: PokemonEntity,
    origin: PokemonEntity | undefined,
    board: Board
  ) {
    if (!this.runeProtect) {
      this.wound = true
      if (timer > this.woundCooldown) {
        this.woundCooldown = timer
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
      this.woundCooldown = this.woundCooldown - dt
    }
  }

  triggerParalysis(timer: number, pkm: PokemonEntity) {
    if (!this.runeProtect && !pkm.effects.has(Effect.IMMUNITY_PARALYSIS)) {
      if (!this.paralysis) {
        this.paralysis = true
        pkm.addAttackSpeed(-40)
      }
      if (pkm.simulation.weather === Weather.STORM) {
        timer = Math.round(timer * 1.3)
      }
      if (timer > this.paralysisCooldown) {
        this.paralysisCooldown = timer
      }

      if (pkm.items.has(Item.CHERI_BERRY)) {
        this.healParalysis(pkm)
        pkm.items.delete(Item.CHERI_BERRY)
        pkm.refToBoardPokemon.items.delete(Item.CHERI_BERRY)
        pkm.effects.add(Effect.IMMUNITY_PARALYSIS)
      }
    }
  }

  updateParalysis(dt: number, pkm: PokemonEntity) {
    if (this.paralysisCooldown - dt <= 0) {
      this.healParalysis(pkm)
    } else {
      this.paralysisCooldown = this.paralysisCooldown - dt
    }
  }

  healParalysis(pkm: PokemonEntity) {
    if (this.paralysis) {
      this.paralysis = false
      this.paralysisCooldown = 0
      pkm.addAttackSpeed(40)
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
      this.runeProtectCooldown = this.runeProtectCooldown - dt
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
      this.spikeArmorCooldown = this.spikeArmorCooldown - dt
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
      this.magicBounceCooldown = this.magicBounceCooldown - dt
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
      pokemon.resetStats()
      pokemon.toMovingState()
      pokemon.cooldown = 0
    } else {
      this.resurectingCooldown -= dt
    }
  }
}
