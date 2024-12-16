import { EloRankThreshold } from "../types/Config"
import { EloRank } from "../types/enum/EloRank"

export function getRank(elo: number): EloRank {
  let rank = EloRank.LEVEL_BALL
  ;(Object.keys(EloRankThreshold) as EloRank[]).forEach((e) => {
    if (elo >= EloRankThreshold[e]) {
      rank = e
    }
  })
  return rank
}

export function formatMinMaxRanks(
  minRank: EloRank | null,
  maxRank: EloRank | null
): string {
  const ranksThresholds = Object.values(EloRankThreshold)
  if (minRank === EloRank.LEVEL_BALL) minRank = null
  if (maxRank === EloRank.BEAST_BALL) maxRank = null
  const min = minRank ? EloRankThreshold[minRank] : 0
  const max = maxRank
    ? (ranksThresholds.at(
        ranksThresholds.indexOf(EloRankThreshold[maxRank]) + 1
      ) ?? 10000)
    : 9999

  if (minRank && maxRank) {
    return `[${min} - ${max - 1}]`
  } else if (minRank) {
    return `[${min}+]`
  } else if (maxRank) {
    return `[<${max}]`
  } else {
    return ""
  }
}
