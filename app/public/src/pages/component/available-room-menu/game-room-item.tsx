import { RoomAvailable } from "colyseus.js";
import React from "react"
import { IGameMetadata } from "../../../../../types";
import "./room-item.css";

export default function GameRoomItem(props: {
  room: RoomAvailable<IGameMetadata>
}) {
  return (
    <div className="room-item">
      <span className="room-name">{props.room.metadata?.name}</span>
      <span>{props.room.clients} player{props.room.clients !== 1 ? 's':''}, Stage {props.room.metadata?.stageLevel}</span>
    </div>
  )
}
