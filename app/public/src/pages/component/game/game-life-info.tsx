import React from "react"
import { Tooltip } from "react-tooltip"
import { useAppSelector } from "../../../hooks"
import { Life } from "../icons/life"
import { useTranslation } from "react-i18next"

export function GameLifeInfo() {
  const { t } = useTranslation()
  const life = useAppSelector((state) => state.game.currentPlayerLife)
  return (
    <div id="game-life-info" className="nes-container life information">
      <div data-tooltip-id="detail-life">
        <Tooltip id="detail-life" className="custom-theme-tooltip" place="top">
          <p className="help">{t("lose_game_hint")}</p>
        </Tooltip>
        <Life value={life} />
      </div>
    </div>
  )
}
