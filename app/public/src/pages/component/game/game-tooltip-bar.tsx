import React from "react"
import { useTranslation } from "react-i18next"
import { clamp } from "../../../../../utils/number"
import "./game-tooltip-bar.css"

type BarType = "HP_ALLY" | "HP_ENEMY" | "PP" | "XP"

interface GameTooltipBarProps {
  value: number | undefined
  maxValue: number
  extraValue?: number
  type: BarType
  graduationStep?: number
}

const BAR_COLORS: Record<BarType | "SHIELD", string> = {
  HP_ALLY: "#97db4a",
  HP_ENEMY: "#e76e55",
  PP: "#5f9ff9",
  XP: "#eeeeee",
  SHIELD: "linear-gradient(to bottom, #ffffff, #c0c0c0)"
}

const BAR_LABELS: Record<BarType, string> = {
  HP_ALLY: "stat.HP",
  HP_ENEMY: "stat.HP",
  PP: "stat.PP",
  XP: ""
}

export const GameTooltipBar: React.FC<GameTooltipBarProps> = ({
  value,
  maxValue,
  extraValue,
  type,
  graduationStep
}) => {
  const { t } = useTranslation()
  const total = maxValue + (extraValue ?? 0)
  const percent = value === undefined ? 100 : clamp(value / total, 0, 1)
  const extraPercent = extraValue ? clamp(extraValue / total, 0, 1) : 0
  const graduations: number[] = []
  if (graduationStep) {
    for (let i = graduationStep; i < total; i += graduationStep) {
      graduations.push(i)
    }
  }

  return (
    <div className="game-tooltip-bar">
      <div className="game-tooltip-bar-text">
        {BAR_LABELS[type] ? t(BAR_LABELS[type]) : ""}
        {BAR_LABELS[type] ? ": " : ""}
        {value === undefined ? maxValue : `${value} / ${maxValue}`}{" "}
        {extraValue ? `(+${extraValue})` : ""}
      </div>
      <div className="game-tooltip-bar-outer">
        <div
          className="game-tooltip-bar-inner"
          style={{
            width: `${percent * 100}%`,
            background: BAR_COLORS[type]
          }}
        />
        {extraValue != null && (
          <div
            className="game-tooltip-bar-inner extra"
            style={{
              width: `${extraPercent * 100}%`,
              background: BAR_COLORS.SHIELD
            }}
          />
        )}
        {graduations.map((g) => (
          <div
            key={g}
            className="game-tooltip-bar-graduation"
            style={{ left: `${(g / total) * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export default GameTooltipBar
