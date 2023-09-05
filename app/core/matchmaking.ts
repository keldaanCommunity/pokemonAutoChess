import Player from "../models/colyseus-models/player"
import GameState from "../rooms/states/game-state"
import { logger } from "../utils/logger"

export type Matchup = { a: Player; b: Player; count: number; ghost?: boolean }

export function selectMatchups(state: GameState): Matchup[] {
  const matchups: Matchup[] = []
  let players = [...state.players.values()].filter((p) => p.alive)
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const a = players[i],
        b = players[j]
      matchups.push({
        a,
        b,
        count: (a.opponents.get(b.id) ?? 0) + (b.opponents.get(a.id) ?? 0)
      })
    }
  }
  matchups.sort((a, b) => a.count - b.count) // the least battles between two opponents, the most likely to be next
  let candidateMatchups = [...matchups]
  const selectedMatchups: Matchup[] = []

  while (players.length > 1) {
    const matchup = candidateMatchups[0]
    matchup.ghost = false
    selectedMatchups.push(matchup)
    players = players.filter((p) => !(p === matchup.a || p === matchup.b))
    candidateMatchups = candidateMatchups.filter(
      (m) =>
        !(
          m.a === matchup.a ||
          m.b === matchup.b ||
          m.a === matchup.b ||
          m.b === matchup.a
        )
    )
  }

  if (players.length === 1) {
    // player count is odd, so we need to elect one ghost matchup
    const remainingPlayer = players[0]
    const ghostMatchup = matchups.filter(
      (m) => m.a === remainingPlayer || m.b === remainingPlayer
    )[0]
    ghostMatchup.ghost = true
    selectedMatchups.push(ghostMatchup)
  }
/*
  logger.debug("Matchmaking round " + state.stageLevel)
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
