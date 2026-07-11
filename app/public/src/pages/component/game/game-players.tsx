import { GameMode } from "../../../../../types/enum/Game"
import { DEPTH } from "../../../game/depths"
import { useAppSelector } from "../../../hooks"
import GamePlayer from "./game-player"
import { sortPlayersByRankAndTeam } from "./sort-players"
import "./game-players.css"

export default function GamePlayers(props: { click: (id: string) => void }) {
  const players = useAppSelector((state) => state.game.players)
  const gameMode = useAppSelector((state) => state.game.gameMode)
  const isDoubleUp = gameMode === GameMode.DOUBLE_UP

  const teamColorMap = new Map<string, string>()

  if (isDoubleUp) {
    const DOUBLE_UP_TEAM_COLORS = ["#f9e07f", "#f4a7b9", "#a8e6e6", "#b8e6a0"]
    let colorIndex = 0
    ;[...players]
      .sort((a, b) => a.doubleUpTeamId.localeCompare(b.doubleUpTeamId))
      .forEach((p, i) => {
        if (p.doubleUpTeamId && !teamColorMap.has(p.doubleUpTeamId)) {
          teamColorMap.set(
            p.doubleUpTeamId,
            DOUBLE_UP_TEAM_COLORS[colorIndex % DOUBLE_UP_TEAM_COLORS.length]
          )
          colorIndex++
        }
      })
  }

  const sortedPlayers = sortPlayersByRankAndTeam(players, gameMode)

  return (
    <div id="game-players" style={{ zIndex: DEPTH.PLAYER_ICON }}>
      {sortedPlayers.map((p, i) => (
        <GamePlayer
          key={p.id}
          player={p}
          click={(id: string) => props.click(id)}
          index={i}
          teamColor={teamColorMap.get(p.doubleUpTeamId)}
        />
      ))}
    </div>
  )
}
