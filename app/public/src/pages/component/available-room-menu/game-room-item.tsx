import { RoomAvailable } from "colyseus.js"
import React from "react"
import { IGameMetadata } from "../../../../../types"
import { useTranslation } from "react-i18next"
import { useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"
import "./room-item.css"

export default function GameRoomItem(props: {
  room: RoomAvailable<IGameMetadata>
  onJoin: (spectate: boolean) => void
}) {
  const { t } = useTranslation()
  const myUid = useAppSelector((state) => state.network.uid)
  const spectate = !props.room.metadata?.playerIds.includes(myUid)

  return (
    <div className="room-item">
      <span className="room-name">{props.room.metadata?.name}</span>
      <span>
        {props.room.metadata?.playerIds.length} {t("player")}
        {props.room.metadata?.playerIds.length !== 1 ? "s" : ""}, {t("stage")}{" "}
        {props.room.metadata?.stageLevel}
      </span>
      <button
        className={cc("bubbly", spectate ? "blue" : "green")}
        onClick={() => props.onJoin(spectate)}
      >
        {spectate ? t("spectate") : t("reconnect")}
      </button>
    </div>
  )
}
