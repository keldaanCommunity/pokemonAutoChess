import React, { useMemo } from "react"
import GameDpsHeal from "./game-dps-heal"
import { IDpsHeal } from "../../../../../types"

type GamePlayerHpsMeterInput = {
  hpsMeter: IDpsHeal[]
}

export default function GamePlayerHpsMeter({
  hpsMeter = []
}: GamePlayerHpsMeterInput) {
  const sortedHps = useMemo(
    () =>
      [...hpsMeter].sort((a, b) => {
        return b.shield + b.heal - (a.shield + a.heal)
      }),
    [hpsMeter]
  )

  const maxHealAmount = useMemo(() => {
    const topHeal = sortedHps.at(0)
    if (!topHeal) {
      return 0
    }
    return topHeal.shield + topHeal.heal
  }, [sortedHps])

  const totalHealAmount = useMemo(
    () =>
      sortedHps.reduce((acc, dps) => {
        acc += dps.shield + dps.heal
        return acc
      }, 0),
    [sortedHps]
  )

  return (
    <div>
      {sortedHps.map((p) => (
        <GameDpsHeal key={p.id} dpsHeal={p} maxHeal={maxHealAmount} />
      ))}
      {sortedHps.length > 0 && <div>Total: {totalHealAmount}</div>}
    </div>
  )
}
