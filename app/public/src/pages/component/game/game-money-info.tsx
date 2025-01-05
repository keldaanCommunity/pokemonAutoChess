import React from "react"
import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { BattleResult } from "../../../../../types/enum/Game"
import { SpecialGameRule } from "../../../../../types/enum/SpecialGameRule"
import { max } from "../../../../../utils/number"
import { selectCurrentPlayer, useAppSelector } from "../../../hooks"
import { addIconsToDescription } from "../../utils/descriptions"
import { Money } from "../icons/money"

export function GameMoneyInfo() {
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  if (!currentPlayer) return null
  return (
    <div id="game-money-info" className="my-container money information">
      <div data-tooltip-id="detail-money">
        <Tooltip id="detail-money" className="custom-theme-tooltip" place="top">
          <GameMoneyDetail />
        </Tooltip>
        <Money value={currentPlayer.money} />
      </div>
    </div>
  )
}

export function GameMoneyDetail() {
  const { t } = useTranslation()
  const streak = useAppSelector((state) => state.game.streak)
  const specialGameRule = useAppSelector((state) => state.game.specialGameRule)
  const currentPlayer = useAppSelector(selectCurrentPlayer)
  const lastPlayerBattle =
    currentPlayer && currentPlayer.history && currentPlayer.history.length > 0
      ? currentPlayer.history.filter((r) => r.id !== "pve").at(-1)
      : null
  const lastBattleResult = lastPlayerBattle ? lastPlayerBattle.result : null
  const interest = useAppSelector((state) => state.game.interest)
  let streakLabel = "Draw"
  if (lastBattleResult === BattleResult.WIN) {
    streakLabel = t("victory_count", { count: streak + 1 })
  } else if (lastBattleResult === BattleResult.DEFEAT) {
    streakLabel = t("defeat_count", { count: streak + 1 })
  }

  return (
    <div className="game-money-detail">
      <p className="help">{addIconsToDescription(t("passive_income_hint"))}</p>
      <p style={{ marginTop: "0.5em" }}>
        <Money
          value={`${t("streak")}: ${streak === 0 ? 0 : "+" + max(5)(streak)}`}
        />{" "}
        {lastBattleResult !== null && `(${streakLabel})`}
      </p>
      <p className="help">{addIconsToDescription(t("victory_income_hint"))}</p>
      {specialGameRule !== SpecialGameRule.BLOOD_MONEY && <>
        <p style={{ marginTop: "0.5em" }}>
          <Money value={`${t("interest")}: +${interest}`} />
        </p>
        <p className="help">
          {addIconsToDescription(t("additional_income_hint"))}
        </p>
      </>}
    </div>
  )
}
