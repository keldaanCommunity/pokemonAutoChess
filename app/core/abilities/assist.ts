import { pickRandomIn } from "../../utils/random"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategies } from "./abilities"
import { AbilityStrategy } from "./ability-strategy"

export class AssistStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    const skill = pickRandomIn(
      board.cells
        .filter(
          (v) =>
            v &&
            v.team === pokemon.team &&
            v.skill &&
            AbilityStrategies[v.skill].copyable
        )
        .map((v) => v?.skill)
    )
    if (skill) {
      pokemon.broadcastAbility({ skill })
      AbilityStrategies[skill].process(pokemon, board, target, crit)
    } else super.process(pokemon, board, target, crit)
  }
}
