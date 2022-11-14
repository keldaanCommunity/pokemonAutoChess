import React from "react"
import { getAvatarSrc } from "../../../utils"

const ulStyle = {
  listStyle: "none",
  display: "flex"
}

export default function Team(props: { team: string[] }) {
  return (
    <ul style={ulStyle}>
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
