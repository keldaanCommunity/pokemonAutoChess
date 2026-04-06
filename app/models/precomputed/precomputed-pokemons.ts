import { RarityCost } from "../../config"
import { Ability } from "../../types/enum/Ability"
import { Passive } from "../../types/enum/Passive"
import { Pkm } from "../../types/enum/Pokemon"
import PokemonFactory from "../pokemon-factory"

const sortByRarityAndTier = (a, b) =>
  RarityCost[a.rarity] === RarityCost[b.rarity]
    ? a.stars - b.stars
    : RarityCost[a.rarity] - RarityCost[b.rarity]

export const precomputedPokemons = Object.values(Pkm)
  .filter((p) => p !== Pkm.DEFAULT)
  .map((pkm) => PokemonFactory.createPokemonFromName(pkm))
  .sort(sortByRarityAndTier)

// filter out unimplemented pokemons
export const precomputedPokemonsImplemented = precomputedPokemons.filter(
  (pokemon) =>
    pokemon.skill !== Ability.DEFAULT || pokemon.passive !== Passive.NONE
)
