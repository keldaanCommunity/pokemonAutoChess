import React from "react"
import { ILobbyUser } from "../../../../../models/colyseus-models/lobby-user"
import { getAvatarSrc } from "../../../utils"
import Elo from "../elo"
import { RoleBadge } from "../RoleBadge"
import { useTranslation } from "react-i18next"

export default function PlayerBox(props: { user: ILobbyUser }) {
  const { t } = useTranslation()
  return (
    <div className="player-box">
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
          {props.user.title && (
            <p className="player-title">{t(`title.${props.user.title}`)}</p>
          )}
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
          {t("level")} {props.user.level} ({props.user.exp} / 1000)
        </p>
        <p>
          {t("wins")}: {props.user.wins}
        </p>
      </div>
      <p style={{ color: "gray", fontSize: "60%" }}>
        {t("user_id")}: {props.user.id}
      </p>
    </div>
  )
}
