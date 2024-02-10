import JSON_PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY from "./pokemons-per-type-and-category.json"
import JSON_PRECOMPUTED_POKEMONS_PER_TYPE from "./pokemons-per-type.json"
import JSON_PRECOMPUTED_POKEMONS_PER_RARITY from "./pokemons-per-rarity.json"
import JSON_PRECOMPUTED_POKEMONS_PER_ABILITY from "./pokemons-per-ability.json"
import JSON_PRECOMPUTED_POKEMONS_DATA from "./pokemons-data.json"
import JSON_PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX from "./emotions-per-pokemon-index.json"

import { Synergy } from "../../types/enum/Synergy"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { Rarity } from "../../types/enum/Game"
import { Ability } from "../../types/enum/Ability"
import { IPokemonData } from "../../types/interfaces/PokemonData"
import { Passive } from "../../types/enum/Passive"

export const PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY =
  JSON_PRECOMPUTED_POKEMONS_PER_TYPE_AND_CATEGORY as {
    [key in Synergy]: {
      pokemons: Pkm[]
      uniquePokemons: Pkm[]
      legendaryPokemons: Pkm[]
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
  JSON_PRECOMPUTED_POKEMONS_PER_ABILITY as unknown as {
    [key in Ability]: Pkm[]
  }

export const PRECOMPUTED_POKEMONS_DATA = JSON_PRECOMPUTED_POKEMONS_DATA as {
  [pkm in Pkm]?: Omit<IPokemonData, "name" | "index">
}

export const PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX =
  JSON_PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX as {
    [pkm: (typeof PkmIndex)[Pkm]]: number[]
  }

export function getPokemonData(name: Pkm): IPokemonData {
  if (name in PRECOMPUTED_POKEMONS_DATA)
    return { name, index: PkmIndex[name], ...PRECOMPUTED_POKEMONS_DATA[name]! }
  console.error(`Precomputed data not found for ${name}`)
  return {
    name: Pkm.DEFAULT,
    index: PkmIndex[Pkm.DEFAULT],
    additional: false,
    range: 1,
    rarity: Rarity.SPECIAL,
    stars: 1,
    skill: Ability.DEFAULT,
    passive: Passive.NONE,
    types: [],
    evolution: null
  }
}
