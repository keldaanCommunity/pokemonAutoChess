import React from "react"
import { IPokemonRecord } from "../../../../../models/colyseus-models/game-record"
import { getAvatarSrc } from "../../../utils"
import "./team.css"

export default function Team(props: { team: IPokemonRecord[] }) {
  return (
    <ul className="player-team">
      {props.team.map((v, index) => {
        return (
          <li key={index}>
            <img src={getAvatarSrc(v.avatar)} />
          </li>
        )
      })}
    </ul>
  )
}
