import { Client, Room, RoomAvailable } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { Dispatch, SetStateAction, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { ILobbyUser } from "../../../../../models/colyseus-models/lobby-user"
import { TournamentSchema } from "../../../../../models/colyseus-models/tournament"
import GameState from "../../../../../rooms/states/game-state"
import PreparationState from "../../../../../rooms/states/preparation-state"
import {
  ICustomLobbyState,
  IGameMetadata,
  IPreparationMetadata,
  Role
} from "../../../../../types"
import { MAX_PLAYERS_PER_GAME } from "../../../../../types/Config"
import { GameMode } from "../../../../../types/enum/Game"
import { throttle } from "../../../../../utils/function"
import { logger } from "../../../../../utils/logger"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { leaveLobby } from "../../../stores/LobbyStore"
import { LocalStoreKeys, localStore } from "../../utils/store"
import GameRoomItem from "./game-room-item"
import RoomItem from "./room-item"
import { SpecialGameCountdown } from "./special-game-countdown"
import TournamentItem from "./tournament-item"
import "./room-menu.css"

export default function RoomMenu(props: {
  toPreparation: boolean
  setToPreparation: Dispatch<SetStateAction<boolean>>
}) {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const preparationRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.preparationRooms
  )
  const gameRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.gameRooms
  )
  const tournaments: TournamentSchema[] = useAppSelector(
    (state) => state.lobby.tournaments
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

  const sortedTournaments = [...tournaments].sort((a, b) =>
    a.finished !== b.finished
      ? a.finished
        ? +1
        : -1
      : new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  )

  const navigate = useNavigate()

  const createRoom = throttle(async function create(gameMode = GameMode.NORMAL) {
    if (lobby && !props.toPreparation && !isJoining) {
      setJoining(true)
      const user = firebase.auth().currentUser
      const token = await user?.getIdToken()
      const lobbyUser = lobbyUsers.find((u) => u.id === uid)
      if (token && lobbyUser) {
        const name = lobbyUser?.name ?? user?.displayName
        const room: Room<PreparationState> = await client.create(
          "preparation",
          {
            gameMode,
            idToken: token,
            ownerId: uid,
            roomName: gameMode === GameMode.QUICKPLAY ? "Quick play" : `${name}'${name.endsWith("s") ? "" : "s"} room`
          }
        )
        await lobby.leave()
        room.connection.close()
        localStore.set(
          LocalStoreKeys.RECONNECTION_TOKEN,
          room.reconnectionToken,
          30
        )
        dispatch(leaveLobby())
        props.setToPreparation(true)
      }
    }
  }, 1000)

  const joinPrepRoom = throttle(async function join(
    selectedRoom: RoomAvailable<IPreparationMetadata>
  ) {
    if (
      selectedRoom.clients >= MAX_PLAYERS_PER_GAME ||
      selectedRoom.metadata?.gameStarted === true ||
      (selectedRoom.metadata?.whitelist &&
        selectedRoom.metadata?.whitelist.includes(uid) === false) ||
      (selectedRoom.metadata?.blacklist &&
        selectedRoom.metadata?.blacklist.includes(uid) === true)
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
          localStore.set(
            LocalStoreKeys.RECONNECTION_TOKEN,
            room.reconnectionToken,
            30
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

  const quickPlay = throttle(async function quickPlay() {
    const existingQuickPlayRoom = preparationRooms.find(room => room.metadata?.gameMode === GameMode.QUICKPLAY)
    if(existingQuickPlayRoom){
      joinPrepRoom(existingQuickPlayRoom)
    } else {
      createRoom(GameMode.QUICKPLAY)
    }
  }, 1000)

  const joinGame = throttle(async function joinGame(
    selectedRoom: RoomAvailable<IGameMetadata>,
    spectate: boolean
  ) {
    if (lobby && !isJoining) {
      setJoining(true)
      const idToken = await firebase.auth().currentUser?.getIdToken()
      if (idToken) {
        const game: Room<GameState> = await client.joinById(
          selectedRoom.roomId,
          {
            idToken,
            spectate
          }
        )
        localStore.set(
          LocalStoreKeys.RECONNECTION_TOKEN,
          game.reconnectionToken,
          30
        )
        await lobby.leave()
        game.connection.close()
        dispatch(leaveLobby())
        navigate("/game")
      }
    }
  },
  1000)

  return (
    <Tabs className="my-container room-menu custom-bg">
      <h1>{t("rooms")}</h1>
      <TabList>
        <Tab>{t("available_rooms")}</Tab>
        <Tab>
          {t("in_game")} ({gameRooms.length})
        </Tab>
        {tournaments.length > 0 && <Tab>{t("tournament")}</Tab>}
      </TabList>

      <TabPanel className={"tab-available-rooms"}>
        {user ? (
          <>
            <SpecialGameCountdown />
            <ul className="hidden-scrollable">
              {preparationRooms.map((r) => (
                <li key={r.roomId}>
                  <RoomItem room={r} click={joinPrepRoom} />
                </li>
              ))}
            </ul>
            <button
              onClick={quickPlay}
              className="bubbly green create-room-button"
            >
              {t("quick_play")}
            </button>
            <button
              onClick={() => createRoom()}
              disabled={isFreshNewUser}
              className="bubbly blue create-room-button"
            >
              {t("create_custom_room")}
            </button>
          </>
        ) : (
          <p className="subtitle">{t("loading")}</p>
        )}
      </TabPanel>
      <TabPanel className={"tab-ingame-rooms"}>
        <ul className="hidden-scrollable">
          {gameRooms.map((r) => (
            <li key={r.roomId}>
              <GameRoomItem
                room={r}
                onJoin={(spectate) => joinGame(r, spectate)}
              />
            </li>
          ))}
        </ul>
      </TabPanel>
      {tournaments.length > 0 && (
        <TabPanel className={"tab-tournament"}>
          <ul className="hidden-scrollable">
            {sortedTournaments.map((t) => (
              <li key={t.id}>
                <TournamentItem tournament={t} />
              </li>
            ))}
          </ul>
        </TabPanel>
      )}
    </Tabs>
  )
}
