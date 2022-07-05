import {Schema, type} from '@colyseus/schema'
import Board, { Cell } from '../../core/board'
import PokemonEntity from '../../core/pokemon-entity'
import { IStatus } from '../../types'
import { Item } from '../../types/enum/Item'

export default class Status extends Schema implements IStatus{
  @type('boolean') burn = false
  @type('boolean') silence = false
  @type('boolean') poison = false
  @type('boolean') freeze = false
  @type('boolean') protect = false
  @type('boolean') sleep = false
  @type('boolean') confusion = false
  @type('boolean') wound = false
  @type('boolean') resurection = false
  @type('boolean') smoke = false
  @type('boolean') armorReduction = false
  @type('boolean') runeProtect = false
  @type('boolean') electricField = false
  @type('boolean') psychicField = false
  temporaryShield = false
  soulDew = false
  brightPowder = false
  flameOrb = false
  changeTeam = false
  burnOrigin: PokemonEntity | undefined = undefined
  poisonOrigin: PokemonEntity | undefined = undefined
  burnCooldown = 0
  silenceCooldown = 0
  poisonCooldown = 0
  freezeCooldown = 0
  protectCooldown = 0
  sleepCooldown = 0
  confusionCooldown = 0
  woundCooldown = 0
  temporaryShieldCooldown = 0
  soulDewCooldown = 0
  brightPowderCooldown = 0
  smokeCooldown = 0
  armorReductionCooldown = 0
  flameOrbCooldown = 0
  changeTeamCooldown = 0

  clearNegativeStatus(){
    this.burnCooldown = 0
    this.silenceCooldown = 0
    this.poisonCooldown = 0
    this.freezeCooldown = 0
    this.sleepCooldown = 0
    this.confusionCooldown = 0
    this.woundCooldown = 0
    this.smokeCooldown = 0
    this.changeTeamCooldown = 0
  }

  triggerFlameOrb(timer: number) {
    if (!this.flameOrb) {
      this.flameOrb = true
      this.flameOrbCooldown = timer
    }
  }

  updateFlameOrb(dt: number, pkm: PokemonEntity, board: Board) {
    if (this.flameOrbCooldown - dt <= 0) {
      this.flameOrb = false
      const cells = board.getAdjacentCells(pkm.positionX, pkm.positionY)
      let flameCount = 1
      cells.forEach((cell:Cell) => {
        if (cell.value && pkm.team != cell.value.team && flameCount > 0) {
          cell.value.status.triggerBurn(8000, cell.value, pkm)
          flameCount --
        }
      })
      if (pkm.items.has(Item.FLAME_ORB)) {
        pkm.status.triggerFlameOrb(2000)
      }
    } else {
      this.flameOrbCooldown = this.flameOrbCooldown - dt
    }
  }

  triggerArmorReduction(timer: number) {
    if (!this.armorReduction) {
      this.armorReduction = true
      this.armorReductionCooldown = timer
    }
  }

  updateArmorReduction(dt: number) {
    if (this.armorReductionCooldown - dt <= 0) {
      this.armorReduction = false
    } else {
      this.armorReductionCooldown = this.armorReductionCooldown - dt
    }
  }

  triggerSoulDew(timer: number) {
    // console.log('sould dew');
    if (!this.soulDew) {
      this.soulDew = true
      this.soulDewCooldown = timer
    }
  }

  updateSoulDew(dt: number, pkm: PokemonEntity) {
    if (this.soulDewCooldown - dt <= 0) {
      this.soulDew = false
      pkm.addSpellDamage(25)
      if (pkm.items.has(Item.SOUL_DEW)) {
        this.triggerSoulDew(5000)
      }
    } else {
      this.soulDewCooldown = this.soulDewCooldown - dt
    }
  }

  triggerBurn(timer: number, pkm: PokemonEntity, origin: PokemonEntity | undefined) {
    if (!this.burn && !pkm.items.has(Item.WIDE_LENS)) {
      this.burn = true
      this.burnCooldown = timer
      if (origin) {
        this.burnOrigin = origin
      }
    }
  }

  updateBurn(dt: number) {
    if (this.burnCooldown - dt <= 0) {
      this.burn = false
      this.burnOrigin = undefined
    } else {
      this.burnCooldown = this.burnCooldown - dt
    }
  }

