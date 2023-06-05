import React from "react"
import { useAppSelector } from "../../../hooks"
import "./game-timer-bar.css"

export default function TimerBar() {
  const totalTime = useAppSelector((state) => state.game.phaseDuration)
  const time = useAppSelector((state) => state.game.roundTime)
  const pc = Math.min(Math.max((100 * time) / totalTime, 0), 100)

  return (
    <div className="timer-bar">
      <div className="timer-bar-inner" style={{ width: `${pc}%` }}></div>
    </div>
  )
}
