import type { IItemsStatisticV2 } from "../../../types/models/items-statistic-v2"

export type {
  IHistoryEntry,
  IItemsStatisticV2,
  IItemV2
} from "../../../types/models/items-statistic-v2"

export async function fetchMetaItems(): Promise<IItemsStatisticV2[]> {
  return fetch(`/meta/items?t=${new Date().getUTCDate()}`).then((res) => res.json())
}
