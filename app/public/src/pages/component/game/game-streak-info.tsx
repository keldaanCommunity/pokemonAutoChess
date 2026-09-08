import { useTranslation } from "react-i18next"
import { Tooltip } from "react-tooltip"
import { BattleResult } from "../../../../../types/enum/Game"
import { selectSpectatedPlayer, useAppSelector } from "../../../hooks"
import "./game-streak-info.css"

export function GameStreakInfo(props: { variant?: "shop" | "inline" }) {
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

  const isWin = lastBattleResult === BattleResult.WIN
  const streakIcon = isWin
    ? "/assets/ui/streak_win.png"
    : "/assets/ui/streak_defeat.png"
  const streakBackgroundIcon = isWin
    ? "/assets/ui/streak_win-bg.png"
    : "/assets/ui/streak_defeat-bg.png"
  const streakAlt = isWin ? "Victory streak" : "Defeat streak"
  const variant = props.variant ?? "inline"

  if (variant === "shop") {
    return (
      <div
        id="game-streak-info"
        className="my-container information"
        style={{
          backgroundImage: `url("${streakBackgroundIcon}")`
        }}
      >
        <div data-tooltip-id="detail-streak">
          <Tooltip
            id="detail-streak"
            className="custom-theme-tooltip"
            place="top"
          >
            <p className="help">{`${t("streak")}: ${streakLabel}`}</p>
          </Tooltip>
          <span className="streak-count">{streak + 1}</span>
          <img className="icon-streak" src={streakIcon} alt={streakAlt} />
        </div>
      </div>
    )
  }

  return (
    <span data-tooltip-id="detail-streak" className="streak-inline">
      <Tooltip id="detail-streak" className="custom-theme-tooltip" place="top">
        <p className="help">{`${t("streak")}: ${streakLabel}`}</p>
      </Tooltip>
      <span className="streak-count">{streak + 1}</span>
      <img className="icon-streak" src={streakIcon} alt={streakAlt} />
    </span>
  )
}
