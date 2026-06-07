import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategies } from "./abilities"
import { AbilityStrategy } from "./ability-strategy"

export class MimicStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    if (AbilityStrategies[target.skill].copyable) {
      AbilityStrategies[target.skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
  }
}
