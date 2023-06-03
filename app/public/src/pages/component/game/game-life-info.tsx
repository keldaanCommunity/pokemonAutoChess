import React from "react"
import ReactTooltip from "react-tooltip"
import { useAppSelector } from "../../../hooks"
import { Life } from "../icons/life"

export function GameLifeInfo() {
  const life = useAppSelector((state) => state.game.currentPlayerLife)
  return (
    <div id="game-life-info" className="nes-container life information">
      <div data-tip data-for="detail-life">
        <ReactTooltip
          id="detail-life"
          className="customeTheme"
          effect="solid"
          place="top"
        >
          <p className="help">You lose the game when you have no more Health Points</p>
        </ReactTooltip>
        <Life value={life} />
      </div>
    </div>
  )
}
