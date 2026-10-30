import type { Board } from "../board"
import type { PokemonEntity } from "../pokemon-entity"
import { AbilityStrategy } from "./ability-strategy"

export class MudBubbleStrategy extends AbilityStrategy {
  requiresTarget = false
  process(pokemon: PokemonEntity, board: Board, target: null, crit: boolean) {
    super.process(pokemon, board, target, crit)
    const heal = [10, 20, 40, 80][pokemon.stars - 1] ?? 80
    pokemon.handleHeal(heal, pokemon, 1, crit)
    pokemon.resetCooldown(250, pokemon.speed)
  }
}
