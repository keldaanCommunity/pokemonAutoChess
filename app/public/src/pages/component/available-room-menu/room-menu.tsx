import { Client, Room } from "colyseus.js"
import { RoomAvailable } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { Dispatch, SetStateAction, useState } from "react"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import {
  ICustomLobbyState,
  IGameMetadata,
  IPreparationMetadata,
  Role
} from "../../../../../types"
import RoomItem from "./room-item"
import PreparationState from "../../../../../rooms/states/preparation-state"
import { leaveLobby } from "../../../stores/LobbyStore"
import { ILobbyUser } from "../../../../../models/colyseus-models/lobby-user"
import GameRoomItem from "./game-room-item"
import "./room-menu.css"
import { throttle } from "../../../../../utils/function"
import GameState from "../../../../../rooms/states/game-state"
import { useNavigate } from "react-router"
import { MAX_PLAYERS_PER_LOBBY } from "../../../../../types/Config"
import { logger } from "../../../../../utils/logger"
import { t } from "i18next"

export default function RoomMenu(props: {
  toPreparation: boolean
  setToPreparation: Dispatch<SetStateAction<boolean>>
}) {
  const dispatch = useAppDispatch()
  const preparationRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.preparationRooms
  )
  const gameRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.gameRooms
  )
  const client: Client = useAppSelector((state) => state.network.client)
  const lobby: Room<ICustomLobbyState> | undefined = useAppSelector(
    (state) => state.network.lobby
  )
  const uid: string = useAppSelector((state) => state.network.uid)
  const lobbyUsers: ILobbyUser[] = useAppSelector((state) => state.lobby.users)
  const user = useAppSelector((state) => state.lobby.user)
  const isFreshNewUser =
    user &&
    user.anonymous &&
    Date.now() - new Date(user.creationTime).getTime() < 10 * 60 * 1000
  const [isJoining, setJoining] = useState<boolean>(false)

  const navigate = useNavigate()

  const createRoom = throttle(async function create() {
    if (lobby && !props.toPreparation && !isJoining) {
      setJoining(true)
      const user = firebase.auth().currentUser
      const token = await user?.getIdToken()
      const lobbyUser = lobbyUsers.find((u) => u.id === uid)
      if (token && lobbyUser) {
        const room: Room<PreparationState> = await client.create("room", {
          idToken: token,
          ownerId: uid,
          ownerName: lobbyUser?.name ? lobbyUser.name : uid
        })
        localStorage.setItem("cachedReconnectionToken", room.reconnectionToken)
        await lobby.leave()
        room.connection.close()
        dispatch(leaveLobby())
        props.setToPreparation(true)
      }
    }
  }, 1000)

  const joinRoom = throttle(async function join(
    selectedRoom: RoomAvailable<IPreparationMetadata>
  ) {
    if (
      selectedRoom.clients >= MAX_PLAYERS_PER_LOBBY ||
      selectedRoom.metadata?.gameStarted === true
    ) {
      return
    }

    if (lobby && !props.toPreparation && !isJoining) {
      if (selectedRoom.metadata?.password) {
        const lobbyUser = lobbyUsers.find((u) => u.id === uid)
        if (lobbyUser && lobbyUser.role === Role.BASIC) {
          const password = prompt(`This room is private. Enter password`)
          if (selectedRoom.metadata?.password != password)
            return alert(`Wrong password !`)
        }
      }
      setJoining(true)
      const token = await firebase.auth().currentUser?.getIdToken()
      if (token) {
        try {
          const room: Room<PreparationState> = await client.joinById(
            selectedRoom.roomId,
            {
              idToken: token
            }
          )
          localStorage.setItem(
            "cachedReconnectionToken",
            room.reconnectionToken
          )
          await lobby.leave()
          room.connection.close()
          dispatch(leaveLobby())
          props.setToPreparation(true)
        } catch (error) {
          logger.error(error)
        }
      }
    }
  },
  1000)

  const spectateRoom = throttle(async function spectate(
    selectedRoom: RoomAvailable<IGameMetadata>
  ) {
    if (lobby && !isJoining) {
      setJoining(true)
      const token = await firebase.auth().currentUser?.getIdToken()
      if (token) {
        const game: Room<GameState> = await client.joinById(
          selectedRoom.roomId,
          {
            idToken: token,
            spectate: true
          }
        )
        localStorage.setItem("cachedReconnectionToken", game.reconnectionToken)
        await lobby.leave()
        game.connection.close()
        dispatch(leaveLobby())
        navigate("/game")
      }
    }
  },
  1000)

  return (
    <Tabs className="nes-container room-menu">
      <TabList>
        <Tab>{t("available_rooms")}</Tab>
        <Tab>
          {t("in_game")} ({gameRooms.length})
        </Tab>
      </TabList>

      <TabPanel>
        {user ? (
          <>
            {preparationRooms.length === 0 && (
              <p className="subtitle">
                {isFreshNewUser ? t("join_a_lobby") : t("click_on_create_room")}
              </p>
            )}
            <ul className="hidden-scrollable">
              {preparationRooms.map((r) => (
                <li key={r.roomId}>
                  <RoomItem room={r} click={joinRoom} />
                </li>
              ))}
            </ul>
            <button
              onClick={createRoom}
              disabled={isFreshNewUser}
              className="bubbly green create-room-button"
            >
              {t("create_room")}
            </button>
          </>
        ) : (
          <p className="subtitle">{t("loading")}</p>
        )}
      </TabPanel>
      <TabPanel>
        <ul className="hidden-scrollable">
          {gameRooms.map((r) => (
            <li key={r.roomId}>
              <GameRoomItem room={r} onSpectate={() => spectateRoom(r)} />
            </li>
          ))}
        </ul>
      </TabPanel>
    </Tabs>
  )
}
