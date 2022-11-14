import React from "react"
import { useAppSelector } from "../../../hooks"
import GameDpsHeal from "./game-dps-heal"

export default function GameRedHealDpsMeter() {
  const redHealDpsMeter = useAppSelector((state) => state.game.redHealDpsMeter)
  if (redHealDpsMeter.length > 0) {
    const redHealSortedArray = [...redHealDpsMeter].sort((a, b) => {
      return b.shield + b.heal - (a.shield + a.heal)
    })
    const redHealMaxDamage =
      redHealSortedArray[0].shield + redHealSortedArray[0].heal
    return (
      <div>
        {redHealSortedArray.map((p) => {
          return (
            <GameDpsHeal key={p.id} dpsHeal={p} maxHeal={redHealMaxDamage} />
          )
        })}
      </div>
    )
  } else {
    return null
  }
}
