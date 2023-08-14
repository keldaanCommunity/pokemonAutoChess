import React from "react"
import ReactTooltip from "react-tooltip"
import { BattleResult } from "../../../../../types/enum/Game"
import { useAppSelector } from "../../../hooks"
import { Money } from "../icons/money"
import { useTranslation } from "react-i18next"

export function GameMoneyInfo() {
  const money = useAppSelector((state) => state.game.currentPlayerMoney)
  return (
    <div id="game-money-info" className="nes-container money information">
      <div data-tip data-for="detail-money">
        <ReactTooltip
          id="detail-money"
          className="customeTheme"
          effect="solid"
          place="top"
        >
          <GameMoneyDetail />
        </ReactTooltip>
        <Money value={money} />
      </div>
    </div>
  )
}

export function GameMoneyDetail() {
  const { t } = useTranslation()
  const streak = useAppSelector((state) => state.game.streak)
  const currentPlayer = useAppSelector((state) =>
    state.game.players.find((p) => p.id === state.game.currentPlayerId)
  )
  const lastPlayerBattle =
    currentPlayer && currentPlayer.history && currentPlayer.history.length > 0
      ? currentPlayer.history.filter((r) => !r.isPVE).at(-1)
      : null
  const lastBattleResult = lastPlayerBattle ? lastPlayerBattle.result : null
  const interest = useAppSelector((state) => state.game.interest)
  let streakLabel = "Draw"
  if (lastBattleResult === BattleResult.WIN) {
    streakLabel = `${streak + 1} victor${streak === 0 ? "y" : "ies"}`
  } else if (lastBattleResult === BattleResult.DEFEAT) {
    streakLabel = `${streak + 1} defeat${streak === 0 ? "" : "s"}`
  }

  return (
    <div className="game-money-detail">
      <p className="help">{t("passive_income_hint")}</p>
      <p>
        <Money value={`${t("streak")}: ${streak === 0 ? 0 : "+" + streak}`} />{" "}
        {lastBattleResult !== null && `(${streakLabel})`}
      </p>
      <p className="help">{t("victory_income_hint")}</p>
      <p>
        <Money value={`${t("interest")}: +${interest}`} />
      </p>
      <p className="help">{t("additional_income_hint")}</p>
    </div>
  )
}
