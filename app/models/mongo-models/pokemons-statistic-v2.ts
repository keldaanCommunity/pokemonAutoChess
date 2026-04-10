import { model, Schema } from "mongoose"
import type { IPokemonsStatisticV2 } from "../../types/models/pokemons-statistic-v2"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"

const historyEntrySchema = new Schema(
  {
    date: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  { _id: false }
)

const pokemonsStatistic = new Schema({
  tier: {
    type: String
  },
  pokemons: {
    type: Map,
    of: {
      item_count: {
        type: Number
      },
      rank: {
        type: Number
      },
      count: {
        type: Number
      },
      name: {
        type: String,
        enum: Pkm
      },
      items: [
        {
          type: String,
          enum: Object.values(Item)
        }
      ],
      rank_history: {
        type: [historyEntrySchema],
        default: []
      },
      count_history: {
        type: [historyEntrySchema],
        default: []
      },
      item_count_history: {
        type: [historyEntrySchema],
        default: []
      }
    }
  }
})

export default model<IPokemonsStatisticV2>(
  "PokemonsStatisticV2",
  pokemonsStatistic,
  "pokemons-statistic-v2"
)
