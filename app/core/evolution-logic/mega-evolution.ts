import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import type {
  EvolutionType,
  MegaEvolutionContext
} from "../../types/EvolutionRules"
import { MegaPkm, type Pkm } from "../../types/enum/Pokemon"
import type { IPokemonData } from "../../types/interfaces/PokemonData"
import { isIn } from "../../utils/array"
import { EvolutionHandler } from "./evolution-handler"

export const isMegaPokemon = (pkm: Pkm): boolean => isIn(MegaPkm, pkm)

export const hasMegaEvolution = (pkm: Pkm) => {
  const pokemonData = getPokemonData(pkm)
  return (
    ("evolutions" in pokemonData &&
      pokemonData.evolutions.some(
        (e) => isIn(MegaPkm, e) || hasMegaEvolution(e)
      )) ||
    (pokemonData.evolution != null &&
      (isIn(MegaPkm, pokemonData.evolution) ||
        hasMegaEvolution(pokemonData.evolution)))
  )
}

export const canMegaEvolve = (pokemon: Pokemon | IPokemonData) => {
  return (
    (pokemon.evolution && isMegaPokemon(pokemon.evolution)) ||
    pokemon.evolutions?.some((e) => isMegaPokemon(e))
  )
}

export class MegaEvolutionHandler extends EvolutionHandler<EvolutionType.MEGA> {
  canEvolve(
    pokemon: Pokemon,
    player: Player,
    context: MegaEvolutionContext
  ): boolean {
    if (player.board.has(pokemon.id) === false) return false
    return canMegaEvolve(pokemon) && context.megaStoneUsed === true
  }

  evolve(
    pokemon: Pokemon,
    player: Player,
    context: MegaEvolutionContext
  ): Pokemon {
    const megaEvolution = this.getEvolution(pokemon, player, context)
    const pokemonEvolved = player.transformPokemon(pokemon, megaEvolution)
    return pokemonEvolved
  }
}
