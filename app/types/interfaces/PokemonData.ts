import type { Ability } from "../enum/Ability"
import type { Rarity } from "../enum/Game"
import type { Passive } from "../enum/Passive"
import type { Pkm } from "../enum/Pokemon"
import type { Synergy } from "../enum/Synergy"

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
  pp: number
  range: number
  types: Synergy[]
  evolution: Pkm | null
  evolutions: Pkm[]
  stages: number
}
