import React from "react"
import { EloBadge } from "./elo-badge"
import { Role } from "../../../../../types"
import { RoleBadge } from "./role-badge"
import { getAvatarSrc } from "../../../utils"
import { useTranslation } from "react-i18next"

import "./avatar.css"

export function Avatar(props: {
  name: string
  avatar: string
  elo?: number
  title?: string
  role?: Role
}) {
  const { t } = useTranslation()

  return (
    <div className="avatar player-box">
      <img className="pokemon-portrait" src={getAvatarSrc(props.avatar)} />
      <div className="player-portrait">
        <span className="player-title-role">
          {props.title && (
            <p className="player-title">{t(`title.${props.title}`)}</p>
          )}
          {props.role && <RoleBadge role={props.role} />}
        </span>
        <span className="player-name">{props.name}</span>
      </div>
      {props.elo && <EloBadge elo={props.elo} />}
    </div>
  )
}
