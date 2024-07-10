import React from "react"
import ProgressBar from "react-bootstrap/ProgressBar"
import { IDps } from "../../../../../types"
import { getAvatarSrc } from "../../../utils"

export default function GameDpsTaken(props: {
  maxDamageTaken: number
  dps: IDps
}) {
  return (
    <div className="game-dps-bar">
      <img className="pokemon-portrait" src={getAvatarSrc(props.dps.name)} />
      <div className="game-dps-progress-wrapper">
        <p>{props.dps.hpDamageTaken + props.dps.shieldDamageTaken}</p>
        <ProgressBar className="my-progress is-primary">
          <ProgressBar
            style={{ backgroundColor: "#76c442" }}
            max={props.maxDamageTaken}
            now={props.dps.hpDamageTaken}
            key="hp"
            title={props.dps.hpDamageTaken.toString()}
          />
          <ProgressBar
            style={{ backgroundColor: "#8d8d8d" }}
            max={props.maxDamageTaken}
            now={props.dps.shieldDamageTaken}
            key="shield"
            title={props.dps.shieldDamageTaken.toString()}
          />
        </ProgressBar>
      </div>
    </div>
  )
}
