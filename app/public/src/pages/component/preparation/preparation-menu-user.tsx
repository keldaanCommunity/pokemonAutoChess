import React from "react"
import { IGameUser } from "../../../../../models/colyseus-models/game-user"
import { Role } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { kick, removeBot } from "../../../stores/NetworkStore"
import { RemoveButton } from "../buttons/remove-button"
import Elo from "../elo"
import InlineAvatar from "../inline-avatar"
import "./preparation-menu-user.css"
import { useTranslation } from "react-i18next"

export default function PreparationMenuUser(props: {
  key: string
  user: IGameUser
  isOwner: boolean
  ownerId: string
}) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.preparation.user)
  const canKick =
    props.isOwner || (user && [Role.MODERATOR, Role.ADMIN].includes(user.role))

  const removeButton = props.user.isBot ? (
    <RemoveButton
      onClick={() => {
        dispatch(removeBot(props.user.id))
      }}
      title={t("remove_bot")}
    />
  ) : canKick && props.user.id !== user?.id ? (
    <RemoveButton
      onClick={() => {
        dispatch(kick(props.user.id))
      }}
      title={t("kick_user")}
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
