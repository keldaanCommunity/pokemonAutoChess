import PokemonFactory from "../app/models/pokemon-factory"
import { RarityCost } from "../app/types/Config"
import { Pkm } from "../app/types/enum/Pokemon"

const sortByRarityAndTier = (a, b) =>
  RarityCost[a.rarity] === RarityCost[b.rarity]
    ? a.stars - b.stars
    : RarityCost[a.rarity] - RarityCost[b.rarity]

export const precomputedPokemons = Object.values(Pkm)
  .filter((p) => p !== Pkm.DEFAULT)
  .map((pkm) => PokemonFactory.createPokemonFromName(pkm))
  .sort(sortByRarityAndTier)
