import { model, Schema } from "mongoose"
import { Pkm } from "../../types/enum/Pokemon"
import { Synergy } from "../../types/enum/Synergy"

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

const meanTeamSchema = new Schema({
  cluster_id: {
    type: String
  },
  rank: {
    type: Number
  },
  pokemons: {
    type: Map,
    of: new Schema({
      frequency: Number,
      mean_items: Number,
      items: [String]
    })
  },
  synergies: Object
})

const metaV2Schema = new Schema({
  cluster_id: {
    type: String
  },
  count: {
    type: Number
  },
  ratio: {
    type: Number
  },
  winrate: {
    type: Number
  },
  mean_rank: {
    type: Number
  },
  synergies: Object,
  mean_team: meanTeamSchema,
  mean_items: [
    new Schema({
      item: String,
      frequency: Number
    })
  ],
  top_teams: [
    new Schema({
      rank: Number,
      elo: Number,
      pokemons: [
        new Schema({
          name: String,
          items: [String]
        })
      ]
    })
  ],
  hull: [[Number]],
  x: {
    type: Number
  },
  y: {
    type: Number
  },
  generated_at: {
    type: String
  }
})

export default model<IMetaV2>("MetaV2", metaV2Schema, "meta-report-v2")

export async function fetchMetaV2(): Promise<IMetaV2[]> {
  return fetch("/meta-v2").then((res) => res.json())
}
