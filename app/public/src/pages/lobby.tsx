import { Client, Room, RoomAvailable } from "colyseus.js"
import { type NonFunctionPropNames } from "@colyseus/schema/lib/types/HelperTypes"
import firebase from "firebase/compat/app"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Navigate } from "react-router-dom"
import { Modal } from "react-bootstrap"
import LobbyUser from "../../../models/colyseus-models/lobby-user"
import {
  TournamentBracketSchema,
  TournamentPlayerSchema,
  TournamentSchema
} from "../../../models/colyseus-models/tournament"
import PokemonConfig from "../../../models/colyseus-models/pokemon-config"
import { IBot } from "../../../models/mongo-models/bot-v2"
import {
  ICustomLobbyState,
  ISuggestionUser,
  PkmWithConfig,
  Transfer
} from "../../../types"
import { useAppDispatch, useAppSelector } from "../hooks"
import i18n from "../i18n"
import store from "../stores"
import {
  addPokemonConfig,
  addRoom,
  addTournament,
  addTournamentBracket,
  addUser,
  changePokemonConfig,
  changeTournament,
  changeTournamentBracket,
  changeTournamentPlayer,
  changeUser,
  leaveLobby,
  pushBotLog,
  pushMessage,
  removeMessage,
  removeRoom,
  removeTournament,
  removeTournamentBracket,
  removeUser,
  setBoosterContent,
  setBotData,
  setBotLeaderboard,
  setBotList,
  setLanguage,
  setLeaderboard,
  setLevelLeaderboard,
  setNextSpecialGame,
  setPastebinUrl,
  setSearchedUser,
  setSuggestions,
  setUser,
  updateTournament
} from "../stores/LobbyStore"
import {
  joinLobby,
  logIn,
  logOut,
  requestBotLeaderboard,
  requestLeaderboard,
  requestLevelLeaderboard,
  setProfile
} from "../stores/NetworkStore"
import RoomMenu from "./component/available-room-menu/room-menu"
import CurrentUsers from "./component/available-user-menu/current-users"
import Chat from "./component/chat/chat"
import TabMenu from "./component/lobby-menu/tab-menu"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"
import { FIREBASE_CONFIG } from "./utils/utils"
import { IUserMetadata } from "../../../models/mongo-models/user-metadata"
import { logger } from "../../../utils/logger"
import { localStore, LocalStoreKeys } from "./utils/store"
import { cc } from "./utils/jsx"
import "./lobby.css"

export default function Lobby() {
  const dispatch = useAppDispatch()
  const lobby = useAppSelector((state) => state.network.lobby)

  const lobbyJoined = useRef<boolean>(false)
  const [reconnectionToken, setReconnectionToken] = useState<string | null>(
    localStore.get(LocalStoreKeys.RECONNECTION_TOKEN)
  )

  const [toPreparation, setToPreparation] = useState<boolean>(false)
  const [toGame, setToGame] = useState<boolean>(false)
  const [toAuth, setToAuth] = useState<boolean>(false)
  const { t } = useTranslation()

  useEffect(() => {
    const client = store.getState().network.client
    if (!lobbyJoined.current) {
      joinLobbyRoom(dispatch, client).catch((err) => {
        logger.error(err)
        setToAuth(true)
      })
      lobbyJoined.current = true
    }
  }, [lobbyJoined, dispatch])

  const signOut = useCallback(async () => {
    await lobby?.leave()
    await firebase.auth().signOut()
    dispatch(leaveLobby())
    dispatch(logOut())
    setToAuth(true)
  }, [dispatch, lobby])

  if (toAuth) {
    return <Navigate to={"/"} />
  }

  if (toPreparation) {
    return <Navigate to="/preparation"></Navigate>
  }

  if (toGame) {
    return <Navigate to="/game"></Navigate>
  }

  return (
    <main className="lobby">
      <MainSidebar
        page="main_lobby"
        leave={signOut}
        leaveLabel={t("sign_out")}
      />
      <div className="lobby-container">
        <MainLobby
          toPreparation={toPreparation}
          setToPreparation={setToPreparation}
        />
      </div>
      <Modal show={reconnectionToken != null}>
        <Modal.Header>
          <Modal.Title>{t("game-reconnect-modal-title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="game-reconnect-modal-body">
          {t("game-reconnect-modal-body")}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "space-evenly" }}>
          <button className="bubbly green" onClick={() => setToGame(true)}>
            {t("yes")}
          </button>
          <button
            className="bubbly red"
            onClick={() => {
              setReconnectionToken(null)
            }}
          >
            {t("no")}
          </button>
        </Modal.Footer>
      </Modal>
    </main>
  )
}

