import { getPokemonData } from "../../models/precomputed/precomputed-pokemon-data"
import { MegaPkm, type Pkm } from "../../types/enum/Pokemon"
import { isIn } from "../../utils/array"

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
