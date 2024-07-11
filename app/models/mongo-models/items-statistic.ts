import { Schema, model } from "mongoose"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"

export interface IItemsStatistic {
  rank: number
  count: number
  name: Item
  pokemons: string[]
}

const itemsStatistic = new Schema({
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
})

export const ItemsStatistics = model<IItemsStatistic>(
  "ItemsStatistic",
  itemsStatistic,
  "items-statistic"
)

export default ItemsStatistics

export async function fetchMetaItems(): Promise<IItemsStatistic[]> {
  return fetch("/meta/items").then((res) => res.json())
}
