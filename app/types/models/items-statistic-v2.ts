import type { Item } from "../enum/Item"
import type { Pkm } from "../enum/Pokemon"
import type { IHistoryEntry } from "./history"

export type { IHistoryEntry } from "./history"

export interface IItemsStatisticV2 {
  tier: string
  items: Record<string, IItemV2>
}

export interface IItemV2 {
  rank: number
  count: number
  name: Item
  pokemons: Pkm[]
  rank_history?: IHistoryEntry[]
  count_history?: IHistoryEntry[]
}
