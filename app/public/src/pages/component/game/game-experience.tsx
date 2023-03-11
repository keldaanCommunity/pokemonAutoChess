import React from "react"
import { useAppSelector } from "../../../hooks"
import { useAppDispatch } from "../../../hooks"
import { levelClick } from "../../../stores/NetworkStore"
import { Money } from "../icons/money"

export default function GameExperience() {
  const dispatch = useAppDispatch()
  
  const experienceManager = useAppSelector(
    (state) => state.game.experienceManager
  )
  const isLevelMax = experienceManager.level >= 9

  return (
    <div className="nes-container game-experience">
      <span>Lvl {experienceManager.level}</span>
      <button
        className="bubbly orange buy-xp-button"
        title="Buy 4 XP for 4 gold (shortcut: F)"
        onClick={() => { dispatch(levelClick()) }}
      >
        <Money value="Buy XP 4" />
      </button>
      <div className="progress-bar">
        <progress
          className="nes-progress"
          value={isLevelMax ? 0 : experienceManager.experience}
          max={experienceManager.expNeeded}
        ></progress>
        <span>{isLevelMax ? "Max Level" : experienceManager.experience + "/" + experienceManager.expNeeded}</span>
      </div>
    </div>
  )
}
