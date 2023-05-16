import React from "react"
import Elo from "./elo"
import { Role, TitleName } from "../../../../types"
import { RoleBadge } from "./RoleBadge"
import { getAvatarSrc } from "../../utils"

export default function Avatar(props: {
  elo: number | undefined
  name: string
  avatar: string
  title: string
  role: Role
}) {
  const elo = props.elo ? <Elo elo={props.elo} /> : null

  return (
    <div
      className="player-box"
      style={{
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexFlow: "column"
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "5px",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "100%"
        }}
      >
        <img
          style={{ width: "40px", height: "40px" }}
          className="pokemon-portrait"
          src={getAvatarSrc(props.avatar)}
        />

        <span style={{ overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", padding: "0 0.5em" }}>
          {props.name}
        </span>
        <RoleBadge role={props.role} />
      </div>
      <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
        <p className="player-title" style={{ margin: "0px" }}>
          {TitleName[props.title]}
        </p>
        {elo}
      </div>
    </div>
  )
}
