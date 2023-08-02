import React from "react"
import { Role } from "../../../../types"
import { getAvatarSrc } from "../../utils"
import { RoleBadge } from "./RoleBadge"
import { t } from "i18next"

export default function InlineAvatar(props: {
  avatar: string
  name: string
  title?: string
  role?: Role
}) {
  return (
    <div
      className="inline-avatar"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "start"
      }}
    >
      <img
        style={{ width: "40px", height: "40px" }}
        src={getAvatarSrc(props.avatar)}
      />
      {props.title && (
        <span className="player-title">{t(`title.${props.title}`)}</span>
      )}
      <span
        style={{
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          padding: "0 0.5em"
        }}
      >
        {props.role === Role.BOT ? t(`pkm.${props.name}`) : props.name}
      </span>
      {props.role && <RoleBadge role={props.role} />}
    </div>
  )
}
