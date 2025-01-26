import Board from "./board"
import { PokemonEntity } from "./pokemon-entity"
import { Item } from "../types/enum/Item"
import { Effect as EffectEnum } from "../types/enum/Effect"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"
import { chance } from "../utils/random"
import PokemonState from "./pokemon-state"
import { Passive } from "../types/enum/Passive"
import { Ability } from "../types/enum/Ability"

type EffectOrigin = EffectEnum | Item

export abstract class Effect {
  origin?: EffectOrigin
  apply(entity: PokemonEntity, ...others: any[]) {}
  constructor(effect?: (entity: PokemonEntity, ...others: any[]) => void, origin?: EffectOrigin) {
    if (effect) {
      this.apply = effect
    }
    this.origin = origin
  }
}

// item effect applied on fight start of after stealing/obtaining an item
export class OnItemGainedEffect extends Effect {}

export class OnItemRemovedEffect extends Effect {}

// applied after knocking out an enemy
export class OnKillEffect extends Effect {
  apply(entity: PokemonEntity, target: PokemonEntity, board: Board) {}
  constructor(
    effect?: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

export class MonsterKillEffect extends OnKillEffect {
  hpBoosted: number = 0
  count: number = 0
  synergyLevel: number
  constructor(effect: EffectEnum) {
    super(undefined, effect)
    this.synergyLevel = SynergyEffects[Synergy.MONSTER].indexOf(effect)
  }

  apply(pokemon, target, board) {
    const attackBoost = [3, 6, 10, 10][this.synergyLevel] ?? 10
    const apBoost = [10, 20, 30, 30][this.synergyLevel] ?? 30
    const hpGain = [0.2, 0.4, 0.6, 0.6][this.synergyLevel] ?? 0.6
    const lifeBoost = hpGain * target.hp
    pokemon.addAttack(attackBoost, pokemon, 0, false)
    pokemon.addAbilityPower(apBoost, pokemon, 0, false)
    pokemon.addMaxHP(lifeBoost, pokemon, 0, false)
    this.hpBoosted += lifeBoost
    this.count += 1
  }

}

export abstract class PeriodicEffect extends Effect {
  intervalMs: number
  timer: number
  count: number

  constructor(
    intervalMs: number,
    origin?: EffectOrigin
  ) {
    super(undefined, origin)
    this.intervalMs = intervalMs
    this.timer = intervalMs
    this.count = 0
  }

  update(dt: number, entity: PokemonEntity) {
    this.timer -= dt
    if (this.timer <= 0) {
      this.count++
      this.apply(entity)
      this.timer = this.intervalMs
    }
  }
}

export class GrowGroundEffect extends PeriodicEffect {
  synergyLevel: number
  constructor(effect: EffectEnum) {
    super(3000, effect)
    this.synergyLevel = SynergyEffects[Synergy.GROUND].indexOf(effect) + 1
  }

  apply(pokemon) {
    if (this.count > 5) {
      return
    }
    pokemon.addDefense(this.synergyLevel, pokemon, 0, false)
    pokemon.addSpecialDefense(this.synergyLevel, pokemon, 0, false)
    pokemon.addAttack(this.synergyLevel, pokemon, 0, false)
    pokemon.transferAbility("GROUND_GROW")
    if (
      pokemon.items.has(Item.BIG_NUGGET) &&
      this.count === 5 &&
      pokemon.player
    ) {
      pokemon.player.addMoney(3, true, pokemon)
      pokemon.count.moneyCount += 3
    }
  }
}

export class OnHitEffect extends Effect {
  apply(entity: PokemonEntity, target: PokemonEntity, board: Board) {}
  constructor(
    effect?: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

export class FireHitEffect extends OnHitEffect {
  count: number = 0
  synergyLevel: number
  constructor(
    effect: EffectEnum
  ) {
    super(undefined, effect)
    this.synergyLevel = SynergyEffects[Synergy.FIRE].indexOf(effect)
  }

  apply(pokemon, target, board) {
    const burnChance = 0.3
    pokemon.addAttack(this.synergyLevel, pokemon, 0, false)
    if (chance(burnChance, pokemon)) {
      target.status.triggerBurn(2000, target, pokemon)
    }
    this.count += 1
  }

}

export class OnAbilityCastEffect extends Effect {
  apply(
    pokemon: PokemonEntity,
    state: PokemonState,
    board: Board,
    target: PokemonEntity,
    crit: boolean
    ) {}
  constructor(
    effect?: (
      pokemon: PokemonEntity,
      state: PokemonState,
      board: Board,
      target: PokemonEntity,
      crit: boolean
    ) => void,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
  }
}

export class SoundCryEffect extends OnAbilityCastEffect {
  count: number = 0
  synergyLevel: number = -1
  constructor(effect?: EffectEnum) {
    super(undefined, effect)
    if (effect) {
      this.synergyLevel = SynergyEffects[Synergy.SOUND].indexOf(effect)
    }
  }

  apply(pokemon, state, board, target, crit) {
    pokemon.transferAbility(Ability.ECHO)
    const attackBoost = [2, 1, 1][this.synergyLevel] ?? 0
    const attackSpeedBoost = [0, 5, 5][this.synergyLevel] ?? 0
    const manaBoost = [0, 0, 3][this.synergyLevel] ?? 0

    const chimecho =
      board.getAdjacentCells(pokemon.positionX, pokemon.positionY)
        .some((cell) => cell.value?.passive === Passive.CHIMECHO)
    
    const scale =
      (chimecho ? 2 : 1) * 
      (pokemon.passive === Passive.MEGA_LAUNCHER ? 3 : 1)
    
    board.cells.forEach((ally) => {
      if (ally?.team === pokemon.team) {
        ally.status.sleep = false
        ally.addAttack(attackBoost * scale, pokemon, 0, false)
        ally.addAttackSpeed(attackSpeedBoost * scale, pokemon, 0, false)
        ally.addPP(manaBoost * scale, pokemon, 0, false)
        ally.count.soundCryCount += scale
      }
    })
  }
}
