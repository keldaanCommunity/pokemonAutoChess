import type { RoomAvailable } from "@colyseus/sdk"
import firebase from "firebase/compat/app"
import { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import type GameState from "../../../rooms/states/game-state"
import { Transfer } from "../../../types"
import { CloseCodesMessages } from "../../../types/enum/CloseCodes"
import { throttle } from "../../../utils/function"
import { joinLobbyRoom } from "../game/lobby-logic"
import { resetActiveGameRoom } from "../game/recorder"
import { useAppDispatch, useAppSelector } from "../hooks"
import { client, joinGame, leaveRoom, rooms } from "../network"
import { resetBoosters } from "../stores/BoostersStore"
import { resetLobby } from "../stores/LobbyStore"
import {
  clearNotification,
  logOut,
  setErrorAlertMessage,
  setPendingGameId
} from "../stores/NetworkStore"
import { EventsMenu } from "./component/events-menu/events-menu"
import LeaderboardMenu from "./component/leaderboard/leaderboard-menu"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"
import { Modal } from "./component/modal/modal"
import { NotificationModal } from "./component/notifications/notification-modal"
import RoomMenu from "./component/room-menu/room-menu"
import { cc } from "./utils/jsx"
import "./lobby.css"

export default function Lobby() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const networkError = useAppSelector((state) => state.network.error)
  const pendingGameId = useAppSelector((state) => state.network.pendingGameId)
  const notifications = useAppSelector((state) => state.network.notifications)
  const gameRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.gameRooms
  )
  const showGameReconnect =
    pendingGameId != null && gameRooms.some((r) => r.roomId === pendingGameId)

  const { t } = useTranslation()

  const lobbyJoined = useRef<boolean>(false)
  const reconnecting = useRef<boolean>(false)
  useEffect(() => {
    if (!lobbyJoined.current) {
      // leave the game before joining, so the lobby sees its reconnection hold and prompts for it
      const timeout = new Promise((resolve) => setTimeout(resolve, 2000)) // a stalled socket can take a minute to close
      Promise.race([leaveRoom("game", true), timeout]).finally(() => {
        joinLobbyRoom(dispatch, navigate)
      })
      lobbyJoined.current = true
    }
  }, [lobbyJoined])

  // back in the lobby, flush the finished game's in-memory tail to disk, then release the recorder's ref
  useEffect(() => {
    void resetActiveGameRoom()
  }, [])

  const signOut = useCallback(async () => {
    leaveRoom("lobby")
    await firebase.auth().signOut()
    dispatch(resetLobby())
    dispatch(resetBoosters())
    dispatch(logOut())
    navigate("/")
  }, [dispatch])

  const handleNotificationClose = (notificationId: string) => {
    // Send acknowledgment to server
    rooms.lobby?.send(Transfer.NOTIFICATION_SEEN, notificationId)
    // Remove from local state
    dispatch(clearNotification(notificationId))
  }

  const reconnectToGame = throttle(async function reconnectToGame() {
    // the throttle's flag is re-created on every render
    if (pendingGameId && !reconnecting.current) {
      reconnecting.current = true
      try {
        const idToken = await firebase.auth().currentUser?.getIdToken()
        const game = await client.joinById<GameState>(pendingGameId, {
          idToken
        })
        joinGame(game, 60 * 60) // back in game, so the token is valid for 1 hour
        dispatch(setPendingGameId(null)) // or the prompt returns after they leave this game
        dispatch(resetLobby())
        dispatch(resetBoosters())
        navigate("/game")
      } catch (error: any) {
        reconnecting.current = false // let them try again
        const message =
          CloseCodesMessages[error?.code as keyof typeof CloseCodesMessages] ??
          "UNKNOWN_ERROR"
        dispatch(
          setErrorAlertMessage(
            t(`errors.${message}`, { error: error?.message })
          )
        )
      }
    }
  }, 1000)

  return (
    <main className="lobby">
      <MainSidebar
        page="main_lobby"
        leave={signOut}
        leaveLabel={t("auth.sign_out")}
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
      <NotificationModal
        notifications={notifications}
        onClose={handleNotificationClose}
      />
      <Modal
        show={networkError != null}
        onClose={() => {
          dispatch(setErrorAlertMessage(null))
        }}
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
