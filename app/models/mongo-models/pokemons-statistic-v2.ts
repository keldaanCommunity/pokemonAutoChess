import firebase from "firebase/compat/app"
import { model, Schema } from "mongoose"
import { EloRank } from "../../types/enum/EloRank"
import { Item } from "../../types/enum/Item"
import { Pkm } from "../../types/enum/Pokemon"
import { ITypeStatistics } from "../../types/meta"

export interface IHistoryEntry {
  date: string
  value: number
}

export interface IPokemonStatV2 {
  rank: number
  count: number
  name: Pkm
  items: Item[]
  item_count: number
  rank_history?: IHistoryEntry[]
  count_history?: IHistoryEntry[]
  item_count_history?: IHistoryEntry[]
}

export interface IPokemonsStatisticV2 {
  tier: EloRank
  pokemons: Map<EloRank, IPokemonStatV2>
}

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
