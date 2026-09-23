import type { PkmWithCustom } from ".."
import type { Emotion } from "../enum/Emotion"
import type { Item } from "../enum/Item"
import type { Pkm } from "../enum/Pokemon"

export interface IDetailledPokemon extends PkmWithCustom {
  name: Pkm
  x: number
  y: number
  items: Item[]
  emotion?: Emotion
  shiny?: boolean
}
