import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

class MeditateStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const buff = 1
    pokemon.addAttack(buff * pokemon.baseAtk, pokemon, 1, crit)
  }
}

export const meditateStrategy = new MeditateStrategy()
