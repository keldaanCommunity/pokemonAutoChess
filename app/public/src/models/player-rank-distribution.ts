import type { IPlayerRankDistribution } from "../../../types/models/player-rank-distribution"

export type {
  IPlayerRankDistribution,
  IPlayerRankDistributionBucket
} from "../../../types/models/player-rank-distribution"

export async function fetchPlayerRankDistribution(): Promise<IPlayerRankDistribution> {
  const response = await fetch("/meta/player-rank-distribution")
  if (!response.ok) {
    throw new Error(
      `Failed to fetch player rank distribution: ${response.status}`
    )
  }
  return response.json()
}
