import { RoomAvailable } from "colyseus.js"
import React from "react"
import { IPreparationMetadata } from "../../../../../types"
import { cc } from "../../utils/jsx";
import "./room-item.css";

export default function RoomItem(props: {
  room: RoomAvailable<IPreparationMetadata>
  click: (room: RoomAvailable<IPreparationMetadata>) => Promise<void>
}) {
  return (
    <div className="room-item">
      <span className="room-name">{props.room.metadata?.name}</span>
      {props.room.metadata?.password && <img alt="Private" className="lock-icon" src="/assets/ui/lock.svg" />}
      {props.room.metadata?.noElo && <img alt="Just for fun" className="noelo-icon" src="/assets/ui/noelo.png" />}
      <span>{props.room.clients}/{props.room.maxClients}</span>
      <button
        className={cc("bubbly", props.room.metadata?.password ? 'orange' : 'green')}
        onClick={() => {
          props.click(props.room)
        }}
      >
        Join
      </button>
    </div>
  )
}
