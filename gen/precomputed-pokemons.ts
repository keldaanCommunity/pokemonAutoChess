import PokemonFactory from "../app/models/pokemon-factory"
import { Pkm } from "../app/types/enum/Pokemon"

export const precomputedPokemons = Object.values(Pkm)
  .filter((p) => p !== Pkm.DEFAULT)
  .map((pkm) => PokemonFactory.createPokemonFromName(pkm))
