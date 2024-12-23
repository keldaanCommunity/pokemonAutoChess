import Board from "./board"
import { PokemonEntity } from "./pokemon-entity"

export abstract class Effect {
  apply: (entity: PokemonEntity, ...others: any[]) => void
  constructor(effect: (entity: PokemonEntity, ...others: any[]) => void) {
    this.apply = effect
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
