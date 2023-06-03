import React from "react"
import ReactTooltip from "react-tooltip"
import { BattleResult } from "../../../../../types/enum/Game"
import { useAppSelector } from "../../../hooks"
import { Money } from "../icons/money"

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
      <p className="help">
        Each stage, gain 5 gold + 1 extra gold if you won the previous battle.
      </p>
      <p>
        <Money value={`Streak: ${streak === 0 ? 0 : "+" + streak}`} />{" "}
        {lastBattleResult !== null && `(${streakLabel})`}
      </p>
      <p className="help">
        Gain 1 bonus gold for every victory or defeat streak, up to 5 bonus
        gold.
      </p>
      <p>
        <Money value={`Interest: +${interest}`} />
      </p>
      <p className="help">
        Gain 1 bonus gold per 10 gold saved, up to 5 bonus income at 50 saved
        gold.
      </p>
    </div>
  )
}
