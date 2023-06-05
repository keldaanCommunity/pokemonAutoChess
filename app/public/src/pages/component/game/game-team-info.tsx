import React from "react"
import ReactTooltip from "react-tooltip"
import { useAppSelector } from "../../../hooks"

export function GameTeamInfo() {
  const experienceManager = useAppSelector(
    (state) => state.game.currentPlayerExperienceManager
  )
  const boardSize = useAppSelector((state) => state.game.currentPlayerBoardSize)

  return (
    <div id="game-team-info" className="nes-container team-size information">
      <div data-tip data-for="detail-team-size">
        <ReactTooltip
          id="detail-team-size"
          className="customeTheme"
          effect="solid"
          place="top"
        >
          <p className="help">
            Place up to <output>{experienceManager.level}</output> pokemons on
            your board.
          </p>
          <p className="help">Increase your team size by leveling up</p>
        </ReactTooltip>
        <span>
          {boardSize}/{experienceManager.level}
        </span>
        <img className="icon" src="assets/ui/pokeball.svg" />
      </div>
    </div>
  )
}
