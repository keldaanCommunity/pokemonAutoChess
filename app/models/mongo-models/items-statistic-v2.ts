import { model, Schema } from "mongoose"
import type { IItemsStatisticV2 } from "../../types/models/items-statistic-v2"
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
  items: {
    type: Map,
    of: {
      rank: {
        type: Number
      },
      count: {
        type: Number
      },
      name: {
        type: String,
        enum: Item
      },
      pokemons: [
        {
          type: String,
          enum: Object.values(Pkm)
        }
      ],
      rank_history: {
        type: [historyEntrySchema],
        default: []
      },
      count_history: {
        type: [historyEntrySchema],
        default: []
      }
    }
  }
})

export default model<IItemsStatisticV2>(
  "ItemsStatisticV2",
  pokemonsStatistic,
  "items-statistic-v2"
)
