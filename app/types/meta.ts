import { EloRank } from "./enum/EloRank"

export type ITypeStatistics = {
  [tier in EloRank]: {
    [synergy: string]: {
      average_rank: number
      count: number
    }
  }
}
