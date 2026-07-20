import { Berries } from "../../types"
import { AttackType } from "../../types/enum/Game"
import { isIn } from "../../utils/array"
import { schemaValues } from "../../utils/schemas"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class BugBiteStrategy extends AbilityStrategy {
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    // Deal [20,40,80,160] special damage to the target and steal and eat its berry if it helds one.
    const damage = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    target.handleSpecialDamage(damage, board, AttackType.SPECIAL, pokemon, crit)
    const berryStolen = schemaValues(target.items).find((item) =>
      isIn(Berries, item)
    )
    if (berryStolen) {
      pokemon.eatBerry(berryStolen, target)
    }
  }
}
