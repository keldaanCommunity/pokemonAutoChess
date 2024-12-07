import { PokemonEntity } from "./pokemon-entity"

export abstract class Effect {
  apply: (entity: PokemonEntity) => void
  constructor(effect: (entity: PokemonEntity) => void) {
    this.apply = effect
  }
}

// item effect applied on fight start of after stealing/obtaining an item
export class OnItemGainedEffect extends Effect {}
