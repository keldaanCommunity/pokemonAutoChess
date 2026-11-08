import type Player from "../../models/colyseus-models/player"
import type { Pokemon } from "../../models/colyseus-models/pokemon"
import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
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
    (pokemon.evolutions && pokemon.evolutions.some((e) => isMegaPokemon(e)))
  )
}

export class MegaEvolutionHandler extends EvolutionHandler {
  canEvolve(pokemon: Pokemon, player: Player): boolean {
    if (player.board.has(pokemon.id) === false) return false
    return canMegaEvolve(pokemon)
  }

  evolve(pokemon: Pokemon, player: Player): Pokemon {
    const megaEvolution =
      pokemon.evolutions.length > 1
        ? (pokemon.evolutions.find((evo) => isMegaPokemon(evo)) ??
          pokemon.evolution)
        : pokemon.evolution
    const pokemonEvolved = player.transformPokemon(pokemon, megaEvolution)
    return pokemonEvolved
  }
}
