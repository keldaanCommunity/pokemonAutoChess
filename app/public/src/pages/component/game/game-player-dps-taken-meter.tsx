import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { IDps } from "../../../../../types"
import GameDpsTaken from "./game-dps-taken"

export default function GamePlayerDpsTakenMeter({
  dpsMeter = []
}: { dpsMeter: IDps[] }) {
  const { t } = useTranslation()
  const sortedDamageTaken = useMemo(
    () =>
      [...dpsMeter].sort((a, b) => {
        return (
          b.hpDamageTaken +
          b.shieldDamageTaken -
          (a.hpDamageTaken + a.shieldDamageTaken)
        )
      }),
    [dpsMeter]
  )

  const maxDamageTaken = useMemo(() => {
    const firstDps = sortedDamageTaken.at(0)
    if (!firstDps) {
      return 0
    }
    return firstDps.hpDamageTaken + firstDps.shieldDamageTaken
  }, [sortedDamageTaken])

  const totalDamageTaken = useMemo(
    () =>
      sortedDamageTaken.reduce((acc, dps) => {
        acc += dps.hpDamageTaken + dps.shieldDamageTaken
        return acc
      }, 0),
    [sortedDamageTaken]
  )

  return (
    <div>
      {sortedDamageTaken.map((p) => {
        return (
          <GameDpsTaken key={p.id} dps={p} maxDamageTaken={maxDamageTaken} />
        )
      })}
      {sortedDamageTaken.length > 0 && (
        <div>
          {t("total")}: {totalDamageTaken}
        </div>
      )}
    </div>
  )
}
