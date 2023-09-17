import React from "react"
import { Role } from "../../../../types"
import { getAvatarSrc } from "../../utils"
import { RoleBadge } from "./RoleBadge"
import { useTranslation } from "react-i18next"

export default function InlineAvatar(props: {
  avatar: string
  name: string
  title?: string
  role?: Role
}) {
  const { t } = useTranslation()
  return (
    <div
      className="inline-avatar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        gap: "0.25em"
      }}
    >
      <img
        style={{ width: "40px", height: "40px" }}
        src={getAvatarSrc(props.avatar)}
        className="pokemon-portrait"
      />
      {props.title && (
        <span className="player-title">{t(`title.${props.title}`)}</span>
      )}
      <span className="player-name">
        {props.role === Role.BOT ? t(`pkm.${props.name}`) : props.name}
      </span>
      {props.role && <RoleBadge role={props.role} />}
    </div>
  )
}
