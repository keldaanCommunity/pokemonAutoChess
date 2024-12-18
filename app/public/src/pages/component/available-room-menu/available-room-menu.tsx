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
import { MAX_PLAYERS_PER_GAME } from "../../../../../types/Config"
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
  const uid: string = useAppSelector((state) => state.network.uid)
  const user = useAppSelector((state) => state.network.profile)
  const [showRoomSelectionMenu, setShowRoomSelectionMenu] = useState<boolean>(false)

  const requestRoom = throttle(async function (gameMode: GameMode) {
    if (lobby) {
      lobby.send(Transfer.REQUEST_ROOM, gameMode)
      setShowRoomSelectionMenu(false)
    }
  }, 1000)

  const requestJoiningExistingRoom = block(async function join(
    selectedRoom: RoomAvailable<IPreparationMetadata>
  ) {
    const { whitelist, blacklist, gameStartedAt, password } =
      selectedRoom.metadata ?? {}
    if (
      selectedRoom.clients >= MAX_PLAYERS_PER_GAME ||
      gameStartedAt ||
      (whitelist &&
        whitelist.length > 0 &&
        whitelist.includes(uid) === false) ||
      (blacklist && blacklist.length > 0 && blacklist.includes(uid) === true)
    ) {
      return
    }

    if (lobby) {
      if (password && user && user.role === Role.BASIC) {
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
                <RoomItem room={r} click={(room) => requestJoiningExistingRoom(room)} />
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
