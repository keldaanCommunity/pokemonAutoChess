import { RoomAvailable } from "colyseus.js"
import React from "react"
import { useTranslation } from "react-i18next"
import { IGameMetadata, Role } from "../../../../../types"
import { useAppSelector } from "../../../hooks"
import { cc } from "../../utils/jsx"
import "./room-item.css"

export default function GameRoomItem(props: {
  room: RoomAvailable<IGameMetadata>
  click: (action: string) => void
}) {
  const { t } = useTranslation()
  const myUid = useAppSelector((state) => state.network.uid)
  const user = useAppSelector((state) => state.network.profile)
  const isAdmin = user?.role === Role.ADMIN
  const playerIds = props.room.metadata?.playerIds ?? []
  const spectate = playerIds.includes(myUid) === false

  const title = `${props.room.metadata?.ownerName ? "Owner: " + props.room.metadata?.ownerName : ""}\n${props.room.metadata?.playersInfo?.join("\n")}`

  return (
    <div className="room-item my-box">
      <span className="room-name" title={title}>
        {props.room.metadata?.name}
      </span>
      <span className="room-info">
        {playerIds.length} {t("player")}
        {playerIds.length !== 1 ? "s" : ""}, {t("stage")}{" "}
        {props.room.metadata?.stageLevel}
      </span>
      {isAdmin && (
        <button
          title={t("delete_room")}
          onClick={() => {
            props.click("delete")
          }}
        >
          X
        </button>
      )}
      <button
        className={cc("bubbly", spectate ? "blue" : "green")}
        onClick={() => props.click(spectate ? "spectate" : "join")}
      >
        {spectate ? t("spectate") : t("reconnect")}
      </button>
    </div>
  )
}
