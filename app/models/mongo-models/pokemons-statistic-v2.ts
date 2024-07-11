import { Schema, model } from "mongoose"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"

export interface IPokemonsStatisticV2 {
  tier: string
  pokemons: Map<
    string,
    {
      rank: number
      count: number
      name: Pkm
      items: Item[]
      item_count: number
    }
  >
}

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
      ]
    }
  }
})

export default model<IPokemonsStatisticV2>(
  "PokemonsStatisticV2",
  pokemonsStatistic,
  "pokemons-statistic-v2"
)

export async function fetchMetaPokemons(): Promise<IPokemonsStatisticV2[]> {
  return fetch("/meta/pokemons").then((res) => res.json())
}
