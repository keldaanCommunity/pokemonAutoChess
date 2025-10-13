import React from "react"
import "./game-tooltip-bar.css"

interface GameTooltipBarProps {
  value: number
  maxValue: number
  type: "HP" | "PP"
  graduationStep?: number
}

const BAR_COLORS = {
  HP: "#e76e55",
  PP: "#209cee"
}

export const GameTooltipBar: React.FC<GameTooltipBarProps> = ({
  value,
  maxValue,
  type,
  graduationStep
}) => {
  const percent = Math.max(0, Math.min(1, value / maxValue))
  const graduations: number[] = []
  if (graduationStep) {
    for (let i = graduationStep; i < maxValue; i += graduationStep) {
      graduations.push(i)
    }
  }

  return (
    <div className="game-tooltip-bar">
      <div className="game-tooltip-bar-text">
        {type}: {value} / {maxValue}
      </div>
      <div className="game-tooltip-bar-outer">
        <div
          className="game-tooltip-bar-inner"
          style={{
            width: `${percent * 100}%`,
            background: BAR_COLORS[type]
          }}
        />
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
