import React from "react"
import ProgressBar from "react-bootstrap/ProgressBar"
import { IDps } from "../../../../../types"
import { getAvatarSrc } from "../../../utils"

export default function GameDps(props: { maxDamage: number; dps: IDps }) {
  return (
    <div className="game-dps-bar">
      <img className="pokemon-portrait" src={getAvatarSrc(props.dps.name)} />
      <div className="game-dps-progress-wrapper">
        <p>
          {props.dps.physicalDamage +
            props.dps.specialDamage +
            props.dps.trueDamage}
        </p>
        <ProgressBar className="nes-progress is-primary">
          <ProgressBar
            style={{ backgroundColor: "#e76e55" }}
            max={props.maxDamage}
            now={props.dps.physicalDamage}
            key="physical"
            title={props.dps.physicalDamage.toString()}
          />
          <ProgressBar
            style={{ backgroundColor: "#209cee" }}
            max={props.maxDamage}
            now={props.dps.specialDamage}
            key="special"
            title={props.dps.specialDamage.toString()}
          />
          <ProgressBar
            style={{ backgroundColor: "#f7d51d" }}
            max={props.maxDamage}
            now={props.dps.trueDamage}
            key="true"
            title={props.dps.trueDamage.toString()}
          />
        </ProgressBar>
      </div>
    </div>
  )
}
