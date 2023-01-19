import { Client, Room } from "colyseus.js"
import { RoomAvailable } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { Dispatch, SetStateAction, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { ICustomLobbyState } from "../../../../../types"
import RoomItem from "./room-item"
import PreparationState from "../../../../../rooms/states/preparation-state"
import { leaveLobby } from "../../../stores/LobbyStore"
import "./room-menu.css";

export default function RoomMenu(props: {
  toPreparation: boolean
  setToPreparation: Dispatch<SetStateAction<boolean>>
}) {
  const dispatch = useAppDispatch()
  const allRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.allRooms
  )
  const client: Client = useAppSelector((state) => state.network.client)
  const lobby: Room<ICustomLobbyState> | undefined = useAppSelector(
    (state) => state.network.lobby
  )
  const uid: string = useAppSelector((state) => state.network.uid)
  const [isJoining, setJoining] = useState<boolean>(false)

  async function create() {
    if (lobby && !props.toPreparation && !isJoining) {
      setJoining(true)
      const user = firebase.auth().currentUser
      const token = await user?.getIdToken()
      if (token) {
        const room: Room<PreparationState> = await client.create("room", {
          idToken: token,
          ownerId: uid,
          ownerName: user?.displayName ? user.displayName : uid
        })
        localStorage.setItem("lastRoomId", room.id)
        localStorage.setItem("lastSessionId", room.sessionId)
        await lobby.leave()
        room.connection.close()
        dispatch(leaveLobby())
        props.setToPreparation(true)
      }
    }
  }

  async function join(id: string) {
    if (lobby && !props.toPreparation && !isJoining) {
      setJoining(true)
      const token = await firebase.auth().currentUser?.getIdToken()
      if (token) {
        const room: Room<PreparationState> = await client.joinById(id, {
          idToken: token
        })
        localStorage.setItem("lastRoomId", room.id)
        localStorage.setItem("lastSessionId", room.sessionId)
        await lobby.leave()
        room.connection.close()
        dispatch(leaveLobby())
        props.setToPreparation(true)
      }
    }
  }

  return (
    <div className="nes-container room-menu">
      <h1>Available Rooms</h1>
      {allRooms.length === 0 && (<p className="subtitle">
        Click on Create Room to play!
      </p>)}
      <ul className="hidden-scrollable">
        {allRooms.map((r) => (
          <li key={r.roomId}>
            <RoomItem room={r} click={join} />
          </li>
        ))}
      </ul>
      <button onClick={create} className="bubbly green create-room-button">
        Create Room
      </button>
    </div>
  )
}
