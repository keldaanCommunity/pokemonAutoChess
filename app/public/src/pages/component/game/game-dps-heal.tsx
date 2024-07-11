import React from "react"
import ProgressBar from "react-bootstrap/ProgressBar"
import { IDps } from "../../../../../types"
import { getAvatarSrc } from "../../../utils"

export default function GameDpsHeal(props: {
  maxHeal: number
  dpsMeter: IDps
}) {
  return (
    <div className="game-dps-bar">
      <img
        className="pokemon-portrait"
        src={getAvatarSrc(props.dpsMeter.name)}
      />
      <div className="game-dps-progress-wrapper">
        <p>{props.dpsMeter.heal + props.dpsMeter.shield}</p>
        <ProgressBar className="my-progress is-primary">
          <ProgressBar
            style={{ backgroundColor: "#76c442" }}
            max={props.maxHeal}
            now={props.dpsMeter.heal}
            key="heal"
          />
          <ProgressBar
            style={{ backgroundColor: "#8d8d8d" }}
            max={props.maxHeal}
            now={props.dpsMeter.shield}
            key="shield"
          />
        </ProgressBar>
      </div>
    </div>
  )
}
