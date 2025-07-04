import { Client, Room, RoomAvailable } from "colyseus.js"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import {
  ICustomLobbyState,
  IPreparationMetadata,
  Role,
  Transfer
} from "../../../../../types"
import { GameMode } from "../../../../../types/enum/Game"
import { block, throttle } from "../../../../../utils/function"
import { joinExistingPreparationRoom } from "../../../game/lobby-logic"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import RoomItem from "./room-item"
import { RoomSelectionMenu } from "./room-selection-menu"
import { IngameRoomsList } from "./game-rooms-menu"
import "./room-menu.css"

export default function RoomMenu() {
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
  const [showRoomSelectionMenu, setShowRoomSelectionMenu] =
    useState<boolean>(false)

  const requestRoom = throttle(async function (gameMode: GameMode) {
    if (lobby) {
      lobby.send(Transfer.REQUEST_ROOM, gameMode)
      setShowRoomSelectionMenu(false)
    }
  }, 1000)

  const requestJoiningExistingRoom = block(async function join(
    selectedRoom: RoomAvailable<IPreparationMetadata>
  ) {
    const password = selectedRoom.metadata?.password

    if (lobby) {
      if (password && user?.role === Role.BASIC) {
        const password = prompt(t("room_is_private"))
        if (password && selectedRoom.metadata?.password != password)
          return alert(t("wrong_password"))
        else if (!password) return
      }

      await joinExistingPreparationRoom(
        selectedRoom.roomId,
        client,
        lobby,
        dispatch,
        navigate
      )
    }
  })

  const onRoomAction = (
    room: RoomAvailable<IPreparationMetadata>,
    action: string
  ) => {
    if (action === "join") {
      requestJoiningExistingRoom(room)
    } else if (action === "delete" && user?.role === Role.ADMIN) {
      confirm("Delete room ?") && lobby?.send(Transfer.DELETE_ROOM, room.roomId)
    }
  }

  return (
    <Tabs className="my-container room-menu custom-bg hidden-scrollable">
      <h2>{t("rooms")}</h2>
      <p style={{ position: "absolute", right: "10px", top: "10px" }}>
        {t("players", { count: ccu })},{" "}
        {t("rooms", { count: preparationRooms.length })}
      </p>
      <TabList>
        <Tab>{t("available_rooms")}</Tab>
        <Tab><img src="/assets/ui/quickplay.png" alt="" /><span>{t("quick_play")}</span></Tab>
        <Tab><img src="/assets/ui/ranked.png" alt="" /><span>{t("ranked_match_short")}</span></Tab>
        <Tab><img src="/assets/ui/scribble.png" alt="" /><span>{t("smeargle_scribble_short")}</span></Tab>
        <Tab><img src="/assets/ui/custom.png" alt="" /><span>{t("custom_room_short")}</span></Tab>
        <Tab><img src="/assets/ui/spectate.svg" alt="" /><span>{t("in_game")}</span></Tab>
      </TabList>
      <TabPanel>
        <RoomList onRoomAction={onRoomAction} />
      </TabPanel>
      <TabPanel>
        <RoomList gameMode={GameMode.QUICKPLAY} onRoomAction={onRoomAction} />
      </TabPanel>
      <TabPanel>
        <RoomList gameMode={GameMode.RANKED} onRoomAction={onRoomAction} />
      </TabPanel>
      <TabPanel>
        <RoomList gameMode={GameMode.SCRIBBLE} onRoomAction={onRoomAction} />
      </TabPanel>
      <TabPanel>
        <RoomList gameMode={GameMode.CUSTOM_LOBBY} onRoomAction={onRoomAction} />
      </TabPanel>
      <TabPanel>
        <IngameRoomsList />
      </TabPanel>
      {!user && <p className="subtitle">{t("loading")}</p>}

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
    </Tabs>
  )
}

export function RoomList({ gameMode, onRoomAction }: { gameMode?: GameMode, onRoomAction: (room: RoomAvailable, action: string) => void }) {
  const { t } = useTranslation()
  const preparationRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.preparationRooms
  )

  return (

    <ul className="room-list hidden-scrollable">
      {preparationRooms
        .filter((r) => !gameMode || r.metadata.gameMode === gameMode)
        .map((r) => (
          <li key={r.roomId}>
            <RoomItem room={r} click={action => onRoomAction(r, action)} />
          </li>
        ))}
    </ul>
  )
}