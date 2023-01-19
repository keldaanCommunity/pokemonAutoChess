import { RoomAvailable } from "colyseus.js"
import React from "react"
import { IPreparationMetadata } from "../../../../../types"
import "./room-item.css";

export default function RoomItem(props: {
  room: RoomAvailable<IPreparationMetadata>
  click: (id: string) => Promise<void>
}) {
  return (
    <div className="room-item">
      <span className="room-name">{props.room.metadata?.name}</span>
      <span>{props.room.clients}/{props.room.maxClients}</span>
      <button
        className="bubbly green is-success"
        onClick={() => {
          props.click(props.room.roomId)
        }}
      >
        Join
      </button>
    </div>
  )
}
