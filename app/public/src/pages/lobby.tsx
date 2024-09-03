import { type NonFunctionPropNames } from "@colyseus/schema/lib/types/HelperTypes"
import { Client, Room, RoomAvailable } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
  TournamentBracketSchema,
  TournamentPlayerSchema,
  TournamentSchema
} from "../../../models/colyseus-models/tournament"
import { IUserMetadata } from "../../../models/mongo-models/user-metadata"
import {
  ICustomLobbyState,
  ISuggestionUser,
  PkmWithConfig,
  Transfer
} from "../../../types"
import { CloseCodes, CloseCodesMessages } from "../../../types/enum/CloseCodes"
import { logger } from "../../../utils/logger"
import { useAppDispatch, useAppSelector } from "../hooks"
import store from "../stores"
import {
  addRoom,
  addTournament,
  addTournamentBracket,
  changeTournament,
  changeTournamentBracket,
  changeTournamentPlayer,
  leaveLobby,
  pushBotLog,
  pushMessage,
  removeMessage,
  removeRoom,
  removeTournament,
  removeTournamentBracket,
  setBoosterContent,
  setCcu,
  setNextSpecialGame,
  setSearchedUser,
  setSuggestions,
  updateTournament
} from "../stores/LobbyStore"
import {
  joinLobby,
  logIn,
  logOut,
  setErrorAlertMessage,
  setProfile
} from "../stores/NetworkStore"
import { Announcements } from "./component/announcements/announcements"
import AvailableRoomMenu from "./component/available-room-menu/available-room-menu"
import { GameRoomsMenu } from "./component/available-room-menu/game-rooms-menu"
import LeaderboardMenu from "./component/leaderboard/leaderboard-menu"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"
import { Modal } from "./component/modal/modal"
import { cc } from "./utils/jsx"
import { LocalStoreKeys, localStore } from "./utils/store"
import { FIREBASE_CONFIG } from "./utils/utils"
import "./lobby.css"

