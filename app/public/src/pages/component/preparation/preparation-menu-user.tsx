import React from "react"
import { IGameUser } from "../../../../../models/colyseus-models/game-user"
import { useAppDispatch } from "../../../hooks"
import { kick, removeBot } from "../../../stores/NetworkStore"
import { RemoveButton } from "../buttons/remove-button"
import Elo from "../elo"
import InlineAvatar from "../inline-avatar"
import "./preparation-menu-user.css"

export default function PreparationMenuUser(props: {
  key: string
  user: IGameUser
  isOwner: boolean
  ownerId: string
}) {
  const dispatch = useAppDispatch()

  const removeButton = props.user.isBot ? (
    <RemoveButton
      onClick={() => {
        dispatch(removeBot(props.user.id))
      }}
      title="Remove Bot"
    />
  ) : props.isOwner && props.user.id !== props.ownerId ? (
    <RemoveButton
      onClick={() => {
        dispatch(kick(props.user.id))
      }}
      title="Kick User"
    />
  ) : null

  return (
    <div
      className={`nes-container player-box preparation-menu-user ${
        props.user.ready ? "ready" : "not-ready"
      }`}
    >
      <Elo elo={props.user?.elo} />
      <InlineAvatar
        avatar={props.user?.avatar}
        name={props.user?.name}
        title={props.user?.title}
        role={props.user?.role}
      />
      {removeButton}
    </div>
  )
}
