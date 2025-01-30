import { RoomAvailable } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../hooks"
import { resetLobby } from "../stores/LobbyStore"
import { logOut, setErrorAlertMessage } from "../stores/NetworkStore"
import { Announcements } from "./component/announcements/announcements"
import AvailableRoomMenu from "./component/available-room-menu/available-room-menu"
import { GameRoomsMenu } from "./component/available-room-menu/game-rooms-menu"
import LeaderboardMenu from "./component/leaderboard/leaderboard-menu"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"
import { Modal } from "./component/modal/modal"
import { cc } from "./utils/jsx"
import { LocalStoreKeys, localStore } from "./utils/store"
import { joinLobbyRoom } from "../game/lobby-logic"
import "./lobby.css"

export default function Lobby() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const lobby = useAppSelector((state) => state.network.lobby)

  const [gameToReconnect, setGameToReconnect] = useState<string | null>(
    localStore.get(LocalStoreKeys.RECONNECTION_GAME)?.roomId
  )
  const networkError = useAppSelector(state => state.network.error)
  const gameRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.gameRooms
  )
  const showGameReconnect =
    gameToReconnect != null &&
    gameRooms.some((r) => r.roomId === gameToReconnect)

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
            <button className="bubbly green" onClick={() => navigate("/game")}>
              {t("yes")}
            </button>
            <button
              className="bubbly red"
              onClick={() => {
                setGameToReconnect(null)
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
            onClick={() => setActive("available_rooms")}
            className={cc({ active: activeSection === "available_rooms" })}
          >
            <img width={32} height={32} src={`assets/ui/room.svg`} />
            {t("rooms")}
          </li>
          <li
            onClick={() => setActive("game_rooms")}
            className={cc({ active: activeSection === "game_rooms" })}
          >
            <img width={32} height={32} src={`assets/ui/spectate.svg`} />
            {t("in_game")}
          </li>
          {/*<li
            onClick={() => setActive("online")}
            className={cc({ active: activeSection === "online" })}
          >
            <img width={32} height={32} src={`assets/ui/players.svg`} />
            {t("online")}
          </li>*/}
          <li
            onClick={() => setActive("announcements")}
            className={cc({ active: activeSection === "announcements" })}
          >
            <img width={32} height={32} src={`assets/ui/chat.svg`} />
            {t("announcements")}
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
      <section
        className={cc("rooms", { active: activeSection === "available_rooms" })}
      >
        <AvailableRoomMenu />
      </section>
      <section
        className={cc("game_rooms", { active: activeSection === "game_rooms" })}
      >
        <GameRoomsMenu />
      </section>
      {/*<section className={cc("online", { active: activeSection === "online" })}>
        <CurrentUsers />
      </section>*/}
      <section
        className={cc("announcements", {
          active: activeSection === "announcements"
        })}
      >
        <Announcements />
      </section>
    </div>
  )
}
