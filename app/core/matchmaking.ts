import Player from "../models/colyseus-models/player"
import { getAvatarString } from "../public/src/utils"
import GameState from "../rooms/states/game-state"
import { Emotion } from "../types"
import { PkmIndex, Pkm } from "../types/enum/Pokemon"
import { sum } from "../utils/array"
import { logger } from "../utils/logger"
import { pickRandomIn } from "../utils/random"
import { values } from "../utils/schemas"

export type Matchup = { a: Player; b: Player; count: number; ghost?: boolean }

function getAllPossibleMatchups(remainingPlayers: Player[]): Matchup[] {
  const matchups: Matchup[] = []
  for (let i = 0; i < remainingPlayers.length; i++) {
    for (let j = i + 1; j < remainingPlayers.length; j++) {
      const a = remainingPlayers[i],
        b = remainingPlayers[j]
      matchups.push({
        a,
        b,
        count: (a.opponents.get(b.id) ?? 0) + (b.opponents.get(a.id) ?? 0)
      })
    }
  }
  return matchups
}

function completeMatchupCombination(
  combination: Matchup[],
  matchups: Matchup[],
  players: Player[]
): Matchup[][] {
  const remainingPlayers = players.filter(
    (p) => !combination.some((m) => m.a === p || m.b === p)
  )
  if (remainingPlayers.length === 0)
    return [combination] // combination is complete
  else if (remainingPlayers.length === 1) {
    // player count is odd, so we need to add one ghost matchup at the end of each combination
    const remainingPlayer = remainingPlayers[0]
    const ghostMatchups = matchups
      .filter((m) => m.a === remainingPlayer || m.b === remainingPlayer)
      .map((matchup) => {
        const playerToGhost =
          matchup.a === remainingPlayer ? matchup.b : matchup.a
        const ghost: Player = {
          /* dereference player so that money gain is not applied to original player when playing as ghost */
          ...playerToGhost,
          name: `Ghost of ${playerToGhost.name}`,
          avatar: getAvatarString(PkmIndex[Pkm.GASTLY], true, Emotion.HAPPY)
        } as Player
        const ghostMatchup: Matchup = {
          ghost: true,
          a: remainingPlayer, // ensure remaining player is player A and ghost is playerB in ghost round
          b: ghost,
          count: matchup.count
        }
        return ghostMatchup
      })

    return ghostMatchups.map((m) => [...combination, m])
  } else {
    const remainingMatchups = matchups.filter(
      (m) => remainingPlayers.includes(m.a) && remainingPlayers.includes(m.b)
    )
    return remainingMatchups.flatMap((m) =>
      completeMatchupCombination([...combination, m], matchups, players)
    )
  }
}

export function selectMatchups(state: GameState): Matchup[] {
  /* step 1) establish all the matchups possible with players alive and their associated count
  count = number of times A fought B or his ghost) +(number of times B fought A or his ghost) */
  let players = values(state.players).filter((p) => p.alive)
  const matchups = getAllPossibleMatchups(players)

  /* step 2) establish all the matchup combinations possible */
  const matchupCombinations: Matchup[][] = completeMatchupCombination(
    [],
    matchups,
    players
  )

  /* step 3) pick a random matchup combination amongst those who have the lowest total count */
  matchupCombinations.sort((a, b) => {
    return sum(a.map((m) => m.count)) - sum(b.map((m) => m.count))
  })
  const lowestTotalCount = sum(matchupCombinations[0].map((m) => m.count))
  const lowestTotalCountMatchupCombinations = matchupCombinations.filter(
    (matchups) => {
      return sum(matchups.map((m) => m.count)) === lowestTotalCount
    }
  )

  const selectedMatchups = pickRandomIn(lowestTotalCountMatchupCombinations)
  /*
  logger.debug("Matchmaking round " + state.stageLevel)
  logger.debug(
    "Eliminated: " +
      values(state.players)
        .filter((p) => !p.alive)
        .map((p) => p.name)
  )
  logger.debug(
    `${matchups.length} matchups:`,
    matchups
      .map((m) => `${m.a.name} - ${m.b.name} (count: ${m.count})`)
      .join("\n")
  )
  logger.debug(
    `${matchupCombinations.length} matchup combinations:`,
    matchupCombinations
      .map(
        (c) =>
          c.map((m) => `${m.a.name} - ${m.b.name}`).join(" ; ") +
          ` (total count: ${sum(c.map((m) => m.count))})`
      )
      .join("\n")
  )
  logger.debug("Selected matchups:")
  selectedMatchups.forEach((matchup) => {
    logger.debug(
      `${matchup.a.name} - ${matchup.b.name} (count: ${matchup.count}) (${
        matchup.ghost ? "ghost" : "pvp"
      })`
    )
  })
*/
  return selectedMatchups
}
