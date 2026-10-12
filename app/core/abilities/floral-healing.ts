import { Item } from "../../types/enum/Item"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class FloralHealingStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    if (pokemon.items.has(Item.COMFEY) === false) {
      // if comfey is hold item, we explicitely not trigger super.process() so that the pokemon doesn't get call the oncast effects in an infinite loop
      super.process(pokemon, board, target, crit)
    }
    pokemon.handleHeal(pokemon.maxPP, pokemon, 0, false)
  }
}
