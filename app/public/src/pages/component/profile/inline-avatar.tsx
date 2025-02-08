import React from "react"
import { useTranslation } from "react-i18next"
import { Role } from "../../../../../types"
import { getAvatarSrc } from "../../../../../utils/avatar"
import { RoleBadge } from "./role-badge"
import PokemonPortrait from "../pokemon-portrait"

export function InlineAvatar(props: {
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
      <PokemonPortrait
        avatar={props.avatar}
        style={{ width: "40px", height: "40px" }}
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
