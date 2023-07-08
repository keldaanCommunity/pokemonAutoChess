import { RoomAvailable } from "colyseus.js"
import React from "react"
import { IPreparationMetadata } from "../../../../../types"
import { cc } from "../../utils/jsx"
import "./room-item.css"
import { MAX_PLAYERS_PER_LOBBY } from "../../../../../types/Config"

export default function RoomItem(props: {
  room: RoomAvailable<IPreparationMetadata>
  click: (room: RoomAvailable<IPreparationMetadata>) => Promise<void>
}) {
  return (
    <div className="room-item">
      <span className="room-name">{props.room.metadata?.name}</span>
      {props.room.metadata?.password && (
        <img alt="Private" title="Private Lobby (password protected)" className="lock-icon" src="/assets/ui/lock.svg" />
      )}
      {props.room.metadata?.noElo && (
        <img
          alt="Just for fun"
          title="Just for fun (no ELO gain/loss)"
          className="noelo-icon"
          src="/assets/ui/noelo.png"
          style={{ borderRadius: "50%" }}
        />
      )}
      <span>
        {props.room.clients}/{MAX_PLAYERS_PER_LOBBY}
      </span>
      <button
        disabled={
          props.room.clients >= MAX_PLAYERS_PER_LOBBY ||
          props.room.metadata?.gameStarted === true
        }
        className={cc(
          "bubbly",
          props.room.metadata?.password ? "orange" : "green"
        )}
        onClick={() => {
          if (
            props.room.clients < MAX_PLAYERS_PER_LOBBY &&
            props.room.metadata?.gameStarted !== true
          ) {
            props.click(props.room)
          }
        }}
      >
        Join
      </button>
    </div>
  )
}
