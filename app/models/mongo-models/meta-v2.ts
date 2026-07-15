import { model, Schema } from "mongoose"
import type { IMetaV2 } from "../../types/models/meta-v2"

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
