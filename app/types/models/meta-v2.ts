import { Pkm } from "../enum/Pokemon"
import { Synergy } from "../enum/Synergy"

export interface IMeanTeam {
  cluster_id: string
  rank: number
  pokemons: {
    [key in Pkm]?: {
      frequency: number
      mean_items: number
      items: string[]
    }
  }
  synergies: { [key in Synergy]?: number }
}

export interface ITopTeam {
  rank: number
  elo: number
  pokemons: Array<{
    name: Pkm
    items: string[]
  }>
}

export interface IMetaV2 {
  cluster_id: string
  count: number
  ratio: number
  winrate: number
  mean_rank: number
  synergies: { [key in Synergy]?: number }
  mean_team: IMeanTeam
  mean_items?: Array<{
    item: string
    frequency: number
  }>
  top_teams?: ITopTeam[]
  hull?: [number, number][]
  x: number
  y: number
  generated_at?: string
}
