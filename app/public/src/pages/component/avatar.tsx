import React from "react"
import Elo from "./elo"
import { Role } from "../../../../types"
import { RoleBadge } from "./RoleBadge"
import { getAvatarSrc } from "../../utils"
import { useTranslation } from "react-i18next"

import "./avatar.css"

export default function Avatar(props: {
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
      {props.elo && <Elo elo={props.elo} />}
    </div>
  )
}
