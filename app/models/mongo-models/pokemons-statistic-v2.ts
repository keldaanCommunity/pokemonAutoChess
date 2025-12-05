import firebase from "firebase/compat/app"
import { model, Schema } from "mongoose"
import { EloRank } from "../../types/enum/EloRank"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"
import { ITypeStatistics } from "../../types/meta"

export interface IPokemonsStatisticV2 {
  tier: EloRank
  pokemons: Map<
    EloRank,
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

export async function fetchMetaTypes(): Promise<ITypeStatistics> {
  const token = await firebase.auth().currentUser?.getIdToken()
  return fetch("/meta/types", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then((res) => res.json())
}
