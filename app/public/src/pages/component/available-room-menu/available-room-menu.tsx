import { Client, Room, RoomAvailable } from "colyseus.js"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  ICustomLobbyState,
  IPreparationMetadata,
  Role,
  Transfer
} from "../../../../../types"
import { GameMode } from "../../../../../types/enum/Game"
import { block, throttle } from "../../../../../utils/function"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import RoomItem from "./room-item"
import { RoomSelectionMenu } from "./room-selection-menu"
import { joinExistingPreparationRoom } from "../../../game/lobby-logic"
import "./available-room-menu.css"

export default function AvailableRoomMenu() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const preparationRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.preparationRooms
  )
  const ccu = useAppSelector((state) => state.lobby.ccu)

  const client: Client = useAppSelector((state) => state.network.client)
  const lobby: Room<ICustomLobbyState> | undefined = useAppSelector(
    (state) => state.network.lobby
  )
  const user = useAppSelector((state) => state.network.profile)
  const [showRoomSelectionMenu, setShowRoomSelectionMenu] = useState<boolean>(false)

  const requestRoom = throttle(async function (gameMode: GameMode) {
    if (lobby) {
      lobby.send(Transfer.REQUEST_ROOM, gameMode)
      setShowRoomSelectionMenu(false)
    }
  }, 1000)

  const onRoomAction = (room: RoomAvailable<IPreparationMetadata>, action: string) => {
    if (action === "join") {
      requestJoiningExistingRoom(room)
    } else if (action === "delete" && user?.role === Role.ADMIN) {
      confirm('Delete room ?') && lobby?.send(Transfer.DELETE_ROOM, room.roomId)
    }
  }

  const requestJoiningExistingRoom = block(async function join(
    selectedRoom: RoomAvailable<IPreparationMetadata>
  ) {
    const password = selectedRoom.metadata?.password

    if (lobby) {
      if (password && user?.role === Role.BASIC) {
        const password = prompt(`This room is private. Enter password`)
        if (selectedRoom.metadata?.password != password)
          return alert(`Wrong password !`)
      }

      await joinExistingPreparationRoom(selectedRoom.roomId, client, lobby, dispatch, navigate)
    }
  })

  return (
    <div className="my-container room-menu custom-bg">
      <h2>{t("available_rooms")}</h2>
      <p style={{ textAlign: "center" }}>
        {t("players", { count: ccu })},{" "}
        {t("rooms", { count: preparationRooms.length })}
      </p>
      {user ? (
        <>
          <ul>
            {preparationRooms.map((r) => (
              <li key={r.roomId}>
                <RoomItem room={r} click={onRoomAction} />
              </li>
            ))}
          </ul>
          <RoomSelectionMenu
            show={showRoomSelectionMenu}
            onClose={() => setShowRoomSelectionMenu(false)}
            onSelectMode={(mode) => requestRoom(mode)}
          />
          <button
            onClick={() => setShowRoomSelectionMenu(true)}
            className="bubbly green play-button"
          >
            {t("new_game")}
          </button>
        </>
      ) : (
        <p className="subtitle">{t("loading")}</p>
      )}
    </div>
  )
}
