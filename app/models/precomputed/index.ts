import JSON_PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY from "./pokemons-per-type-and-category.json"
import JSON_PRECOMPUTED_POKEMONS_PER_TYPE from "./pokemons-per-type.json"
import JSON_PRECOMPUTED_POKEMONS_PER_RARITY from "./pokemons-per-rarity.json"
import JSON_PRECOMPUTED_POKEMONS_PER_ABILITY from "./pokemons-per-ability.json"
import JSON_PRECOMPUTED_POKEMONS_STARS from "./pokemons-stars.json"
import JSON_PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX from "./emotions-per-pokemon-index.json"

import { Synergy } from "../../types/enum/Synergy"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { Rarity } from "../../types/enum/Game"
import { Ability } from "../../types/enum/Ability"

export const PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY =
  JSON_PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY as {
    [key in Synergy]: {
      pokemons: Pkm[]
      uniquePokemons: Pkm[]
      legendaryPokemons: Pkm[]
      mythicalPokemons: Pkm[]
      additionalPokemons: Pkm[]
    }
  }

export const PRECOMPUTED_POKEMONS_PER_TYPE =
  JSON_PRECOMPUTED_POKEMONS_PER_TYPE as {
    [key in Synergy]: Pkm[]
  }

export const PRECOMPUTED_POKEMONS_PER_RARITY =
  JSON_PRECOMPUTED_POKEMONS_PER_RARITY as {
    [key in Rarity]: Pkm[]
  }

export const PRECOMPUTED_POKEMONS_PER_ABILITY =
  JSON_PRECOMPUTED_POKEMONS_PER_ABILITY as {
    [key in Ability]: Pkm[]
  }

  export const PRECOMPUTED_POKEMONS_STARS = JSON_PRECOMPUTED_POKEMONS_STARS as {
    [pkm in Pkm]: number
  }

  export const PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX = JSON_PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX as {
    [pkm: typeof PkmIndex[Pkm]]: number[]
  }