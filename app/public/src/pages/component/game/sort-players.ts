import type { IPlayer } from "../../../../../types"

export function sortPlayersByRankAndTeam(players: IPlayer[], gameMode: string): IPlayer[] {
  return [...players].sort((a, b) => {
    if (gameMode === "DOUBLE_UP") {
      const aAlive = a.life > 0
      const bAlive = b.life > 0
      // Dead players always go below alive players
      if (aAlive !== bAlive) return aAlive ? -1 : 1
      // Both dead: trust the server's rank (higher rank number = eliminated earlier = shown lower)
      if (!aAlive && !bAlive) return a.rank - b.rank
      // Both alive: group by team, order teams by life descending
      if (a.doubleUpTeamId !== b.doubleUpTeamId) {
        if (a.life !== b.life) return b.life - a.life
        return a.doubleUpTeamId.localeCompare(b.doubleUpTeamId)
      }
      return a.id.localeCompare(b.id)
    }
    return a.rank - b.rank
  })
}
