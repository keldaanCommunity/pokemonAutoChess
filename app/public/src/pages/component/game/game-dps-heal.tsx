import React from "react"
import ProgressBar from "react-bootstrap/ProgressBar"
import { IDpsHeal } from "../../../../../types"
import { getAvatarSrc } from "../../../utils"

export default function GameDpsHeal(props: {
  maxHeal: number
  dpsHeal: IDpsHeal
}) {
  return (
    <div className="game-dps-bar">
      <img
        className="pokemon-portrait"
        src={getAvatarSrc(props.dpsHeal.name)}
      />
      <div className="game-dps-progress-wrapper">
        <p>{props.dpsHeal.heal + props.dpsHeal.shield}</p>
        <ProgressBar className="nes-progress is-primary">
          <ProgressBar
            style={{ backgroundColor: "#92cc41" }}
            max={props.maxHeal}
            now={props.dpsHeal.heal}
            key="heal"
          />
          <ProgressBar
            style={{ backgroundColor: "#8d8d8d" }}
            max={props.maxHeal}
            now={props.dpsHeal.shield}
            key="shield"
          />
        </ProgressBar>
      </div>
    </div>
  )
}
