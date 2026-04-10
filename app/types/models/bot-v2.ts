import { Emotion, PkmWithCustom } from ".."
import { Item } from "../enum/Item"
import { Pkm } from "../enum/Pokemon"

export interface IDetailledPokemon extends PkmWithCustom {
  name: Pkm
  x: number
  y: number
  items: Item[]
  emotion?: Emotion
  shiny?: boolean
}

export interface IStep {
  board: IDetailledPokemon[]
  roundsRequired: number
}

export interface IBot {
  avatar: string
  author: string
  elo: number
  steps: IStep[]
  name: string
  id: string
  approved: boolean
}

export type IBotLight = Omit<IBot, "steps"> & { valid: boolean }
