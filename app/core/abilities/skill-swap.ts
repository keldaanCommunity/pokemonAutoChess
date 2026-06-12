import { Ability } from "../../types/enum/Ability"
import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategies } from "./abilities"
import { AbilityStrategy } from "./ability-strategy"

export class SkillSwapStrategy extends AbilityStrategy {
  copyable = false
  process(
    pokemon: PokemonEntity,
    board: Board,
    target: PokemonEntity,
    crit: boolean
  ) {
    super.process(pokemon, board, target, crit)
    if (AbilityStrategies[target.skill].copyable) {
      pokemon.skill = target.skill
      pokemon.maxPP = target.refToBoardPokemon
        ? target.refToBoardPokemon.maxPP
        : target.maxPP
      if (
        pokemon.refToBoardPokemon &&
        !(
          pokemon.refToBoardPokemon.skill === Ability.SKETCH &&
          pokemon.refToBoardPokemon.tm === Ability.DEFAULT
        )
      ) {
        pokemon.refToBoardPokemon.skill = target.skill
      }
      AbilityStrategies[target.skill].process(pokemon, board, target, crit)
    }
  }
}
