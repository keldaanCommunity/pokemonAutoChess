import type { ITitleStatistic } from "../../../types/models/title-statistic"

export type { ITitleStatistic } from "../../../types/models/title-statistic"

export async function fetchTitles(): Promise<ITitleStatistic[]> {
  return fetch("/titles").then((res) => res.json())
}
