import React, { useMemo } from "react"
import { useTranslation } from "../../../../../../node_modules/react-i18next"
import { IDps } from "../../../../../types"
import GameDpsHeal from "./game-dps-heal"

export default function GamePlayerHpsMeter({
  dpsMeter = []
}: { dpsMeter: IDps[] }) {
  const { t } = useTranslation()
  const sortedHps = useMemo(
    () =>
      [...dpsMeter].sort((a, b) => {
        return b.shield + b.heal - (a.shield + a.heal)
      }),
    [dpsMeter]
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
        <GameDpsHeal key={p.id} dpsMeter={p} maxHeal={maxHealAmount} />
      ))}
      {sortedHps.length > 0 && (
        <div>
          {t("total")}: {totalHealAmount}
        </div>
      )}
    </div>
  )
}
