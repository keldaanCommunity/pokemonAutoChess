import { ISimplePlayer } from "../types"
import { GameMode } from "../types/enum/Game"
import { logger } from "../utils/logger"
import { average, min } from "../utils/number"
import { EloEngine } from "./elo-engine"

export function computeElo(
  player: ISimplePlayer,
  rank: number,
  previousElo: number,
  players: ISimplePlayer[],
  gameMode: GameMode,
  isBot: boolean = false
) {
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
  if (
    rank <= Math.floor(players.length / 2) &&
    newElo < previousElo &&
    !isBot
  ) {
    newElo = previousElo // ensure to not lose ELO if you're on the upper part of the ranking
  }
  if (rank === 1 && gameMode === GameMode.RANKED) {
    newElo = min(previousElo + 1)(newElo) // ensure you get minimum +1 if finishing first
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

  // logger.info(
  //   `${player.name} (was ${previousElo}) will be ${meanGain} (${rank})`
  // )
  return newElo
}
