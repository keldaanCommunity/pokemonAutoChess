import { PokemonEntity } from "./pokemon-entity"
import { Item } from "../types/enum/Item"
import { Effect as EffectEnum } from "../types/enum/Effect"

type EffectOrigin = EffectEnum | Item

export abstract class Effect {
  origin?: EffectOrigin
  apply: (entity: PokemonEntity) => void
  constructor(effect: (entity: PokemonEntity) => void, origin?: EffectOrigin) {
    this.apply = effect
    this.origin = origin
  }
}

// item effect applied on fight start of after stealing/obtaining an item
export class OnItemGainedEffect extends Effect {}

export class OnItemRemovedEffect extends Effect {}

export class PeriodicEffect extends Effect {
  intervalMs: number
  timer: number
  count: number

  constructor(
    effect: (entity: PokemonEntity) => void,
    intervalMs: number,
    origin?: EffectOrigin
  ) {
    super(effect, origin)
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
  constructor(groundSynergyStep: number, origin: EffectOrigin) {
    super(
      (pokemon) => {
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
      },
      3000,
      origin
    )
  }
}
