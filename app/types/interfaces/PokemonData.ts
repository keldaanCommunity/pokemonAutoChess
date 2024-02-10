import { Ability } from "../enum/Ability"
import { Rarity } from "../enum/Game"
import { Synergy } from "../enum/Synergy"

export interface IPokemonData {
  skill: Ability
  stars: number
  rarity: Rarity
  additional: boolean
  range: number
  types: Synergy[]
}
