import PokemonFactory from "../app/models/pokemon-factory"
import { Ability } from "../app/types/enum/Ability"
import { Passive } from "../app/types/enum/Passive"
import { Pkm } from "../app/types/enum/Pokemon"

export const precomputedPokemons = Object.values(Pkm)
  .filter((p) => p !== Pkm.DEFAULT)
  .map((pkm) => PokemonFactory.createPokemonFromName(pkm))
  .filter(
    (pokemon) =>
      pokemon.skill != Ability.DEFAULT || pokemon.passive !== Passive.NONE
  )
