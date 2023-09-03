import React from "react"
import { BOT_SCORES, getBotScore } from "./bot-logic"
import "./score-indicator.css"

export default function ScoreIndicator(props: { value: number }) {
  let score = getBotScore(props.value)

  return (
    <div className="score-indicator">
      <div className="score-indicator-bars">
        <div
          style={{ width: "10%", backgroundColor: BOT_SCORES.INCOMPLETE.color }}
        ></div>
        <div
          style={{ width: "16%", backgroundColor: BOT_SCORES.VERY_EASY.color }}
        ></div>
        <div
          style={{ width: "16%", backgroundColor: BOT_SCORES.EASY.color }}
        ></div>
        <div
          style={{ width: "16%", backgroundColor: BOT_SCORES.MEDIUM.color }}
        ></div>
        <div
          style={{ width: "16%", backgroundColor: BOT_SCORES.HARD.color }}
        ></div>
        <div
          style={{ width: "16%", backgroundColor: BOT_SCORES.VERY_HARD.color }}
        ></div>
        <div
          style={{ width: "10%", backgroundColor: BOT_SCORES.ILLEGAL.color }}
        ></div>
        <div className="cursor" style={{ left: props.value + "%" }}></div>
      </div>
      <span style={{ color: score.color }}>{score.label}</span>
    </div>
  )
}
