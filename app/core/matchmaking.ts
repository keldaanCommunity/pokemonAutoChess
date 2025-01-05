import Player from "../models/colyseus-models/player"
import GameState from "../rooms/states/game-state"
import { IPlayer } from "../types"
import { sum } from "../utils/array"
import { logger } from "../utils/logger"
import { pickRandomIn, shuffleArray } from "../utils/random"
import { values } from "../utils/schemas"

export type Matchup = {
  bluePlayer: Player
  redPlayer: Player
  count: number
  distance: number
  ghost?: boolean
}

function getAllPossibleMatchups(remainingPlayers: Player[]): Matchup[] {
  const matchups: Matchup[] = []
  for (let i = 0; i < remainingPlayers.length; i++) {
    for (let j = i + 1; j < remainingPlayers.length; j++) {
      const bluePlayer = remainingPlayers[i],
        redPlayer = remainingPlayers[j]
      matchups.push({
        bluePlayer,
        redPlayer,
        count: getCount(bluePlayer, redPlayer, false),
        distance: getDistance(bluePlayer, redPlayer, false)
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
  const remainingPlayers: Player[] = players.filter(
    (p) => !combination.some((m) => m.bluePlayer === p || m.redPlayer === p)
  )
  if (remainingPlayers.length === 0)
    return [combination] // combination is complete
  else if (remainingPlayers.length === 1) {
    // player count is odd, so we need to add one ghost matchup at the end of each combination
    const remainingPlayer = remainingPlayers[0]
    const ghostMatchups = matchups
      .filter(
        (m) =>
          m.bluePlayer === remainingPlayer || m.redPlayer === remainingPlayer
      )
      .map((matchup) => {
        const playerToGhost =
          matchup.bluePlayer === remainingPlayer
            ? matchup.redPlayer
            : matchup.bluePlayer
        const ghostMatchup: Matchup = {
          ghost: true,
          bluePlayer: remainingPlayer, // ensure remaining player is blue player and ghost is red player in ghost matchups
          redPlayer: playerToGhost,
          count: getCount(remainingPlayer, playerToGhost, true),
          distance: getDistance(remainingPlayer, playerToGhost, true)
        }
        return ghostMatchup
      })

    return ghostMatchups.map((m) => [...combination, m])
  } else {
    const remainingMatchups = matchups.filter(
      (m) =>
        remainingPlayers.includes(m.bluePlayer) &&
        remainingPlayers.includes(m.redPlayer)
    )
    if (remainingMatchups.length === 0) {
      // no more matchups, need to complete with a ghost matchup
      return completeMatchupCombination([...combination], matchups, players)
    }
    return remainingMatchups.flatMap((m) =>
      completeMatchupCombination([...combination, m], matchups, players)
    )
  }
}

export function selectMatchups(state: GameState): Matchup[] {
  /* step 1) establish all the matchups possible with players alive and their associated count
  count = number of times A fought B or his ghost) + (number of times B fought A or his ghost) */
  const players = shuffleArray(values(state.players).filter((p) => p.alive))
  if (players.length <= 1) return []
  const matchups = getAllPossibleMatchups(players)

  /* step 2) establish all the matchup combinations possible */
  const matchupCombinations: Matchup[][] = completeMatchupCombination(
    [],
    matchups,
    players
  )

  /* step 3) get matchup combinations that have the lowest total count */
  matchupCombinations.sort((a, b) => {
    return sum(a.map((m) => m.count)) - sum(b.map((m) => m.count))
  })
  const lowestTotalCount = sum(matchupCombinations[0].map((m) => m.count))
  const lowestTotalCountMatchupCombinations = matchupCombinations.filter(
    (matchups) => {
      return sum(matchups.map((m) => m.count)) === lowestTotalCount
    }
  )

  /* step 4) get matchup combinations that have the largest total distance */
  lowestTotalCountMatchupCombinations.sort((a, b) => {
    return sum(b.map((m) => m.distance)) - sum(a.map((m) => m.distance))
  })
  const maxDistance = sum(
    lowestTotalCountMatchupCombinations[0].map((m) => m.distance)
  )
  const mostDistantMatchups = lowestTotalCountMatchupCombinations.filter(
    (matchups) => {
      return sum(matchups.map((m) => m.distance)) === maxDistance
    }
  )

  /* step 5) pick a random matchup combination among the most distant and the lowest count */
  const selectedMatchups = pickRandomIn(mostDistantMatchups)
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
      .map(
        (m) =>
          `${m.a.name} - ${m.b.name} (count: ${m.count}, distance: ${m.distance})`
      )
      .join("\n")
  )
  logger.debug(
    `${matchupCombinations.length} matchup combinations:`,
    matchupCombinations
      .map(
        (c) =>
          c.map((m) => `${m.a.name} - ${m.b.name}`).join(" ; ") +
          ` (total count: ${sum(c.map((m) => m.count))}, total distance: ${sum(
            c.map((m) => m.distance)
          )})`
      )
      .join("\n")
  )
  logger.debug("Selected matchups:")
  selectedMatchups.forEach((matchup) => {
    logger.debug(
      `${matchup.a.name} - ${matchup.b.name} (count: ${
        matchup.count
      }, distance: ${matchup.distance}) (${matchup.ghost ? "ghost" : "pvp"})`
    )
  })
*/
  return selectedMatchups
}

export function getCount(a: IPlayer, b: IPlayer, bIsGhost: boolean): number {
  // count(A,B) = (number of times A fought B or his ghost) + (number of times B fought A or his ghost)
  const countA =
    (a.opponents.get(b.id) ?? 0) + (a.opponents.get("ghost-" + b.id) ?? 0)
  const countB =
    (b.opponents.get(a.id) ?? 0) + (b.opponents.get("ghost-" + a.id) ?? 0)

  if (bIsGhost) return countA
  else return countA + countB
}

export function getDistance(a: IPlayer, b: IPlayer, bIsGhost: boolean): number {
  // distance(A,B) = (number of stages ago A fought B or his ghost) + (number of stages ago B fought A or his ghost)
  const distanceA =
    a.history.length -
    a.history.findLastIndex((h) => h.id === b.id || h.id === "ghost-" + b.id)
  const distanceB =
    b.history.length -
    b.history.findLastIndex((h) => h.id === a.id || h.id === "ghost-" + a.id)
  if (bIsGhost) return distanceA
  else return distanceA + distanceB
}
