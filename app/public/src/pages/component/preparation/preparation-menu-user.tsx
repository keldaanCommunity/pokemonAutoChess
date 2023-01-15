import React from "react"
import { IGameUser } from "../../../../../models/colyseus-models/game-user"
import userMetadata from "../../../../../models/mongo-models/user-metadata"
import { useAppDispatch } from "../../../hooks"
import { kick, removeBot } from "../../../stores/NetworkStore"
import Elo from "../elo"
import InlineAvatar from "../inline-avatar"

const buttonStyle = {
  marginLeft: "10px",
  marginRight: "10px"
}

export default function PreparationMenuUser(props: {
  key: string
  user: IGameUser
  isOwner: boolean
  ownerId: string
}) {
  const dispatch = useAppDispatch()
  const readyColor = props.user.ready ? "#76c442" : "#ce372b"

  const removeButton = props.user.isBot ? (
    <button
      style={buttonStyle}
      className="bubbly red"
      onClick={() => {
        dispatch(removeBot(props.user.id))
      }}
    >
      <p style={{ fontSize: "0.5em", margin: "0px" }}>X</p>
    </button>
  ) : props.isOwner && props.user.id !== props.ownerId ? (
    <button
      style={buttonStyle}
      className="bubbly red"
      onClick={() => {
        dispatch(kick(props.user.id))
      }}
    >
      <p style={{ fontSize: "0.5em", margin: "0px" }}>X</p>
    </button>
  ) : null

  return (
    <div
      className="nes-container player-box"
      style={{
        width: "40%",
        display: "flex",
        padding: "5px",
        margin: "5px",
        borderColor: readyColor,
        justifyContent: "space-between"
      }}
    >
      <div style={{ display: "flex", gap: "5px" }}>
        <Elo elo={props.user?.elo} />
        <InlineAvatar
          avatar={props.user?.avatar}
          name={props.user?.name}
          title={props.user?.title}
          role={props.user?.role}
        />
      </div>
      {removeButton}
    </div>
  )
}
