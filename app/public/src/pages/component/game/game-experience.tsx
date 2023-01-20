import React from "react"
import CSS from "csstype"
import { useAppSelector } from "../../../hooks"
import { useAppDispatch } from "../../../hooks"
import { levelClick } from "../../../stores/NetworkStore"
import { Money } from "../icons/money"

export default function GameExperience() {
  const dispatch = useAppDispatch()
  
  const experienceManager = useAppSelector(
    (state) => state.game.experienceManager
  )

  let progressString = ""
  if (Number(experienceManager.expNeeded) == -1) {
    progressString = "Max Level"
  } else {
    progressString = experienceManager.experience + "/" + experienceManager.expNeeded
  }

  return (
    <div className="nes-container game-experience">
      <span>Lvl {experienceManager.level}</span>
      <button
        className="bubbly orange buy-xp-button"
        onClick={() => { dispatch(levelClick()) }}
      >
        <Money value="Buy XP 4" />
      </button>
      <div className="progress-bar">
        <progress
          className="nes-progress"
          value={experienceManager.experience}
          max={experienceManager.expNeeded}
        ></progress>
        <span>{progressString}</span>
      </div>
    </div>
  )
}
