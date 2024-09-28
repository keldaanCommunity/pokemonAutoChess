import React from "react"
import { useTranslation } from "../../../../../../node_modules/react-i18next"
import { Tooltip } from "react-tooltip"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { getMaxTeamSize } from "../../../../../utils/board"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { getGameScene } from "../../game"

export function GameTeamInfo() {
  const { t } = useTranslation()
  const currentPlayer = useAppSelector(selectCurrentPlayer)

  if (!currentPlayer) return null

  const specialGameRule = getGameScene()?.room?.state.specialGameRule
  const maxTeamSize = getMaxTeamSize(currentPlayer.experienceManager.level, specialGameRule)

  return (
    <div id="game-team-info" className="my-container team-size information">
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
          {currentPlayer.boardSize}/{maxTeamSize}
        </span>
        <img className="icon" src="assets/ui/pokeball.svg" />
      </div>
    </div>
  )
}
