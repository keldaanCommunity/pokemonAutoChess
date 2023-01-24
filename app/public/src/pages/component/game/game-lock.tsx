import React from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { lockClick } from "../../../stores/NetworkStore"

export default function GameLock() {
  const dispatch = useAppDispatch()
  const shopLocked = useAppSelector((state) => state.game.shopLocked)

  return (
    <button
      className={`bubbly lock-icon ${shopLocked ? "red" : "green"}`}
      onClick={() => { dispatch(lockClick()) }}
      title="Lock current shop for next turn"
    >
      <img
        style={{ width: "2vw" }}
        src="/assets/ui/lock.svg"
      />
    </button>
  )
}
