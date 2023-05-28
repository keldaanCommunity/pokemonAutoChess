import EloRank from "elo-rank"
import { ISimplePlayer } from "../types"
import { average, min } from "../utils/number"
import { logger } from "../utils/logger"

export function computeElo(
  player: ISimplePlayer,
  rank: number,
  elo: number,
  players: ISimplePlayer[]
) {
  const eloEngine = new EloRank()
  const eloGains = new Array<number>()
  //logger.debug("computing elo for", player.name, "rank", rank, "elo", elo)
  players.forEach((plyr) => {
    if (player.name != plyr.name) {
      const expectedScoreA = eloEngine.getExpected(elo, plyr.elo)
      //logger.debug("against ", plyr.name, "expected", expectedScoreA)
      if (rank < plyr.rank) {
        eloGains.push(eloEngine.updateRating(expectedScoreA, 1, player.elo))
      } else {
        eloGains.push(eloEngine.updateRating(expectedScoreA, 0, player.elo))
      }
    }
  })
  //logger.debug("elo gains", eloGains)

  let meanGain = min(0)(Math.floor(average(...eloGains)))
  //logger.debug("mean gain", meanGain)
  if (rank <= Math.floor(players.length / 2) && meanGain < elo) {
    meanGain = elo // ensure to not lose ELO if you're on the upper part of the ranking
  }

  logger.info(
    `${player.name} (was ${player.elo}) will be ${meanGain} (${rank})`
  )
  return meanGain
}
