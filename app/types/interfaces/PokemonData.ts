import { Ability } from "../enum/Ability"
import { Rarity } from "../enum/Game"
import { Passive } from "../enum/Passive"
import { Pkm } from "../enum/Pokemon"
import { Synergy } from "../enum/Synergy"

export interface IPokemonData {
  name: Pkm
  index: string
  skill: Ability
  passive: Passive
  stars: number
  rarity: Rarity
  additional: boolean
  regional: boolean
  hp: number
  range: number
  types: Synergy[]
  evolution: Pkm | null
  evolutions: Pkm[]
  stages: number
}
