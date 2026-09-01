import type { Pkm } from "../enum/Pokemon"
import type { IDetailledPokemon } from "../interfaces/IDetailledPokemon"

export interface IStep {
  board: IDetailledPokemon[]
  roundsRequired: number
}

export interface IBot {
  avatar: string
  author: string
  elo: number
  steps: IStep[]
  name: Pkm
  id: string
  approved: boolean
}

export type IBotLight = Omit<IBot, "steps"> & { valid: boolean }
