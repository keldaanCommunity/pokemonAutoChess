import { RarityCost } from "../app/config"
import PokemonFactory, { PkmColorVariants } from "../app/models/pokemon-factory"
import { Ability } from "../app/types/enum/Ability"
import { Passive } from "../app/types/enum/Passive"
import { Pkm } from "../app/types/enum/Pokemon"

const sortByRarityAndTier = (a, b) =>
  RarityCost[a.rarity] === RarityCost[b.rarity]
    ? a.stars - b.stars
    : RarityCost[a.rarity] - RarityCost[b.rarity]

export const precomputedPokemons = Object.values(Pkm)
  .filter((p) => p !== Pkm.DEFAULT)
  .map((pkm) => PokemonFactory.createPokemonFromName(pkm))
  .sort(sortByRarityAndTier)

// filter out color variants and unimplemented pokemons
export const precomputedPokemonsImplemented = precomputedPokemons.filter(
  (pokemon) =>
    (pokemon.skill !== Ability.DEFAULT || pokemon.passive !== Passive.NONE) &&
    PkmColorVariants.includes(pokemon.name as Pkm) === false
)
