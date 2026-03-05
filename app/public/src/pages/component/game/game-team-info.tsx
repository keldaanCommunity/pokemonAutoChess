import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { getMaxTeamSize } from "../../../../../utils/board"
import { selectSpectatedPlayer, useAppSelector } from "../../../hooks"

export function GameTeamInfo() {
  const { t } = useTranslation()
  const spectatedPlayer = useAppSelector(selectSpectatedPlayer)
  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)

  if (!spectatedPlayer) return null

  const maxTeamSize = getMaxTeamSize(
    spectatedPlayer.experienceManager.level,
    specialGameRule
  )

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
          <p className="help">{t("team_size_hint")}</p>
        </Tooltip>
        <span>
          {spectatedPlayer.boardSize}/{maxTeamSize}
        </span>
        <img className="icon" src="assets/ui/pokeball.svg" />
      </div>
    </div>
  )
}
