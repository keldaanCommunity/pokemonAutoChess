import { memo } from "react"
import { ToastContainer } from "react-toastify"
import { useAppSelector } from "../../../hooks"
import { sortPlayersByRankAndTeam } from "./sort-players"

function GameToasts() {
  const players = useAppSelector((state) => state.game.players)
  const gameMode = useAppSelector((state) => state.game.gameMode)

  const sortedPlayers = sortPlayersByRankAndTeam(players, gameMode)

  return (
    <div>
      {sortedPlayers.map((p, i) => (
        <ToastContainer
          key={p.id}
          className="toast toast-new-pokemon"
          containerId={p.id}
          position="top-right"
          autoClose={500}
          hideProgressBar
          newestOnTop
          closeOnClick
          limit={1}
          closeButton={false}
          style={{ top: `${2 + i * 12.5}%` }}
        />
      ))}
    </div>
  )
}
export default memo(GameToasts)
