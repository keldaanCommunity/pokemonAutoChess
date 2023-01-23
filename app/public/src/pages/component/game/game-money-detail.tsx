import React from "react"
import { useAppSelector } from "../../../hooks"
import { Money } from "../icons/money"
import "./game-money-detail.css";

export default function GameMoneyDetail() {
  const streak = useAppSelector((state) => state.game.streak)
  const interest = useAppSelector((state) => state.game.interest)
  return (
    <div className="game-money-detail">
      <p className="help">Each turn, gain 5 gold + 1 extra gold if you won the battle.</p>
      <p><Money value={`Streak: +${streak}`}/></p>
      <p className="help">Get 1 bonus gold for every victory or defeat streak, up to 5 bonus gold.</p>
      <p><Money value={`Interest: +${interest}`}/></p>
      <p className="help">Get 1 bonus gold per 10 gold saved, up to 5 bonus income at 50 saved gold.</p>
    </div>
  )
}
