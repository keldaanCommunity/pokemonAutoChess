import React from "react"
import { useAppSelector } from "../../../hooks"
import { Money } from "../icons/money"

export default function GameMoneyDetail() {
  const streak = useAppSelector((state) => state.game.streak)
  const interest = useAppSelector((state) => state.game.interest)
  return (
    <div>
      <p><Money value={`Streak: ${streak}`}/></p>
      <p><Money value={`Interest: ${interest}`}/></p>
    </div>
  )
}
