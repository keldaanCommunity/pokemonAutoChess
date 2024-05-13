import { RoomAvailable } from "colyseus.js"
import React from "react"
import { useTranslation } from "react-i18next"
import { IGameMetadata } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"
import "./room-item.css"

export default function GameRoomItem(props: {
  room: RoomAvailable<IGameMetadata>
  onJoin: (spectate: boolean) => void
}) {
  const { t } = useTranslation()
  const myUid = useAppSelector((state) => state.network.uid)
  const playerIds = props.room.metadata?.playerIds ?? []
  const spectate = playerIds.includes(myUid) === false
  

  return (
    <div className="room-item my-box">
      <span className="room-name" title={"Owner: "+props.room.metadata?.ownerName}>{props.room.metadata?.name}</span>
      <span>
        {playerIds.length} {t("player")}
        {playerIds.length !== 1 ? "s" : ""}, {t("stage")}{" "}
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
