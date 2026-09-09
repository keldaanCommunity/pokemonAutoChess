import { Berries, NonSpecialBerries } from "../../types/enum/Item"
import { isIn } from "../../utils/array"
import { pickRandomIn } from "../../utils/random"
import { schemaValues } from "../../utils/schemas"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class StuffCheeksStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    //If the user is holding any berries, eat one of them immediately and gain [100,SP]% of the HP healed by it as SHIELD instead. Otherwise, forage and equip a random berry.
    const heldBerry = pickRandomIn(
      schemaValues(pokemon.items).filter((item) => isIn(Berries, item))
    )
    if (heldBerry) {
      pokemon.eatBerry(heldBerry, undefined, true, pokemon.ap, crit)
    } else {
      const berry = pickRandomIn(NonSpecialBerries)
      pokemon.addItem(berry, true)
    }
  }
}
