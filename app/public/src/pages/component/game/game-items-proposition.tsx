import React, { useState } from "react"
import GameItem from "./game-item"
import CSS from "csstype"
import { useAppSelector } from "../../../hooks"

const style: CSS.Properties = {
  position: "absolute",
  top: "30%",
  left: "15.5%",
  width: "60%"
}

export default function GameItemsProposition() {
  const itemsProposition = useAppSelector((state) => state.game.itemsProposition)
  const pokemonsProposition = useAppSelector((state) => state.game.pokemonsProposition)

  const [visible, setVisible] = useState(true)
  if (itemsProposition.length > 0 && pokemonsProposition.length === 0) {
    return (
      <div style={style}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
            visibility: visible ? 'visible' : 'hidden'
          }}
        >
          {itemsProposition.map((e, i) => {
            return <GameItem key={i} item={e} />
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
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
