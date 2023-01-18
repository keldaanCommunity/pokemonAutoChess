import React from "react"
import { useAppSelector } from "../../../hooks"
import { Money } from "../icons/money"

export default function GameMoneyDetail() {
  const streak = useAppSelector((state) => state.game.streak)
  const interest = useAppSelector((state) => state.game.interest)
  return (
    <div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Streak: </p>
          <div>
            {streak}
            <Money />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Interest: </p>
          <div>
            {interest}
            <Money />
          </div>
        </div>
      </div>
    </div>
  )
}
