import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class RoostStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const shield = [20, 40, 80, 160][pokemon.stars - 1] ?? 160
    pokemon.flyAway(board, false)
    pokemon.status.triggerSleep(1000, pokemon)
    pokemon.addShield(shield, pokemon, 1, crit)
  }
}
