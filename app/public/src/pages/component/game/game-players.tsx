import { GameMode } from "../../../../../types/enum/Game"
import { DEPTH } from "../../../game/depths"
import { useAppSelector } from "../../../hooks"
import { sortPlayersByRankAndTeam } from "../../../models/sort-players"
import GamePlayer from "./game-player"
import "./game-players.css"

export default function GamePlayers(props: { click: (id: string) => void }) {
  const players = useAppSelector((state) => state.game.players)
  const gameMode = useAppSelector((state) => state.game.gameMode)
  const isDoubleUp = gameMode === GameMode.DOUBLE_UP

  const teamColorMap = new Map<string, string>()

  if (isDoubleUp) {
    const teams = [...new Set(players.map(p => p.doubleUpTeamId))]
    teams.forEach((team, i) => teamColorMap.set(team, `var(--color-team${i+1})`))
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
