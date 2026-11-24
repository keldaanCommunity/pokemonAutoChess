import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type {
  EvolutionType,
  StackEvolutionContext
} from "../../types/EvolutionRules"
import { EvolutionHandler } from "./evolution-handler"

export class StackEvolutionHandler extends EvolutionHandler<EvolutionType.STACK> {
  canEvolve(
    pokemon: Pokemon,
    player: Player,
    context: StackEvolutionContext
  ): boolean {
    if (player.board.has(pokemon.id) === false) return false
    return pokemon.stacks >= pokemon.stacksRequired
  }

  evolve(
    pokemon: Pokemon,
    player: Player,
    context: StackEvolutionContext
  ): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, context)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
