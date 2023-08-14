import { RoomAvailable } from "colyseus.js"
import React from "react"
import { IGameMetadata } from "../../../../../types"
import "./room-item.css"
import { useTranslation } from "react-i18next"

export default function GameRoomItem(props: {
  room: RoomAvailable<IGameMetadata>
  onSpectate: () => any
}) {
  const { t } = useTranslation()
  return (
    <div className="room-item">
      <span className="room-name">{props.room.metadata?.name}</span>
      <span>
        {props.room.clients} {t("player")}
        {props.room.clients !== 1 ? "s" : ""}, {t("stage")}{" "}
        {props.room.metadata?.stageLevel}
      </span>
      <button className="bubbly blue" onClick={() => props.onSpectate()}>
        {t("spectate")}
      </button>
    </div>
  )
}
