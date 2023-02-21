import React from "react"
import { BattleResult } from "../../../../../types/enum/Game"
import { useAppSelector } from "../../../hooks"
import { Money } from "../icons/money"

export default function GameMoneyDetail() {
  const streak = useAppSelector((state) => state.game.streak)
  const currentPlayer = useAppSelector(state => state.game.players.find(p => p.id === state.game.currentPlayerId))  
  const lastPlayerBattle = currentPlayer && currentPlayer.history && currentPlayer.history.length > 0 ? currentPlayer.history.filter(r => !r.isPVE).at(-1) : null
  const lastBattleResult = lastPlayerBattle ? lastPlayerBattle.result : null
  const interest = useAppSelector((state) => state.game.interest)
  return (
    <div className="game-money-detail">
      <p className="help">Each stage, gain 5 gold + 1 extra gold if you won the previous battle.</p>
      <p><Money value={`Streak: +${streak}`}/> {lastBattleResult !== null && `(${streak+1} ${lastBattleResult === BattleResult.WIN ? `victor${streak===0?'y':'ies'}` : `defeat${streak===0?'':'s'}`})`}</p>
      <p className="help">Gain 1 bonus gold for every victory or defeat streak, up to 5 bonus gold.</p>
      <p><Money value={`Interest: +${interest}`}/></p>
      <p className="help">Gain 1 bonus gold per 10 gold saved, up to 5 bonus income at 50 saved gold.</p>
    </div>
  )
}
