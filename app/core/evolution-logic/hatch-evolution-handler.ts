import { GoldenEggItems } from "../../config"
import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { Item } from "../../types"
import { Pkm } from "../../types/enum/Pokemon"
import { pickRandomIn } from "../../utils/random"
import { EvolutionHandler } from "./evolution-handler"
import { getHatchTime } from "./hatch-time"

export class HatchEvolutionHandler extends EvolutionHandler {
  canEvolve(pokemon: Pokemon, player: Player, stageLevel: number): boolean {
    if (pokemon.items.has(Item.EVIOLITE)) return false
    if (!player.board.has(pokemon.id)) return false // egg has been sold in the meantime
    pokemon.stacksRequired = getHatchTime(pokemon, player)
    return pokemon.stacks >= pokemon.stacksRequired
  }

  evolve(pokemon: Pokemon, player: Player, stageLevel: number): Pokemon {
    pokemon.stacks = 0 // prevent trying to evolve twice in a row
    const pokemonEvolutionName = this.getEvolution(pokemon, player, stageLevel)
    const pokemonEvolved = player.transformPokemon(
      pokemon,
      pokemonEvolutionName
    )

    if (pokemonEvolved != null && pokemon.name === Pkm.EGG && pokemon.shiny) {
      player.items.push(pickRandomIn(GoldenEggItems))
    }

    return pokemonEvolved
  }
}
