import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react"
import { Navigate } from "react-router-dom"
import Chat from "./component/chat/chat"
import CurrentUsers from "./component/available-user-menu/current-users"
import RoomMenu from "./component/available-room-menu/room-menu"
import TabMenu from "./component/lobby-menu/tab-menu"
import firebase from "firebase/compat/app"
import { FIREBASE_CONFIG } from "./utils/utils"
import { Client, Room, RoomAvailable } from "colyseus.js"
import TeamBuilder from "./component/bot-builder/team-builder"
import { useAppDispatch, useAppSelector } from "../hooks"
import {
  joinLobby,
  logIn,
  requestLeaderboard,
  requestBotLeaderboard,
  requestLevelLeaderboard,
  INetwork
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
  IUserLobbyState
} from "../stores/LobbyStore"
import {
  ICustomLobbyState,
  ISuggestionUser,
  NonFunctionPropNames,
  Role,
  Transfer
} from "../../../types"
import LobbyUser from "../../../models/colyseus-models/lobby-user"
import { IBot } from "../../../models/mongo-models/bot-v2"
import { IMeta } from "../../../models/mongo-models/meta"
import { IItemsStatistic } from "../../../models/mongo-models/items-statistic"
import PokemonConfig from "../../../models/colyseus-models/pokemon-config"
import { IPokemonsStatistic } from "../../../models/mongo-models/pokemons-statistic"
import "./lobby.css"
import { BotManagerPanel } from "./component/bot-builder/bot-manager-panel"
import i18n from "../i18n"
import { MainSidebar } from "./main-sidebar"
import store from "../stores"

export type Page = "main_lobby" | "bot_builder" | "bot_manager"

export default function Lobby() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.lobby.user)

  const lobbyJoined = useRef<boolean>(false)
  const [page, setPage] = useState<Page>("main_lobby")

  const [toPreparation, setToPreparation] = useState<boolean>(false)
  const [toAuth, setToAuth] = useState<boolean>(false)

  useEffect(() => {
    const client = store.getState().network.client
    if (!lobbyJoined.current) {
      join(dispatch, client, setToAuth)
      lobbyJoined.current = true
    }
  }, [lobbyJoined, dispatch])

  const changePage = useCallback((nextPage: Page) => setPage(nextPage), [])

  if (toAuth) {
    return <Navigate to={"/"} />
  }

  if (toPreparation) {
    return <Navigate to="/preparation"></Navigate>
  }

  return (
    <main className="lobby">
      <MainSidebar
        changePage={changePage}
        showBackButton={page !== "main_lobby"}
      />
      <div className="lobby-container">
        {page === "bot_manager" && user?.role !== Role.BASIC && (
          <BotManagerPanel />
        )}

        {page === "bot_builder" && <TeamBuilder />}

        {page === "main_lobby" && (
          <MainLobby
            toPreparation={toPreparation}
            setToPreparation={setToPreparation}
          />
        )}
      </div>
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

async function join(
  dispatch,
  client: Client,
  setToAuth: Dispatch<SetStateAction<boolean>>
) {
  if (!firebase.apps.length) {
    firebase.initializeApp(FIREBASE_CONFIG)
  }

  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      dispatch(logIn(user))
      try {
        const token = await user.getIdToken()
        const room: Room<ICustomLobbyState> = await client.joinOrCreate(
          "lobby",
          { idToken: token }
        )
        room.state.messages.onAdd((m) => {
          dispatch(pushMessage(m))
        })
        room.state.messages.onRemove((m, k) => {
          dispatch(removeMessage(m))
        })

        room.state.users.onAdd((u) => {
          dispatch(addUser(u))

          if (u.id == user.uid) {
            u.pokemonCollection.onAdd((p, key) => {
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
            "anonymous",
            "language"
          ]

          fields.forEach((field) => {
            u.listen(field, (value, previousValue) => {
              dispatch(changeUser({ id: u.id, field: field, value: value }))
            })
          })

          u.listen("language", (value) => {
            if (value) {
              dispatch(setLanguage(value))
              i18n.changeLanguage(value)
            }
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

        room.onMessage(Transfer.BAN, () => {
          setToAuth(true)
        })

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

        room.onMessage(
          Transfer.REQUEST_BOT_LIST,
          (
            bots: {
              name: string
              avatar: string
              id: string
              author: string
            }[]
          ) => {
            dispatch(setBotList(bots))
          }
        )

        room.onMessage(Transfer.ADD_ROOM, ([roomId, room]) => {
          if (room.name === "room" || room.name === "game") {
            dispatch(addRoom(room))
          }
        })

        room.onMessage(Transfer.REMOVE_ROOM, (roomId: string) =>
          dispatch(removeRoom(roomId))
        )

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

        room.onMessage(Transfer.BOOSTER_CONTENT, (boosterContent: string[]) => {
          dispatch(setBoosterContent(boosterContent))
        })

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
      } catch (error) {
        setToAuth(true)
      }
    } else {
      setToAuth(true)
    }
  })
}
