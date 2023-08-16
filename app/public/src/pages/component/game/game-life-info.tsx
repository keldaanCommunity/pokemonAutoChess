import React from "react"
import ReactTooltip from "react-tooltip"
import { useAppSelector } from "../../../hooks"
import { Life } from "../icons/life"
import { useTranslation } from "react-i18next"

export function GameLifeInfo() {
  const { t } = useTranslation()
  const life = useAppSelector((state) => state.game.currentPlayerLife)
  return (
    <div id="game-life-info" className="nes-container life information">
      <div data-tip data-for="detail-life">
        <ReactTooltip id="detail-life" className="customeTheme" place="top">
          <p className="help">{t("lose_game_hint")}</p>
        </ReactTooltip>
        <Life value={life} />
      </div>
    </div>
  )
}
