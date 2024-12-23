import { PokemonEntity } from "./pokemon-entity"
import { Effect as EffectEnum } from "../types/enum/Effect"
import { Item } from "../types/enum/Item"

export abstract class Effect {
  apply: (entity: PokemonEntity) => void
  constructor(effect: (entity: PokemonEntity) => void) {
    this.apply = effect
  }
}

// item effect applied on fight start of after stealing/obtaining an item
export class OnItemGainedEffect extends Effect {}

export class OnItemRemovedEffect extends Effect {}

export class PeriodicEffect extends Effect {
  intervalMs: number
  timer: number

  constructor(effect: (entity: PokemonEntity) => void, intervalMs: number) {
    super(effect)
    this.intervalMs = intervalMs
    this.timer = intervalMs
  }

  update(dt: number, entity: PokemonEntity) {
    this.timer -= dt
    if (this.timer <= 0) {
      this.apply(entity)
      this.timer = this.intervalMs
    }
  }
}

class GrowGroundEffect extends PeriodicEffect {
  count: number
  constructor(groundSynergyStep: number) {
    super((pokemon) => {
      this.count++
      pokemon.addDefense(groundSynergyStep, pokemon, 0, false)
      pokemon.addSpecialDefense(groundSynergyStep, pokemon, 0, false)
      pokemon.addAttack(groundSynergyStep, pokemon, 0, false)
      pokemon.transferAbility("GROUND_GROW")
      if (
        pokemon.items.has(Item.BIG_NUGGET) &&
        this.count === 5 &&
        pokemon.player
      ) {
        pokemon.player.addMoney(3, true, pokemon)
        pokemon.count.moneyCount += 3
      }
    }, 3000)
    this.count = 0
  }
}

export const EffectsByName: {
  [key in EffectEnum]?: (Effect | (() => Effect))[]
} = {
  [EffectEnum.TILLER]: [() => new GrowGroundEffect(1)],
  [EffectEnum.DIGGER]: [() => new GrowGroundEffect(2)],
  [EffectEnum.DRILLER]: [() => new GrowGroundEffect(3)],
  [EffectEnum.DEEP_MINER]: [() => new GrowGroundEffect(4)]
}
