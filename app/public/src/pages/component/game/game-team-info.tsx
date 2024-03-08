import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { getMaxTeamSize } from "../../../../../utils/board"
import { useAppSelector } from "../../../hooks"
import { getGameScene } from "../../game"

export function GameTeamInfo() {
  const { t } = useTranslation()
  const experienceManager = useAppSelector(
    (state) => state.game.currentPlayerExperienceManager
  )
  const boardSize = useAppSelector((state) => state.game.currentPlayerBoardSize)
  const specialGameRule = getGameScene()?.room?.state.specialGameRule
  const maxTeamSize = getMaxTeamSize(experienceManager.level, specialGameRule)

  return (
    <div id="game-team-info" className="nes-container team-size information">
      <div data-tooltip-id="detail-team-size">
        <Tooltip
          id="detail-team-size"
          className="custom-theme-tooltip"
          place="top"
        >
          <p className="help">
            {t("place_up_to")} <output>{maxTeamSize}</output>{" "}
            {t("pokemons_on_your_board")}
          </p>
          {specialGameRule !== SpecialGameRule.SIX_PACK && (
            <p className="help">{t("team_size_hint")}</p>
          )}
        </Tooltip>
        <span>
          {boardSize}/{maxTeamSize}
        </span>
        <img className="icon" src="assets/ui/pokeball.svg" />
      </div>
    </div>
  )
}
