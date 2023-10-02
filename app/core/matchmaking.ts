import Player from "../models/colyseus-models/player"
import { getAvatarString } from "../public/src/utils"
import GameState from "../rooms/states/game-state"
import { Emotion } from "../types"
import { PkmIndex, Pkm } from "../types/enum/Pokemon"
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
    if (ghostMatchup.a.id !== remainingPlayer.id) {
      // ensure remaining player is player A and ghost is playerB in ghost round
      ghostMatchup.b = ghostMatchup.a
      ghostMatchup.a = remainingPlayer
    }
    /* dereference player so that money gain is not applied to original player when playing as ghost */
    const ghost: Player = {
      ...ghostMatchup.b,
      id: "ghost-id",
      name: `Ghost of ${ghostMatchup.b.name}`,
      avatar: getAvatarString(PkmIndex[Pkm.GASTLY], true, Emotion.HAPPY)
    } as Player
    ghostMatchup.b = ghost
    selectedMatchups.push(ghostMatchup)
    //logger.debug(`Round ${state.stageLevel} has ${ghost.name}`)
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
