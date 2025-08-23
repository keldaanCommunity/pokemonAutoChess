import { Client, Room, RoomAvailable } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import GameState from "../../../../../rooms/states/game-state"
import {
  ICustomLobbyState,
  IGameMetadata,
  Role,
  Transfer
} from "../../../../../types"
import { throttle } from "../../../../../utils/function"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { resetLobby } from "../../../stores/LobbyStore"
import { LocalStoreKeys, localStore } from "../../utils/store"
import GameRoomItem from "./game-room-item"

export function IngameRoomsList() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const gameRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.gameRooms
  )
  const navigate = useNavigate()
  const client: Client = useAppSelector((state) => state.network.client)
  const [isJoining, setJoining] = useState<boolean>(false)
  const lobby: Room<ICustomLobbyState> | undefined = useAppSelector(
    (state) => state.network.lobby
  )
  const user = useAppSelector((state) => state.network.profile)

  const joinGame = throttle(async function joinGame(
    selectedRoom: RoomAvailable<IGameMetadata>
  ) {
    const token = await firebase.auth().currentUser?.getIdToken()
    if (lobby && !isJoining && token) {
      setJoining(true)
      const game: Room<GameState> = await client.joinById(selectedRoom.roomId, {
        idToken: token
      })
      localStore.set(LocalStoreKeys.RECONNECTION_GAME, game.reconnectionToken, 30)
      await Promise.allSettled([
        lobby.connection.isOpen && lobby.leave(false),
        game.connection.isOpen && game.leave(false)
      ])
      dispatch(resetLobby())
      navigate("/game")
    }
  }, 1000)

  const onRoomAction = (room: RoomAvailable<IGameMetadata>, action: string) => {
    if (action === "join" || action === "spectate") {
      joinGame(room)
    } else if (action === "delete" && user?.role === Role.ADMIN) {
      confirm("Delete room ?") && lobby?.send(Transfer.DELETE_ROOM, room.roomId)
    }
  }

  return (
    <div>
      <p style={{ textAlign: "center" }}>
        {t("rooms", { count: gameRooms.length })}
      </p>
      <ul className="hidden-scrollable room-list">
        {gameRooms.map((r) => (
          <li key={r.roomId}>
            <GameRoomItem
              room={r}
              click={(action) => onRoomAction(r, action)}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
