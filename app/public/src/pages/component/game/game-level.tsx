import React from "react"
import CSS from "csstype"
import { useAppDispatch } from "../../../hooks"
import { levelClick } from "../../../stores/NetworkStore"

const style: CSS.Properties = {
  margin: "5px",
  marginTop: "0px",
  marginRight: "0px",
  fontSize: "1.1vw"
}

export default function GameLevel() {
  const dispatch = useAppDispatch()
  return (
    <button
      className="bubbly orange"
      onClick={() => {
        dispatch(levelClick())
      }}
      style={style}
    >
      <div>
        Buy XP 4
        <img
          style={{ width: "20px", marginBottom: "5px" }}
          src="/assets/ui/money.png"
        />
      </div>
    </button>
  )
}
