import { RoomAvailable } from "colyseus.js"
import React from "react"
import { IPreparationMetadata } from "../../../../../types"

export default function RoomItem(props: {
  room: RoomAvailable<IPreparationMetadata>
  click: (id: string) => Promise<void>
}) {
  return (
    <div
      className="player-box"
      style={{
        display: "flex",
        padding: "10px",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "10px"
      }}
    >
      <h5 style={{ textAlign: "center" }}>{props.room.metadata?.name}</h5>
      <div
        style={{ display: "flex", flexFlow: "column", alignItems: "center" }}
      >
        <h5>
          {props.room.clients}/{props.room.maxClients}
        </h5>
        <button
          className="bubbly green is-success"
          onClick={() => {
            props.click(props.room.roomId)
          }}
        >
          Join
        </button>
      </div>
    </div>
  )
}
