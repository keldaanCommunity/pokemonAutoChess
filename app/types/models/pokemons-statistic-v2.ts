import { EloRank } from "../enum/EloRank"
import { Item } from "../enum/Item"
import { Pkm } from "../enum/Pokemon"
import { IHistoryEntry } from "./history"

export type { IHistoryEntry } from "./history"

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
  pokemons: Record<string, IPokemonStatV2>
}
