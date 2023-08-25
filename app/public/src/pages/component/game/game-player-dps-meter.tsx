import React, { useMemo } from "react"
import GameDps from "./game-dps"
import { IDps } from "../../../../../types"

type GamePlayerDpsMeterInput = {
  dpsMeter: IDps[]
}

export default function GamePlayerDpsMeter({
  dpsMeter = []
}: GamePlayerDpsMeterInput) {
  const sortedDps = useMemo(
    () =>
      [...dpsMeter].sort((a, b) => {
        return (
          b.physicalDamage +
          b.specialDamage +
          b.trueDamage -
          (a.physicalDamage + a.specialDamage + a.trueDamage)
        )
      }),
    [dpsMeter]
  )

  const maxDamage = useMemo(() => {
    const firstDps = sortedDps.at(0)
    if (!firstDps) {
      return 0
    }
    return (
      firstDps.physicalDamage + firstDps.specialDamage + firstDps.trueDamage
    )
  }, [sortedDps])

  const totalDamage = useMemo(
    () =>
      sortedDps.reduce((acc, dps) => {
        acc += dps.physicalDamage + dps.specialDamage + dps.trueDamage
        return acc
      }, 0),
    [sortedDps]
  )

  return (
    <div>
      {sortedDps.map((p) => {
        return <GameDps key={p.id} dps={p} maxDamage={maxDamage} />
      })}
      {sortedDps.length > 0 && <div>Total: {totalDamage}</div>}
    </div>
  )
}
