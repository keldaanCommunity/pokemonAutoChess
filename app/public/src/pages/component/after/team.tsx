import React from "react"
import { getAvatarSrc } from "../../../utils"
import "./team.css"

export default function Team(props: { team: string[] }) {
  return (
    <ul className="player-team">
      {props.team.map((v, index) => {
        return (
          <li key={index}>
            <img src={getAvatarSrc(v)} />
          </li>
        )
      })}
    </ul>
  )
}
