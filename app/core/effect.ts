import Board from "./board"
import { PokemonEntity } from "./pokemon-entity"
import { Item } from "../types/enum/Item"
import { Effect as EffectEnum } from "../types/enum/Effect"
import { Synergy, SynergyEffects } from "../types/enum/Synergy"

type EffectOrigin = EffectEnum | Item

export abstract class Effect {
  origin?: EffectOrigin
  apply: (entity: PokemonEntity, ...others: any[]) => void
  constructor(effect: (entity: PokemonEntity, ...others: any[]) => void, origin?: EffectOrigin) {
    this.apply = effect
    this.origin = origin
  }
}

// item effect applied on fight start of after stealing/obtaining an item
export class OnItemGainedEffect extends Effect {}

export class OnItemRemovedEffect extends Effect {}

// applied after knocking out an enemy
export class OnKillEffect extends Effect {
  apply: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void
  constructor(
    effect: (entity: PokemonEntity, target: PokemonEntity, board: Board) => void
  ) {
    super(effect)
    this.apply = effect
  }
}

export abstract class DynamicEffect {
  origin?: EffectOrigin
  apply(pokemon: PokemonEntity) {}
    constructor(origin?: EffectOrigin) {
      this.origin = origin
    }
}

export abstract class PeriodicEffect extends DynamicEffect {
  intervalMs: number
  timer: number
  count: number

  constructor(
    intervalMs: number,
    origin?: EffectOrigin
  ) {
    super(origin)
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
