import { Emotion } from "../../types"
import { Pkm, PkmIndex } from "../../types/enum/Pokemon"
import JSON_PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX from "./emotions-per-pokemon-index.json"

export const PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX =
  JSON_PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX as {
    [pkm: (typeof PkmIndex)[Pkm]]: number[]
  }

export function getAvailableEmotions(index: string, shiny: boolean): Emotion[] {
  if (shiny) {
    const shinyPad = index.length === 4 ? "-0000-0001" : "-0001"
    index += shinyPad
  }
  return Object.values(Emotion).filter(
    (e, i) => PRECOMPUTED_EMOTIONS_PER_POKEMON_INDEX[index]?.[i] === 1
  )
}
