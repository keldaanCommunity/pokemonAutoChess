import CSS from "csstype"
import React from "react"
import { useAppSelector } from "../../../hooks"
import GamePlayer from "./game-player"

const style: CSS.Properties = {
  position: "absolute",
  height: "100%",
  width: "70px",
  right: "0.5%",
  top: "4px"
}

export default function GamePlayers(props: { click: (id: string) => void }) {
  const players = useAppSelector((state) => state.game.players)
  const sortedPlayers = [...players]
  return (
    <div style={style}>
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
