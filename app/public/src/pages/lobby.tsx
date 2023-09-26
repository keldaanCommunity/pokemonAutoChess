import React, { useCallback, useEffect, useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import Chat from "./component/chat/chat"
import CurrentUsers from "./component/available-user-menu/current-users"
import RoomMenu from "./component/available-room-menu/room-menu"
import TabMenu from "./component/lobby-menu/tab-menu"
import firebase from "firebase/compat/app"
import { FIREBASE_CONFIG } from "./utils/utils"
import { Client, Room, RoomAvailable } from "colyseus.js"
import { useAppDispatch, useAppSelector } from "../hooks"
import {
  joinLobby,
  logIn,
  requestLeaderboard,
  requestBotLeaderboard,
  requestLevelLeaderboard,
  logOut,
  setProfile
} from "../stores/NetworkStore"
import {
  setBotData,
  setBotList,
  setPastebinUrl,
  setMetaItems,
  setMeta,
  addRoom,
  addUser,
  changeUser,
  pushMessage,
  removeRoom,
  removeUser,
  setSearchedUser,
  setUser,
  changePokemonConfig,
  addPokemonConfig,
  setBoosterContent,
  setMetaPokemons,
  setSuggestions,
  removeMessage,
  setLevelLeaderboard,
  setBotLeaderboard,
  setLeaderboard,
  pushBotLog,
  setLanguage,
  leaveLobby
} from "../stores/LobbyStore"
import {
  ICustomLobbyState,
  ISuggestionUser,
  NonFunctionPropNames,
  Transfer
} from "../../../types"
import LobbyUser from "../../../models/colyseus-models/lobby-user"
import { IBot } from "../../../models/mongo-models/bot-v2"
import { IMeta } from "../../../models/mongo-models/meta"
import { IItemsStatistic } from "../../../models/mongo-models/items-statistic"
import PokemonConfig from "../../../models/colyseus-models/pokemon-config"
import { IPokemonsStatistic } from "../../../models/mongo-models/pokemons-statistic"
import i18n from "../i18n"
import { MainSidebar } from "./component/main-sidebar"
import store from "../stores"
import { useTranslation } from "react-i18next"

import "./lobby.css"
import { localStore, LocalStoreKeys } from "./utils/store"
import { Modal } from "react-bootstrap"
import { IUserMetadata } from "../../../models/mongo-models/user-metadata"
import { logger } from "../../../utils/logger"

export default function Lobby() {
  const dispatch = useAppDispatch()
  const lobby = useAppSelector((state) => state.network.lobby)

  const lobbyJoined = useRef<boolean>(false)
  const [reconnectionToken, setReconnectionToken] = useState<string | null>(
    null
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
      setReconnectionToken(localStore.get(LocalStoreKeys.RECONNECTION_TOKEN))
    }
  }, [lobbyJoined, dispatch])

  const signOut = useCallback(async () => {
    await lobby?.leave()
    await firebase.auth().signOut()
    dispatch(leaveLobby())
    dispatch(logOut())
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
              localStore.delete(LocalStoreKeys.RECONNECTION_TOKEN)
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
  return (
    <div className="main-lobby">
      <TabMenu />
      <RoomMenu
        toPreparation={toPreparation}
        setToPreparation={setToPreparation}
      />
      <div className="news-chat">
        <CurrentUsers />
        <Chat source="lobby" />
      </div>
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
            if (room.name === "room" || room.name === "game") {
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

          room.onMessage(Transfer.REQUEST_META, (meta: IMeta[]) => {
            dispatch(setMeta(meta))
          })

          room.onMessage(
            Transfer.REQUEST_META_ITEMS,
            (metaItems: IItemsStatistic[]) => {
              dispatch(setMetaItems(metaItems))
            }
          )

          room.onMessage(
            Transfer.REQUEST_META_POKEMONS,
            (metaPokemons: IPokemonsStatistic[]) => {
              dispatch(setMetaPokemons(metaPokemons))
            }
          )

          room.onMessage(Transfer.REQUEST_BOT_DATA, (data: IBot) => {
            dispatch(setBotData(data))
          })

          room.onMessage(
            Transfer.BOOSTER_CONTENT,
            (boosterContent: string[]) => {
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
