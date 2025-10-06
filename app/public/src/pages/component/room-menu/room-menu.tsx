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
import { IngameRoomsList } from "./game-rooms-menu"
import RoomItem from "./room-item"
import { RoomSelectionMenu } from "./room-selection-menu"
//import { mockRooms } from "../../../../../models/mock-data/room-listing"
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
    const passwordProtected = selectedRoom.metadata?.passwordProtected

    if (lobby) {
      let password: string | undefined
      if (
        passwordProtected &&
        user?.role !== Role.ADMIN &&
        user?.role !== Role.MODERATOR
      ) {
        const inputPassword = prompt(t("room_is_private"))
        if (!inputPassword) return
        password = inputPassword
      }

      await joinExistingPreparationRoom(
        selectedRoom.roomId,
        client,
        lobby,
        dispatch,
        navigate,
        password
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
        <Tab>
          <span>{t("in_game")}</span>
        </Tab>
        <Tab>
          <img src="/assets/ui/classic.png" alt="" />
          <span>{t("classic")}</span>
        </Tab>
        <Tab>
          <img src="/assets/ui/ranked.png" alt="" />
          <span>{t("ranked_match_short")}</span>
        </Tab>
        <Tab>
          <img src="/assets/ui/scribble.png" alt="" />
          <span>{t("smeargle_scribble_short")}</span>
        </Tab>
        <Tab>
          <img src="/assets/ui/custom.png" alt="" />
          <span>{t("custom_room_short")}</span>
        </Tab>
      </TabList>
      {!user && <p className="subtitle">{t("loading")}</p>}

      <TabPanel>
        <RoomList onRoomAction={onRoomAction} />
      </TabPanel>
      <TabPanel>
        <IngameRoomsList />
      </TabPanel>
      <TabPanel>
        <IngameRoomsList gameMode={GameMode.CLASSIC} />
      </TabPanel>
      <TabPanel>
        <IngameRoomsList gameMode={GameMode.RANKED} />
      </TabPanel>
      <TabPanel>
        <IngameRoomsList gameMode={GameMode.SCRIBBLE} />
      </TabPanel>
      <TabPanel>
        <IngameRoomsList gameMode={GameMode.CUSTOM_LOBBY} />
      </TabPanel>

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

export function RoomList({
  gameMode,
  onRoomAction
}: {
  gameMode?: GameMode
  onRoomAction: (room: RoomAvailable, action: string) => void
}) {
  const { t } = useTranslation()
  const preparationRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.preparationRooms
  )
  //preparationRooms.push(...mockRooms)

  return (
    <ul className="room-list hidden-scrollable">
      {preparationRooms
        .filter((r) => !gameMode || r.metadata.gameMode === gameMode)
        .map((r) => (
          <li key={r.roomId}>
            <RoomItem room={r} click={(action) => onRoomAction(r, action)} />
          </li>
        ))}
    </ul>
  )
}
