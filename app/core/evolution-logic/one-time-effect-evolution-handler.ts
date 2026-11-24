import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type {
  EvolutionType,
  OneTimeEffectEvolutionContext
} from "../../types/EvolutionRules"
import { EvolutionHandler } from "./evolution-handler"

export class OneTimeEffectEvolutionHandler extends EvolutionHandler<EvolutionType.ONE_TIME_EFFECT> {
  canEvolve(
    pokemon: Pokemon,
    player: Player,
    context: OneTimeEffectEvolutionContext
  ): boolean {
    return player.board.has(pokemon.id) && !context.afterEvolveCheck
  }

  evolve(
    pokemon: Pokemon,
    player: Player,
    context: OneTimeEffectEvolutionContext
  ): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, context)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
