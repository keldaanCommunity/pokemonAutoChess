import React from "react"
import { useTranslation } from "react-i18next"
import { IGameUser } from "../../../../../models/colyseus-models/game-user"
import { Role } from "../../../../../types"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { kick, removeBot } from "../../../stores/NetworkStore"
import { RemoveButton } from "../buttons/remove-button"
import { EloBadge } from "../profile/elo-badge"
import { InlineAvatar } from "../profile/inline-avatar"
import "./preparation-menu-user.css"

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
        if (confirm(`Kick ${props.user.name} ?`)) {
          dispatch(kick(props.user.id))
        }
      }}
      title={t("kick_user")}
    />
  ) : null

  return (
    <div
      className={`my-container player my-box preparation-menu-user ${
        props.user.ready ? "ready" : "not-ready"
      }`}
    >
      <EloBadge elo={props.user?.elo} />
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
