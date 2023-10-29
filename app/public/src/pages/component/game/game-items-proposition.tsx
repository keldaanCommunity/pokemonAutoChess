import React, { useState } from "react"
import GameItem from "./game-item"
import { useAppSelector } from "../../../hooks"
import "./game-items-proposition.css"

export default function GameItemsProposition() {
  const itemsProposition = useAppSelector(
    (state) => state.game.itemsProposition
  )
  const pokemonsProposition = useAppSelector(
    (state) => state.game.pokemonsProposition
  )

  const [visible, setVisible] = useState(true)
  if (itemsProposition.length > 0 && pokemonsProposition.length === 0) {
    return (
      <div className="game-items-proposition">
        <div
          className="game-items-proposition-list"
          style={{ visibility: visible ? "visible" : "hidden" }}
        >
          {itemsProposition.map((item, i) => {
            return <GameItem key={i} item={item} />
          })}
        </div>

        <div className="show-hide-action">
          <button
            className="bubbly orange active"
            onClick={() => {
              setVisible(!visible)
            }}
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
      </div>
    )
  } else {
    return null
  }
}
