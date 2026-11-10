import { MAX_ELO_CORRECTION, TARGETED_ELO_AVERAGE } from "../config/game/elo"
import { getAverageElo } from "../services/elo-average"
import type { ISimplePlayer } from "../types"
import { average, clamp, min } from "../utils/number"
import { EloEngine } from "./elo-engine"

export async function computeElo(
  player: ISimplePlayer,
  rank: number,
  previousElo: number,
  players: ISimplePlayer[],
  isBot: boolean = false
) {
  const averageElo = await getAverageElo()
  const eloEngine = new EloEngine()
  const eloGains = new Array<number>()
  //logger.debug("computing elo for", player.name, "rank", rank, "elo", previousElo)
  players.forEach((plyr) => {
    if (player.id !== plyr.id) {
      const expectedScore = eloEngine.getExpected(previousElo, plyr.elo)
      //logger.debug("against ", plyr.name, "expected", expectedScoreA)
      if (rank < plyr.rank) {
        eloGains.push(
          eloEngine.updateRating(expectedScore, 1, previousElo, player.games)
        )
      } else {
        eloGains.push(
          eloEngine.updateRating(expectedScore, 0, previousElo, player.games)
        )
      }
    }
  })
  //logger.debug("elo gains", eloGains)

  let newElo = min(0)(Math.floor(average(...eloGains)))
  //logger.debug("mean gain", meanGain)
  if (rank <= Math.floor(players.length / 2) && !isBot) {
    newElo = min(previousElo + 1)(newElo) // ensure you get minimum +1 if you're on the upper part of the ranking
  }

  if (
    players.length % 2 === 1 &&
    rank === Math.floor(players.length / 2) + 1 &&
    newElo < previousElo
  ) {
    /*
    In games with an odd number of players, elo losses for the player in the middle rank are now reduced by 50%. 
    Elo gains are not reduced. That is: 4th in a 7 players lobby, 3rd in a 5 players lobby, 2nd in a 3 players lobby.
    */
    const loss = previousElo - newElo
    newElo = previousElo - Math.ceil(loss / 2)
  }

  // Compensate ELO deflation by boosting gains when the average elo of recent
  // players is below the target. Losses are never modified.
  const gain = newElo - previousElo
  if (!isBot && gain > 0) {
    const correction = clamp(
      (TARGETED_ELO_AVERAGE - averageElo) / TARGETED_ELO_AVERAGE,
      -MAX_ELO_CORRECTION,
      MAX_ELO_CORRECTION
    )
    newElo = previousElo + Math.round(gain * (1 + correction))
  }

  // logger.info(
  //   `${player.name} (was ${previousElo}) will be ${meanGain} (${rank})`
  // )
  return newElo
}