  triggerSilence(timer: number) {
    if (!this.silence) {
      this.silence = true
      this.silenceCooldown = timer
    }
  }

  updateSilence(dt: number) {
    if (this.silenceCooldown - dt <= 0) {
      this.silence = false
    } else {
      this.silenceCooldown = this.silenceCooldown - dt
    }
  }

  triggerPoison(timer: number, pkm: PokemonEntity, origin: PokemonEntity | undefined) {
    if (!this.poison && !pkm.items.has(Item.WIDE_LENS)) {
      this.poison = true
      this.poisonCooldown = timer
      if (origin) {
        this.poisonOrigin = origin
      }
    }
  }

  updatePoison(dt: number) {
    if (this.poisonCooldown - dt <= 0) {
      this.poison = false
      this.poisonOrigin = undefined
    } else {
      this.poisonCooldown = this.poisonCooldown - dt
    }
  }

  triggerFreeze(timer: number) {
    if (!this.freeze) {
      this.freeze = true
      this.freezeCooldown = timer
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

  triggerSleep(timer: number) {
    if (!this.sleep) {
      this.sleep = true
      this.sleepCooldown = timer
    }
  }

  updateSleep(dt: number) {
    if (this.sleepCooldown - dt <= 0) {
      this.sleep = false
    } else {
      this.sleepCooldown = this.sleepCooldown - dt
    }
  }

  triggerConfusion(timer: number) {
    if (!this.confusion) {
      this.confusion = true
      this.confusionCooldown = timer
    }
  }

  updateConfusion(dt: number) {
    if (this.confusionCooldown - dt <= 0) {
      this.confusion = false
    } else {
      this.confusionCooldown = this.confusionCooldown - dt
    }
  }

  triggerWound(timer: number) {
    if (!this.wound) {
      this.wound = true
      this.woundCooldown = timer
    }
  }

  updateWound(dt: number) {
    if (this.woundCooldown - dt <= 0) {
      this.wound = false
    } else {
      this.woundCooldown = this.woundCooldown - dt
    }
  }

  triggerShield(timer: number) {
    if (!this.temporaryShield) {
      this.temporaryShield = true
      this.temporaryShieldCooldown = timer
    }
  }

  updateShield(dt: number, pkm: PokemonEntity) {
    if (this.temporaryShieldCooldown - dt <= 0) {
      this.temporaryShield = false
      pkm.shield = 0
    } else {
      this.temporaryShieldCooldown = this.temporaryShieldCooldown - dt
    }
  }

  triggerBrightPowder(timer: number) {
    if (!this.brightPowder) {
      this.brightPowder = true
      this.brightPowderCooldown = timer
    }
  }

  updateBrightPowder(dt: number, pokemon: PokemonEntity, board: Board) {
    if (this.brightPowderCooldown - dt <= 0) {
      this.brightPowder = false
      const cells = board.getAdjacentCells(pokemon.positionX, pokemon.positionY)

      cells.forEach((cell) => {
        if (cell.value && pokemon.team == cell.value.team) {
          cell.value.handleHeal(0.18 * cell.value.hp, pokemon)
          cell.value.count.brightPowderCount ++
        }
      })
      pokemon.handleHeal(0.18 * pokemon.hp, pokemon)

      if (pokemon.items.has(Item.BRIGHT_POWDER)) {
        pokemon.status.triggerBrightPowder(5000)
        pokemon.count.brightPowderCount ++
      }
    } else {
      this.brightPowderCooldown = this.brightPowderCooldown - dt
    }
  }

  triggerSmoke(timer: number, pkm: PokemonEntity) {
    if (!this.smoke) {
      this.smoke = true
      pkm.handleAttackSpeed(-50)
      this.smokeCooldown = timer
    }
  }

  updateSmoke(dt: number, pkm: PokemonEntity) {
    if (this.smokeCooldown - dt <= 0) {
      this.smoke = false
      pkm.handleAttackSpeed(30)
    } else {
      this.smokeCooldown = this.smokeCooldown - dt
    }
  }

  triggerRuneProtect() {
    this.runeProtect = true
  }

  disableRuneProtect() {
    this.runeProtect = false
  }
}