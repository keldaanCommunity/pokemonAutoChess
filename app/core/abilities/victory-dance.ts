import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class VictoryDanceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, true)
    // gain 3 Attack, 3 Defense and 10 Speed.
    pokemon.addAttack(3, pokemon, 1, crit)
    pokemon.addDefense(3, pokemon, 1, crit)
    pokemon.addSpeed(10, pokemon, 1, crit)
  }
}
