import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import type {
  EvolutionContextMap,
  EvolutionType
} from "../../types/EvolutionRules"
import { Pkm } from "../../types/enum/Pokemon"
import { EvolutionHandler } from "./evolution-handler"
import { getHatchTime } from "./hatch-time"

export class HatchEvolutionHandler extends EvolutionHandler<EvolutionType.HATCH> {
  canEvolve(
    pokemon: Pokemon,
    player: Player,
    context: EvolutionContextMap[EvolutionType.HATCH]
  ): boolean {
    if (!player.board.has(pokemon.id)) return false // egg has been sold in the meantime
    pokemon.stacksRequired = getHatchTime(pokemon, player)
    return pokemon.stacks >= pokemon.stacksRequired
  }

  evolve(
    pokemon: Pokemon,
    player: Player,
    context: EvolutionContextMap[EvolutionType.HATCH]
  ): Pokemon {
    pokemon.stacks = 0 // prevent trying to evolve twice in a row
    const pokemonEvolutionName = this.getEvolution(pokemon, player, context)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )

    if (pokemonEvolved != null && pokemon.name === Pkm.EGG && pokemon.shiny) {
      player.atlasManager.emera += 1
    }

    return pokemonEvolved
  }
}
