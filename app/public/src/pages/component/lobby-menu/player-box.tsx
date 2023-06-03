import React from "react"
import { ILobbyUser } from "../../../../../models/colyseus-models/lobby-user"
import { TitleName } from "../../../../../types/strings/Title"
import { getAvatarSrc } from "../../../utils"
import Elo from "../elo"
import { RoleBadge } from "../RoleBadge"

export default function PlayerBox(props: { user: ILobbyUser }) {
  return (
    <div className="player-box" style={{ marginBottom: "1em" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5em" }}>
          <img
            src={getAvatarSrc(props.user.avatar)}
            className="pokemon-portrait"
          />
          <p className="player-title">{TitleName[props.user.title]}</p>
          <RoleBadge role={props.user.role} />
          <p
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }}
          >
            {props.user.name}
          </p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Elo elo={props.user.elo} />
        </div>
        <p>
          Level {props.user.level} ({props.user.exp} / 1000)
        </p>
        <p>Wins: {props.user.wins}</p>
      </div>
      <p style={{ color: "gray", fontSize: "60%"}}>User ID: {props.user.id}</p>
    </div>
  )
}
