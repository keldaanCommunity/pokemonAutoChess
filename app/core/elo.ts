import EloRank from "elo-rank"
import { ISimplePlayer } from "../types"
import { average, min } from "../utils/number"
import { logger } from "../utils/logger"

export function computeElo(
  player: ISimplePlayer,
  rank: number,
  previousElo: number,
  players: ISimplePlayer[]
) {
  const eloEngine = new EloRank()
  const eloGains = new Array<number>()
  //logger.debug("computing elo for", player.name, "rank", rank, "elo", previousElo)
  players.forEach((plyr) => {
    if (player.id !== plyr.id) {
      const expectedScore = eloEngine.getExpected(previousElo, plyr.elo)
      //logger.debug("against ", plyr.name, "expected", expectedScoreA)
      if (rank < plyr.rank) {
        eloGains.push(eloEngine.updateRating(expectedScore, 1, previousElo))
      } else {
        eloGains.push(eloEngine.updateRating(expectedScore, 0, previousElo))
      }
    }
  })
  //logger.debug("elo gains", eloGains)

  let meanGain = min(0)(Math.floor(average(...eloGains)))
  //logger.debug("mean gain", meanGain)
  if (rank <= Math.floor(players.length / 2) && meanGain < previousElo) {
    meanGain = previousElo // ensure to not lose ELO if you're on the upper part of the ranking
  }

  logger.info(
    `${player.name} (was ${previousElo}) will be ${meanGain} (${rank})`
  )
  return meanGain
}
