import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import JSON_PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX from "./emotions-per-pokemon-index.json"

export const PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX =
  JSON_PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX as {
    [pkm: (typeof PkmIndex)[Pkm]]: number[]
  }
