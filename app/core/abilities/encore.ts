import { Ability } from "../../types/enum/Ability"
import { Team } from "../../types/enum/Game"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategies } from "./abilities"
import { AbilityStrategy } from "./ability-strategy"

export class EncoreStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    const abilitiesCast =
      pokemon.team === Team.BLUE_TEAM
        ? pokemon.simulation.blueAbilitiesCast
        : pokemon.simulation.redAbilitiesCast
    const lastAbilityUsed = abilitiesCast?.findLast(
      (ability) =>
        ability !== Ability.ENCORE && AbilityStrategies[ability]?.copyable
    )
    if (lastAbilityUsed) {
      AbilityStrategies[lastAbilityUsed].process(pokemon, board, target, crit)
    }
  }
}
