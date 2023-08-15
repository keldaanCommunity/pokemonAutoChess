import React from "react"
import { Tooltip } from "react-tooltip"
import { useAppSelector } from "../../../hooks"
import { useTranslation } from "react-i18next"

export function GameTeamInfo() {
  const { t } = useTranslation()
  const experienceManager = useAppSelector(
    (state) => state.game.currentPlayerExperienceManager
  )
  const boardSize = useAppSelector((state) => state.game.currentPlayerBoardSize)

  return (
    <div id="game-team-info" className="nes-container team-size information">
      <div data-tooltip-id="detail-team-size">
        <Tooltip id="detail-team-size" className="customeTheme" place="top">
          <p className="help">
            {t("place_up_to")} <output>{experienceManager.level}</output>{" "}
            {t("pokemons_on_your_board")}
          </p>
          <p className="help">{t("team_size_hint")}</p>
        </Tooltip>
        <span>
          {boardSize}/{experienceManager.level}
        </span>
        <img className="icon" src="assets/ui/pokeball.svg" />
      </div>
    </div>
  )
}
