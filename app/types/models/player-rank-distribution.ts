export interface IPlayerRankDistributionBucket {
  bucketLabel: string
  count: number
  percentage: number
  topPercent: number
  minElo: number | null
  maxElo: number | null
  isUnderflow: boolean
}

export interface IPlayerRankDistribution {
  updatedAt: string
  totalPlayers: number
  bucketSize: number
  bucketStart: number
  buckets: IPlayerRankDistributionBucket[]
}
