import { useAppSelector } from "../../../hooks"
import GamePlayer from "./game-player"
import "./game-players.css"

export default function GamePlayers(props: { click: (id: string) => void }) {
  const players = useAppSelector((state) => state.game.players)
  const sortedPlayers = [...players]
  return (
    <div id="game-players">
      {sortedPlayers
        .sort((a, b) => {
          return a.rank - b.rank
        })
        .map((p, i) => {
          return (
            <GamePlayer
              key={p.id}
              player={p}
              click={(id: string) => props.click(id)}
              index={i}
            />
          )
        })}
    </div>
  )
}