function MainLobby({ toPreparation, setToPreparation }) {
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
          <li
            onClick={() => setActive("online")}
            className={cc({ active: activeSection === "online" })}
          >
            <img width={32} height={32} src={`assets/ui/players.svg`} />
            {t("online")}
          </li>
          <li
            onClick={() => setActive("chat")}
            className={cc({ active: activeSection === "chat" })}
          >
            <img width={32} height={32} src={`assets/ui/chat.svg`} />
            {t("chat")}
          </li>
        </ul>
      </nav>
      <section
        className={cc("leaderboard", {
          active: activeSection === "leaderboard"
        })}
      >
        <TabMenu />
      </section>
      <section className={cc("rooms", { active: activeSection === "rooms" })}>
        <RoomMenu
          toPreparation={toPreparation}
          setToPreparation={setToPreparation}
        />
      </section>
      <section className={cc("online", { active: activeSection === "online" })}>
        <CurrentUsers />
      </section>
      <section className={cc("chat", { active: activeSection === "chat" })}>
        <Chat source="lobby" />
      </section>
    </div>
  )
}

export async function joinLobbyRoom(
  dispatch,
  client: Client
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

          const lobby = store.getState().network.lobby
          if (lobby) {
            await lobby.leave()
          }
          const room: Room<ICustomLobbyState> = await client.joinOrCreate(
            "lobby",
            { idToken: token }
          )
          room.state.messages.onAdd((m) => {
            dispatch(pushMessage(m))
          })
          room.state.messages.onRemove((m) => {
            dispatch(removeMessage(m))
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
                removeTournamentBracket({ tournamendId: tournament.id, bracketId })
              )
            })
          })

          room.state.tournaments.onRemove((tournament) => {
            dispatch(removeTournament(tournament))
          })

          room.state.users.onAdd((u) => {
            dispatch(addUser(u))

            if (u.id == user.uid) {
              u.pokemonCollection.onAdd((p) => {
                const pokemonConfig = p as PokemonConfig
                dispatch(addPokemonConfig(pokemonConfig))
                const fields: NonFunctionPropNames<PokemonConfig>[] = [
                  "dust",
                  "emotions",
                  "id",
                  "selectedEmotion",
                  "selectedShiny",
                  "shinyEmotions"
                ]

                fields.forEach((field) => {
                  pokemonConfig.listen(
                    field,
                    (value, previousValue) => {
                      if (previousValue !== undefined) {
                        dispatch(
                          changePokemonConfig({
                            id: pokemonConfig.id,
                            field: field,
                            value: value
                          })
                        )
                      }
                    },
                    false
                  )
                })
              }, false)
              dispatch(setUser(u))
              setSearchedUser(u)

              u.listen("language", (value) => {
                if (value) {
                  dispatch(setLanguage(value))
                  i18n.changeLanguage(value)
                }
              })
            }
            const fields: NonFunctionPropNames<LobbyUser>[] = [
              "id",
              "name",
              "avatar",
              "elo",
              "wins",
              "exp",
              "level",
              "donor",
              "honors",
              "history",
              "booster",
              "titles",
              "title",
              "role",
              "anonymous"
            ]

            fields.forEach((field) => {
              u.listen(field, (value) => {
                dispatch(changeUser({ id: u.id, field: field, value: value }))
              })
            })
          })

          room.state.listen("nextSpecialGame", (specialGame) => {
            dispatch(setNextSpecialGame(specialGame))
          })

          room.state.users.onRemove((u) => {
            dispatch(removeUser(u.id))
          })

          room.onMessage(Transfer.REQUEST_LEADERBOARD, (l) => {
            dispatch(setLeaderboard(l))
          })

          room.onMessage(Transfer.REQUEST_BOT_LEADERBOARD, (l) => {
            dispatch(setBotLeaderboard(l))
          })

          room.onMessage(Transfer.REQUEST_LEVEL_LEADERBOARD, (l) => {
            dispatch(setLevelLeaderboard(l))
          })

          room.onMessage(Transfer.BAN, () => reject("banned"))

          room.onMessage(Transfer.BANNED, (message) => {
            alert(message)
          })

          room.onMessage(Transfer.BOT_DATABASE_LOG, (message) => {
            dispatch(pushBotLog(message))
          })

          room.onMessage(Transfer.PASTEBIN_URL, (json: { url: string }) => {
            dispatch(setPastebinUrl(json.url))
          })

          room.onMessage(Transfer.ROOMS, (rooms: RoomAvailable[]) => {
            rooms.forEach((room) => dispatch(addRoom(room)))
          })

          room.onMessage(Transfer.REQUEST_BOT_LIST, (bots: IBot[]) => {
            dispatch(setBotList(bots))
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

          room.onMessage(Transfer.USER, (user: LobbyUser) =>
            dispatch(setSearchedUser(user))
          )

          room.onMessage(Transfer.REQUEST_BOT_DATA, (data: IBot) => {
            dispatch(setBotData(data))
          })

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
          dispatch(requestLeaderboard())
          dispatch(requestBotLeaderboard())
          dispatch(requestLevelLeaderboard())

          resolve(room)
        } catch (error) {
          reject(error)
        }
      } else {
        reject("not authenticated")
      }
    })
  })
}
