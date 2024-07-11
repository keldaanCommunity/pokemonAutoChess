import { Client, Room } from "colyseus.js"
import { type NonFunctionPropNames } from "@colyseus/schema/lib/types/HelperTypes"
import firebase from "firebase/compat/app"
import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Navigate } from "react-router-dom"
import { GameUser } from "../../../models/colyseus-models/game-user"
import { IBot } from "../../../models/mongo-models/bot-v2"
import { IUserMetadata } from "../../../models/mongo-models/user-metadata"
import GameState from "../../../rooms/states/game-state"
import PreparationState from "../../../rooms/states/preparation-state"
import { Transfer } from "../../../types"
import { logger } from "../../../utils/logger"
import { useAppDispatch, useAppSelector } from "../hooks"
import {
  joinPreparation,
  logIn,
  setProfile,
  toggleReady
} from "../stores/NetworkStore"
import {
  addUser,
  changeUser,
  leavePreparation,
  pushMessage,
  removeMessage,
  removeUser,
  setBotsList,
  setGameStarted,
  setGameMode,
  setName,
  setNoELO,
  setOwnerId,
  setOwnerName,
  setPassword,
  setUser,
  setWhiteList,
  setBlackList
} from "../stores/PreparationStore"
import Chat from "./component/chat/chat"
import { MainSidebar } from "./component/main-sidebar/main-sidebar"
import PreparationMenu from "./component/preparation/preparation-menu"
import { SOUNDS, playSound } from "./utils/audio"
import { LocalStoreKeys, localStore } from "./utils/store"
import { FIREBASE_CONFIG } from "./utils/utils"
import { GameMode } from "../../../types/enum/Game"
import "./preparation.css"

export default function Preparation() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const client: Client = useAppSelector((state) => state.network.client)
  const room: Room<PreparationState> | undefined = useAppSelector(
    (state) => state.network.preparation
  )
  const initialized = useRef<boolean>(false)
  const [toGame, setToGame] = useState<boolean>(false)
  const [toAuth, setToAuth] = useState<boolean>(false)
  const [toLobby, setToLobby] = useState<boolean>(false)
  const connectingToGame = useRef<boolean>(false)

  useEffect(() => {
    const reconnect = async () => {
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG)
      }

      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          dispatch(logIn(user))
          try {
            if (!initialized.current) {
              initialized.current = true
              const cachedReconnectionToken = localStore.get(
                LocalStoreKeys.RECONNECTION_TOKEN
              )
              if (cachedReconnectionToken) {
                const r: Room<PreparationState> = await client.reconnect(
                  cachedReconnectionToken
                )
                localStore.set(
                  LocalStoreKeys.RECONNECTION_TOKEN,
                  r.reconnectionToken,
                  30
                )
                await initialize(r, user.uid)
                dispatch(joinPreparation(r))
              }
            }
          } catch (error) {
            setToAuth(true)
            logger.error(error)
          }
        } else {
          setToAuth(true)
        }
      })
    }

    const initialize = async (r: Room<PreparationState>, uid: string) => {
      r.state.users.forEach((u) => {
        dispatch(addUser(u))
      })

      r.state.listen("gameStarted", (value, previousValue) => {
        dispatch(setGameStarted(value))
      })

      r.state.listen("ownerId", (value, previousValue) => {
        dispatch(setOwnerId(value))
      })

      r.state.listen("ownerName", (value, previousValue) => {
        dispatch(setOwnerName(value))
      })

      r.state.listen("name", (value, previousValue) => {
        dispatch(setName(value))
      })

      r.state.listen("password", (value, previousValue) => {
        dispatch(setPassword(value))
      })

      r.state.listen("noElo", (value, previousValue) => {
        dispatch(setNoELO(value))
      })

      r.state.listen("whitelist", (value, previousValue) => {
        dispatch(setWhiteList(value))
      })

      r.state.listen("blacklist", (value, previousValue) => {
        dispatch(setBlackList(value))
      })

      r.state.listen("gameMode", (value, previousValue) => {
        dispatch(setGameMode(value))
        if (value !== GameMode.NORMAL) {
          dispatch(toggleReady(true)) // automatically set users ready in non-classic game mode
        }
      })

      r.state.users.onAdd((u) => {
        dispatch(addUser(u))

        if (u.id === uid) {
          dispatch(setUser(u))
        } else if (!u.isBot) {
          playSound(SOUNDS.JOIN_ROOM)
        }

        const fields: NonFunctionPropNames<GameUser>[] = [
          "anonymous",
          "avatar",
          "elo",
          "id",
          "isBot",
          "map",
          "name",
          "role",
          "title",
          "ready"
        ]

        fields.forEach((field) => {
          u.listen(field, (value, previousValue) => {
            if (field === "ready" && value) {
              playSound(SOUNDS.SET_READY)
            }
            dispatch(changeUser({ id: u.id, field: field, value: value }))
          })
        })
      })
      r.state.users.onRemove((u) => {
        dispatch(removeUser(u.id))
        if (!u.isBot && u.id !== uid && !connectingToGame.current) {
          playSound(SOUNDS.LEAVE_ROOM)
        }
      })

      r.state.messages.onAdd((m) => {
        dispatch(pushMessage(m))
      })
      r.state.messages.onRemove((m) => {
        dispatch(removeMessage(m))
      })

      r.onMessage(Transfer.KICK, async () => {
        await r.leave(false)
        localStore.delete(LocalStoreKeys.RECONNECTION_TOKEN)
        dispatch(leavePreparation())
        setToLobby(true)
        playSound(SOUNDS.LEAVE_ROOM)
      })

      r.onMessage(Transfer.REQUEST_BOT_LIST, (bots: IBot[]) => {
        dispatch(setBotsList(bots))
      })

      r.onMessage(Transfer.GAME_START, async (roomId) => {
        const token = await firebase.auth().currentUser?.getIdToken()
        if (token && !connectingToGame.current) {
          playSound(SOUNDS.START_GAME)
          connectingToGame.current = true
          const game: Room<GameState> = await client.joinById(roomId, {
            idToken: token
          })
          localStore.set(
            LocalStoreKeys.RECONNECTION_TOKEN,
            game.reconnectionToken,
            5 * 60
          ) // 5 minutes allowed to start game
          await r.leave()
          game.connection.close()
          dispatch(leavePreparation())
          setToGame(true)
        }
      })

      r.onMessage(Transfer.USER_PROFILE, (user: IUserMetadata) => {
        dispatch(setProfile(user))
      })
    }

    if (!initialized.current) {
      reconnect()
    }
  })

  if (toGame) {
    return <Navigate to="/game" />
  }
  if (toAuth) {
    return <Navigate to="/" />
  }
  if (toLobby) {
    return <Navigate to="/lobby" />
  } else {
    return (
      <div className="preparation-page">
        <MainSidebar
          page="preparation"
          leaveLabel={t("leave_room")}
          leave={async () => {
            await room?.leave(true)
            localStore.delete(LocalStoreKeys.RECONNECTION_TOKEN)
            dispatch(leavePreparation())
            setToLobby(true)
            playSound(SOUNDS.LEAVE_ROOM)
          }}
        />
        <main>
          <PreparationMenu />
          <Chat source="preparation" />
        </main>
      </div>
    )
  }
}
