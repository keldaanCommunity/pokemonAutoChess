import { EloRank } from "../../types/enum/EloRank"

// games that finish before level 10 are not counted for XP and ELO gains to avoid potential abuse
export const MinStageForGameToCount = 10

export const EloRankThreshold: { [key in EloRank]: number } = {
  [EloRank.LEVEL_BALL]: 0,
  [EloRank.NET_BALL]: 1050,
  [EloRank.SAFARI_BALL]: 1100,
  [EloRank.LOVE_BALL]: 1150,
  [EloRank.PREMIER_BALL]: 1200,
  [EloRank.QUICK_BALL]: 1250,
  [EloRank.POKE_BALL]: 1300,
  [EloRank.SUPER_BALL]: 1350,
  [EloRank.ULTRA_BALL]: 1400,
  [EloRank.MASTER_BALL]: 1500,
  [EloRank.BEAST_BALL]: 1600
}
