import React from "react"
import { useTranslation } from "../../../../../../node_modules/react-i18next"
import { Tooltip } from "react-tooltip"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { Life } from "../icons/life"

export function GameLifeInfo() {
  const { t } = useTranslation()
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  if (!currentPlayer) return null
  return (
    <div id="game-life-info" className="my-container life information">
      <div data-tooltip-id="detail-life">
        <Tooltip id="detail-life" className="custom-theme-tooltip" place="top">
          <p className="help">{t("lose_game_hint")}</p>
        </Tooltip>
        <Life value={currentPlayer.life} />
      </div>
    </div>
  )
}
