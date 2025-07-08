import { Room, RoomAvailable } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import GameState from "../../../rooms/states/game-state"
import { throttle } from "../../../utils/function"
import { joinLobbyRoom } from "../game/lobby-logic"
import { useAppDispatch, useAppSelector } from "../hooks"
import { resetLobby } from "../stores/LobbyStore"
import {
  logOut,
  setErrorAlertMessage,
  setPendingGameId
} from "../stores/NetworkStore"
import { EventsMenu } from "./component/events-menu/events-menu"
import LeaderboardMenu from "./component/leaderboard/leaderboard-menu"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"
import { Modal } from "./component/modal/modal"
import RoomMenu from "./component/room-menu/room-menu"
import { cc } from "./utils/jsx"
import { LocalStoreKeys, localStore } from "./utils/store"
import "./lobby.css"

export default function Lobby() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const lobby = useAppSelector((state) => state.network.lobby)
  const client = useAppSelector((state) => state.network.client)
  const networkError = useAppSelector((state) => state.network.error)
  const pendingGameId = useAppSelector((state) => state.network.pendingGameId)
  const gameRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.gameRooms
  )
  const showGameReconnect =
    pendingGameId != null && gameRooms.some((r) => r.roomId === pendingGameId)

  const { t } = useTranslation()

  const lobbyJoined = useRef<boolean>(false)
  useEffect(() => {
    if (!lobbyJoined.current) {
      joinLobbyRoom(dispatch, navigate)
      lobbyJoined.current = true
    }
  }, [lobbyJoined])

  const signOut = useCallback(async () => {
    if (lobby?.connection.isOpen) {
      await lobby.leave()
    }
    await firebase.auth().signOut()
    dispatch(resetLobby())
    dispatch(logOut())
    navigate("/")
  }, [dispatch, lobby])

  const reconnectToGame = throttle(async function reconnectToGame() {
    const idToken = await firebase.auth().currentUser?.getIdToken()
    if (idToken && pendingGameId) {
      const game: Room<GameState> = await client.joinById(pendingGameId, {
        idToken
      })
      localStore.set(
        LocalStoreKeys.RECONNECTION_GAME,
        { reconnectionToken: game.reconnectionToken, roomId: game.roomId },
        30
      )
      await Promise.allSettled([
        lobby?.connection.isOpen && lobby.leave(false),
        game.connection.isOpen && game.leave(false)
      ])
      dispatch(resetLobby())
      navigate("/game")
    }
  }, 1000)

  return (
    <main className="lobby">
      <MainSidebar
        page="main_lobby"
        leave={signOut}
        leaveLabel={t("sign_out")}
      />
      <div className="lobby-container">
        <MainLobby />
      </div>
      <Modal
        show={showGameReconnect}
        header={t("game-reconnect-modal-title")}
        body={t("game-reconnect-modal-body")}
        footer={
          <>
            <button className="bubbly green" onClick={reconnectToGame}>
              {t("yes")}
            </button>
            <button
              className="bubbly red"
              onClick={() => {
                dispatch(setPendingGameId(null))
              }}
            >
              {t("no")}
            </button>
          </>
        }
      ></Modal>
      <Modal
        show={networkError != null}
        onClose={() => dispatch(setErrorAlertMessage(null))}
        className="is-dark basic-modal-body"
        body={<p style={{ padding: "1em" }}>{networkError}</p>}
      />
    </main>
  )
}

function MainLobby() {
  const [activeSection, setActive] = useState<string>("leaderboard")
  const { t } = useTranslation()
  return (
    <div className="main-lobby">
      <nav className="main-lobby-nav">
        <ul>
          <li
            onClick={() => setActive("leaderboard")}
            className={cc({ active: activeSection === "leaderboard" })}
          >
            <img width={32} height={32} src={`assets/ui/leaderboard.svg`} />
            {t("leaderboard")}
          </li>
          <li
            onClick={() => setActive("rooms")}
            className={cc({ active: activeSection === "rooms" })}
          >
            <img width={32} height={32} src={`assets/ui/room.svg`} />
            {t("rooms")}
          </li>
          {/*<li
            onClick={() => setActive("game_rooms")}
            className={cc({ active: activeSection === "game_rooms" })}
          >
            <img width={32} height={32} src={`assets/ui/spectate.svg`} />
            {t("in_game")}
          </li>
          <li
            onClick={() => setActive("online")}
            className={cc({ active: activeSection === "online" })}
          >
            <img width={32} height={32} src={`assets/ui/players.svg`} />
            {t("online")}
          </li>*/}
          <li
            onClick={() => setActive("events")}
            className={cc({ active: activeSection === "events" })}
          >
            <img width={32} height={32} src={`assets/ui/chat.svg`} />
            {t("events")}
          </li>
        </ul>
      </nav>
      <section
        className={cc("leaderboard", {
          active: activeSection === "leaderboard"
        })}
      >
        <LeaderboardMenu />
      </section>
      <section className={cc("rooms", { active: activeSection === "rooms" })}>
        <RoomMenu />
      </section>
      {/*<section
        className={cc("game_rooms", { active: activeSection === "game_rooms" })}
      >
        <GameRoomsMenu />
      </section>
      <section className={cc("online", { active: activeSection === "online" })}>
        <CurrentUsers />
      </section>*/}
      <section
        className={cc("events", {
          active: activeSection === "events"
        })}
      >
        <EventsMenu />
      </section>
    </div>
  )
}
