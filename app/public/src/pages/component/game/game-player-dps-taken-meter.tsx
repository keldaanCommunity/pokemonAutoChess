import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { BOARD_EFFECT_DPS_IDS, type IDps } from "../../../../../types"
import GameDpsTaken from "./game-dps-taken"

export default function GamePlayerDpsTakenMeter({
  dpsMeter = []
}: {
  dpsMeter: IDps[]
}) {
  const { t } = useTranslation()
  const sortedDamageTaken = useMemo(
    () =>
      // board effects are not units on the board, so they never take damage
      dpsMeter
        .filter((d) => !BOARD_EFFECT_DPS_IDS.has(d.id))
        .sort((a, b) => {
          return (
            b.physicalDamageReduced +
            b.specialDamageReduced +
            b.shieldDamageTaken -
            (a.physicalDamageReduced +
              a.specialDamageReduced +
              a.shieldDamageTaken)
          )
        }),
    [dpsMeter]
  )

  const maxDamageTaken = useMemo(() => {
    const firstDps = sortedDamageTaken.at(0)
    if (!firstDps) {
      return 0
    }
    return (
      firstDps.physicalDamageReduced +
      firstDps.specialDamageReduced +
      firstDps.shieldDamageTaken
    )
  }, [sortedDamageTaken])

  const totalDamageTaken = useMemo(
    () =>
      sortedDamageTaken.reduce((acc, dps) => {
        acc +=
          dps.physicalDamageReduced +
          dps.specialDamageReduced +
          dps.shieldDamageTaken
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
