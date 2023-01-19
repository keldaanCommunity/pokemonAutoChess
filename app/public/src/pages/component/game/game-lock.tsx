import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import CSS from "csstype"
import { lockClick } from "../../../stores/NetworkStore"

const style: CSS.Properties = {
  margin: "5px"
}

export default function GameLock() {
  const dispatch = useAppDispatch()
  const shopLocked = useAppSelector((state) => state.game.shopLocked)

  return (
    <button
      className={shopLocked ? "bubbly red" : "bubbly green"}
      onClick={() => {
        dispatch(lockClick())
      }}
      style={style}
    >
      <img
        style={{
          width: "25px",
          marginLeft: "-4px",
          marginTop: "-10px"
        }}
        src="/assets/ui/lock.png"
      />
    </button>
  )
}
