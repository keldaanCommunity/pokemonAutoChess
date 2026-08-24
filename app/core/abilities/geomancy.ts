import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class GeomancyStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.addAttack([15, 15, 15, 30][pokemon.stars - 1] ?? 30, pokemon, 1, crit)
    pokemon.addSpecialDefense([10, 10, 10, 20][pokemon.stars - 1] ?? 20, pokemon, 1, crit)
    pokemon.addSpeed(15, pokemon, 0, false)
  }
}
