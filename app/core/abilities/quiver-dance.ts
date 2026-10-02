import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class QuiverDanceStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    pokemon.addAttack([3, 4, 5, 10][pokemon.stars - 1] ?? 10, pokemon, 1, crit)
    pokemon.addSpecialDefense([3, 4, 5, 10][pokemon.stars - 1] ?? 10, pokemon, 1, crit)
    pokemon.addSpeed([10, 10, 10, 15][pokemon.stars - 1] ?? 15, pokemon, 1, crit)
    pokemon.addAbilityPower(20, pokemon, 0, false)
  }
}
