import React, { useState } from "react"
import GameItem from "./game-item"
import CSS from "csstype"
import { useAppSelector } from "../../../hooks"

const style: CSS.Properties = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translateX(-50%)"
}

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
      <div style={style}>
        <div
          style={{
            display: "flex",
            gap: "1vw",
            justifyContent: "center",
            visibility: visible ? "visible" : "hidden"
          }}
        >
          {itemsProposition.map((e, i) => {
            return <GameItem key={i} item={e} />
          })}
        </div>

        <div
          style={{ display: "flex", justifyContent: "center", margin: "1em" }}
        >
          <button
            className="bubbly orange"
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
