import { EloRank } from "../types/enum/EloRank"
import { EloRankThreshold } from "../types/Config"

export function getRank(elo: number): EloRank {
  let rank = EloRank.BEGINNER
  ;(Object.keys(EloRankThreshold) as EloRank[]).forEach((e) => {
    if (elo > EloRankThreshold[e]) {
      rank = e
    }
  })
  return rank
}
