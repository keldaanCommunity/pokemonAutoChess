import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { Item } from "../../types/enum/Item"
import { EvolutionHandler } from "./evolution-handler"

export class StackEvolutionHandler extends EvolutionHandler<[number]> {
  canEvolve(pokemon: Pokemon, player: Player, stacks: number): boolean {
    if (pokemon.items.has(Item.EVIOLITE)) return false
    if (player.board.has(pokemon.id) === false) return false
    return stacks >= pokemon.stacksRequired
  }

  evolve(pokemon: Pokemon, player: Player, stacks: number): Pokemon {
    const pokemonEvolutionName = this.getEvolution(pokemon, player, stacks)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )
    return pokemonEvolved
  }
}
