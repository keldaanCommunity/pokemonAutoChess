import { model, Schema } from "mongoose"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"

export interface IItemsStatisticV2 {
  tier: string
  items: Map<string, IItemV2>
}

export interface IItemV2 {
  rank: number
  count: number
  name: Item
  pokemons: Pkm[]
}

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
      ]
    }
  }
})

export default model<IItemsStatisticV2>(
  "ItemsStatisticV2",
  pokemonsStatistic,
  "items-statistic-v2"
)

export async function fetchMetaItems(): Promise<IItemsStatisticV2[]> {
  return fetch("/meta/items").then((res) => res.json())
}
