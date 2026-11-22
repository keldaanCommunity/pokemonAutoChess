import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { EvolutionHandler } from "./evolution-handler"

export class StackEvolutionHandler extends EvolutionHandler {
  canEvolve(pokemon: Pokemon, player: Player): boolean {
    if (player.board.has(pokemon.id) === false) return false
    return pokemon.stacks >= pokemon.stacksRequired
  }

  evolve(pokemon: Pokemon, player: Player): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
