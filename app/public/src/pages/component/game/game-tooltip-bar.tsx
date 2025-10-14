import React from "react"
import { clamp } from "../../../../../utils/number"
import "./game-tooltip-bar.css"

interface GameTooltipBarProps {
  value: number
  maxValue: number
  extraValue?: number
  type: "HP" | "PP"
  graduationStep?: number
}

const BAR_COLORS = {
  HP: "linear-gradient(to bottom, #e76e55, #b84731)",
  PP: "linear-gradient(to bottom, #5f9ff9, #2e8fd0)",
  SHIELD: "linear-gradient(to bottom, #ffffff, #c0c0c0)"
}

export const GameTooltipBar: React.FC<GameTooltipBarProps> = ({
  value,
  maxValue,
  extraValue,
  type,
  graduationStep
}) => {
  const total = maxValue + (extraValue ?? 0)
  const percent = clamp(value / total, 0, 1)
  const extraPercent = extraValue ? clamp(extraValue / total, 0, 1) : 0
  const graduations: number[] = []
  if (graduationStep) {
    for (let i = graduationStep; i < maxValue; i += graduationStep) {
      graduations.push(i)
    }
  }

  return (
    <div className="game-tooltip-bar">
      <div className="game-tooltip-bar-text">
        {type}: {value} / {maxValue} {extraValue ? `(+${extraValue})` : ""}
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
            style={{ left: `${(g / maxValue) * 100}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export default GameTooltipBar