export default function Lobby() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const lobby = useAppSelector((state) => state.network.lobby)

  const lobbyJoined = useRef<boolean>(false)
  const [gameToReconnect, setGameToReconnect] = useState<string | null>(
    localStore.get(LocalStoreKeys.RECONNECTION_GAME)
  )
  const networkError = useAppSelector(state => state.network.error)
  const gameRooms: RoomAvailable[] = useAppSelector(
    (state) => state.lobby.gameRooms
  )
  const showGameReconnect =
    gameToReconnect != null &&
    gameRooms.some((r) => r.roomId === gameToReconnect)

  const { t } = useTranslation()

  const onLeave = (code: number) => {
    logger.info(`left lobby with code ${code}`)
    const errorMessage = CloseCodesMessages[code]
    if (errorMessage) {
      dispatch(setErrorAlertMessage(t(`errors.${errorMessage}`)))
    }
    navigate("/")
  }

  useEffect(() => {
    const client = store.getState().network.client
    if (!lobbyJoined.current) {
      joinLobbyRoom(dispatch, client, onLeave).catch((err) => {
        logger.error(err)
        const errorMessage = CloseCodesMessages[err] ?? "UNKNOWN_ERROR"
        if (errorMessage) {
          dispatch(setErrorAlertMessage(t(`errors.${errorMessage}`, { error: err })))
        }
        navigate("/")
      })
      lobbyJoined.current = true
    }
  }, [lobbyJoined, dispatch])

  const signOut = useCallback(async () => {
    if (lobby?.connection.isOpen) {
      await lobby.leave()
    }
    await firebase.auth().signOut()
    dispatch(leaveLobby())
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
                localStore.delete(LocalStoreKeys.RECONNECTION_GAME)
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

export async function joinLobbyRoom(
  dispatch,
  client: Client,
  onLeave: (code: number) => void
): Promise<Room<ICustomLobbyState>> {
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG)
  }
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(logIn(user))
        try {
          const token = await user.getIdToken()

          const reconnectToken: string = localStore.get(LocalStoreKeys.RECONNECTION_LOBBY)
          if (reconnectToken) {
            try {
              const lobbyRoom: Room<ICustomLobbyState> = await client.reconnect(reconnectToken)
              if (lobbyRoom.name === "lobby") {
                dispatch(joinLobby(lobbyRoom))
              } else if (lobbyRoom.connection.isOpen) {
                lobbyRoom.connection.close()
              }
            } catch (error) {
              logger.log(error)
              localStore.delete(LocalStoreKeys.RECONNECTION_LOBBY)
            }
          }
          const lobby = store.getState().network.lobby
          const room: Room<ICustomLobbyState> = lobby ?? await client.join("lobby", {
            idToken: token
          })

          room.onLeave(onLeave)

          room.state.messages.onAdd((m) => {
            dispatch(pushMessage(m))
          })
          room.state.messages.onRemove((m) => {
            dispatch(removeMessage(m))
          })

          room.state.listen("ccu", (value) => {
            dispatch(setCcu(value))
          })

          room.state.tournaments.onAdd((tournament) => {
            dispatch(addTournament(tournament))
            const fields: NonFunctionPropNames<TournamentSchema>[] = [
              "id",
              "name",
              "startDate"
            ]

            fields.forEach((field) => {
              tournament.listen(field, (value) => {
                dispatch(
                  changeTournament({
                    tournamentId: tournament.id,
                    field: field,
                    value: value
                  })
                )
              })
            })

            tournament.players.onAdd((player, userId) => {
              dispatch(updateTournament()) // TOFIX: force redux reactivity
              const fields: NonFunctionPropNames<TournamentPlayerSchema>[] = [
                "eliminated"
              ]
              fields.forEach((field) => {
                player.listen(field, (value) => {
                  dispatch(
                    changeTournamentPlayer({
                      tournamentId: tournament.id,
                      playerId: userId,
                      field: field,
                      value: value
                    })
                  )
                })
              })
            })

            tournament.players.onRemove((player, userId) => {
              dispatch(updateTournament()) // TOFIX: force redux reactivity
            })

            tournament.brackets.onAdd((bracket, bracketId) => {
              dispatch(
                addTournamentBracket({
                  tournamendId: tournament.id,
                  bracketId,
                  bracket
                })
              )

              const fields: NonFunctionPropNames<TournamentBracketSchema>[] = [
                "name",
                "finished"
              ]
              fields.forEach((field) => {
                bracket.listen(field, (value) => {
                  dispatch(
                    changeTournamentBracket({
                      tournamentId: tournament.id,
                      bracketId,
                      field,
                      value
                    })
                  )
                })
              })

              bracket.playersId.onChange(() => {
                dispatch(
                  changeTournamentBracket({
                    tournamentId: tournament.id,
                    bracketId,
                    field: "playersId",
                    value: bracket.playersId
                  })
                )
              })
            })

            tournament.brackets.onRemove((bracket, bracketId) => {
              dispatch(
                removeTournamentBracket({
                  tournamendId: tournament.id,
                  bracketId
                })
              )
            })
          })

          room.state.tournaments.onRemove((tournament) => {
            dispatch(removeTournament(tournament))
          })

          room.state.listen("nextSpecialGame", (specialGame) => {
            dispatch(setNextSpecialGame(specialGame))
          })

          room.onMessage(Transfer.BANNED, (message) => {
            alert(message)
          })

          room.onMessage(Transfer.BOT_DATABASE_LOG, (message) => {
            dispatch(pushBotLog(message))
          })

          room.onMessage(Transfer.ROOMS, (rooms: RoomAvailable[]) => {
            rooms.forEach((room) => dispatch(addRoom(room)))
          })

          room.onMessage(Transfer.ADD_ROOM, ([, room]) => {
            if (room.name === "preparation" || room.name === "game") {
              dispatch(addRoom(room))
            }
          })

          room.onMessage(Transfer.REMOVE_ROOM, (roomId: string) =>
            dispatch(removeRoom(roomId))
          )

          room.onMessage(Transfer.USER_PROFILE, (user: IUserMetadata) => {
            dispatch(setProfile(user))
          })

          room.onMessage(Transfer.USER, (user: IUserMetadata) =>
            dispatch(setSearchedUser(user))
          )

          room.onMessage(
            Transfer.BOOSTER_CONTENT,
            (boosterContent: PkmWithConfig[]) => {
              dispatch(setBoosterContent(boosterContent))
            }
          )

          room.onMessage(
            Transfer.SUGGESTIONS,
            (suggestions: ISuggestionUser[]) => {
              dispatch(setSuggestions(suggestions))
            }
          )

          dispatch(joinLobby(room))

          resolve(room)
        } catch (error) {
          reject(error)
        }
      } else {
        reject(CloseCodes.USER_NOT_AUTHENTICATED)
      }
    })
  })
}
