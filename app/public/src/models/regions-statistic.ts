import type { IRegionStatistic } from "../../../types/models/regions-statistic"

export type { IRegionStatistic } from "../../../types/models/regions-statistic"

export async function fetchMetaRegions(): Promise<IRegionStatistic[]> {
  return fetch("/meta/regions").then((res) => res.json())
}
