import { DEPTH } from "../../../game/depths"
import { useAppSelector } from "../../../hooks"
import GamePlayer from "./game-player"
import "./game-players.css"
import { sortPlayersByRankAndTeam } from "./sort-players"

export default function GamePlayers(props: { click: (id: string) => void }) {
  const players = useAppSelector((state) => state.game.players)
  const gameMode = useAppSelector((state) => state.game.gameMode)

  const DOUBLE_UP_TEAM_COLORS = ["#f9e07f", "#f4a7b9", "#a8e6e6", "#b8e6a0"]

const teamColorMap = new Map<string, string>()
let colorIndex = 0
;[...players]
  .sort((a, b) => a.doubleUpTeamId.localeCompare(b.doubleUpTeamId))
  .forEach((p) => {
    if (p.doubleUpTeamId && !teamColorMap.has(p.doubleUpTeamId)) {
      teamColorMap.set(p.doubleUpTeamId, DOUBLE_UP_TEAM_COLORS[colorIndex++ % DOUBLE_UP_TEAM_COLORS.length])
    }
  })

const sortedPlayers = sortPlayersByRankAndTeam(players, gameMode)

  return (
    <div id="game-players" style={{ zIndex: DEPTH.PLAYER_ICON }}>
      {sortedPlayers.map((p, i) => (
        <GamePlayer
          key={p.id}
          player={p}
          click={(id: string) => props.click(id)}
          index={i}
          teamColor={gameMode === "DOUBLE_UP" ? teamColorMap.get(p.doubleUpTeamId) : undefined}
        />
      ))}
    </div>
  )
}
