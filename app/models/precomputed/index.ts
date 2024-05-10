import JSON_PRECOMPUTED_POKEMONS_DATA from "./pokemons-data.json"
import JSON_PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX from "./emotions-per-pokemon-index.json"

import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import { Rarity } from "../../types/enum/Game"
import { Ability } from "../../types/enum/Ability"
import { IPokemonData } from "../../types/interfaces/PokemonData"
import { Passive } from "../../types/enum/Passive"

export const PRECOMPUTED_POKEMONS_DATA = JSON_PRECOMPUTED_POKEMONS_DATA as {
  [pkm in Pkm]?: Omit<IPokemonData, "name" | "index">
}

export const PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX =
  JSON_PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX as {
    [pkm: (typeof PkmIndex)[Pkm]]: number[]
  }

export const PRECOMPUTED_REGIONAL_MONS: Pkm[] = Object.values(Pkm).filter(
  (p) => {
    const { regional, skill, passive } = getPokemonData(p)
    return regional && (skill !== Ability.DEFAULT || passive !== Passive.NONE)
  }
)

export function getPokemonData(name: Pkm): IPokemonData {
  if (name in PRECOMPUTED_POKEMONS_DATA)
    return { name, index: PkmIndex[name], ...PRECOMPUTED_POKEMONS_DATA[name]! }
  //console.error(`Precomputed data not found for ${name}`)
  return {
    name: Pkm.DEFAULT,
    index: PkmIndex[Pkm.DEFAULT],
    additional: false,
    regional: false,
    hp: 10,
    range: 1,
    rarity: Rarity.SPECIAL,
    stars: 1,
    stages: 1,
    skill: Ability.DEFAULT,
    passive: Passive.NONE,
    types: [],
    evolution: null
  }
}
