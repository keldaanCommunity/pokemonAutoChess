import React from "react"
import "./score-indicator.css"

const SCORES = {
  INCOMPLETE: { label: "Incomplete", color: "#999" },
  VERY_EASY: { label: "Very Easy", color: "#109fff" },
  EASY: { label: "Easy", color: "#92cc41" },
  MEDIUM: { label: "Medium", color: "yellow" },
  HARD: { label: "Hard", color: "#f7d51d" },
  VERY_HARD: { label: "Very Hard", color: "#e76e55" },
  ILLEGAL: { label: "Illegal", color: "#761c1e" }
}

export default function ScoreIndicator(props: { value: number }) {
  let score = SCORES.INCOMPLETE
  if (props.value < 10) score = SCORES.INCOMPLETE
  else if (props.value < 26) score = SCORES.VERY_EASY
  else if (props.value < 42) score = SCORES.EASY
  else if (props.value < 58) score = SCORES.MEDIUM
  else if (props.value < 74) score = SCORES.HARD
  else if (props.value < 90) score = SCORES.VERY_HARD
  else score = SCORES.ILLEGAL

  return (
    <div className="score-indicator">
      <div className="score-indicator-bars">
        <div
          style={{ width: "10%", backgroundColor: SCORES.INCOMPLETE.color }}
        ></div>
        <div
          style={{ width: "16%", backgroundColor: SCORES.VERY_EASY.color }}
        ></div>
        <div style={{ width: "16%", backgroundColor: SCORES.EASY.color }}></div>
        <div
          style={{ width: "16%", backgroundColor: SCORES.MEDIUM.color }}
        ></div>
        <div style={{ width: "16%", backgroundColor: SCORES.HARD.color }}></div>
        <div
          style={{ width: "16%", backgroundColor: SCORES.VERY_HARD.color }}
        ></div>
        <div
          style={{ width: "10%", backgroundColor: SCORES.ILLEGAL.color }}
        ></div>
        <div className="cursor" style={{ left: props.value + "%" }}></div>
      </div>
      <span style={{ color: score.color }}>{score.label}</span>
    </div>
  )
}
