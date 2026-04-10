import type { IItemsStatisticV2 } from "../../../types/models/items-statistic-v2"

export type {
  IHistoryEntry,
  IItemV2,
  IItemsStatisticV2
} from "../../../types/models/items-statistic-v2"

export async function fetchMetaItems(): Promise<IItemsStatisticV2[]> {
  return fetch("/meta/items").then((res) => res.json())
}
