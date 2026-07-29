import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { BattleResult } from "../../../../../types/enum/Game"
import { selectSpectatedPlayer, useAppSelector } from "../../../hooks"

export function GameStreakInfo() {
  const { t } = useTranslation()
  const currentPlayer = useAppSelector(selectSpectatedPlayer)
  if (!currentPlayer) return null

  const streak = currentPlayer.streak
  const lastPlayerBattle =
    currentPlayer && currentPlayer.history && currentPlayer.history.length > 0
      ? currentPlayer.history.filter((r) => r.id !== "pve").at(-1)
      : null
  const lastBattleResult = lastPlayerBattle ? lastPlayerBattle.result : null
  let streakLabel = "Draw"
  if (lastBattleResult === BattleResult.WIN) {
    streakLabel = t("victory_count", { count: streak + 1 })
  } else if (lastBattleResult === BattleResult.DEFEAT) {
    streakLabel = t("defeat_count", { count: streak + 1 })
  }

  if (!lastBattleResult) return null

  return (
    <div id="game-streak-info" className="streak">
      <div
        data-tooltip-id="detail-streak"
        className={`streak-${lastBattleResult.toLowerCase()}`}
      >
        <Tooltip
          id="detail-streak"
          className="custom-theme-tooltip"
          place="top"
        >
          <p className="help">{`${t("streak")}: ${streakLabel}`}</p>
        </Tooltip>
        {streak + 1}
      </div>
    </div>
  )
}
