import React, { useEffect, useRef, useState } from "react"
import Chat from "./component/chat/chat"
import PreparationMenu from "./component/preparation/preparation-menu"
import { Navigate } from "react-router-dom"
import firebase from "firebase/compat/app"
import { FIREBASE_CONFIG } from "./utils/utils"
import PreparationState from "../../../rooms/states/preparation-state"
import { useAppDispatch, useAppSelector } from "../hooks"
import { Client, Room } from "colyseus.js"
import { joinPreparation, logIn, setProfile } from "../stores/NetworkStore"
import {
  addUser,
  changeUser,
  leavePreparation,
  pushMessage,
  removeUser,
  setBotsList,
  setGameStarted,
  setName,
  setOwnerId,
  setOwnerName,
  setPassword,
  setNoELO,
  setUser,
  setSelectedMap
} from "../stores/PreparationStore"
import GameState from "../../../rooms/states/game-state"
import { NonFunctionPropNames, Transfer } from "../../../types"
import "./preparation.css"
import { playSound, SOUNDS } from "./utils/audio"
import { IBot } from "../../../models/mongo-models/bot-v2"
import { logger } from "../../../utils/logger"
import { GameUser } from "../../../models/colyseus-models/game-user"
import { MainSidebar } from "./component/main-sidebar"
import { useTranslation } from "react-i18next"
import { PreloadingScene } from "../game/scenes/preloading-scene"
import { localStore, LocalStoreKeys } from "./utils/store"
import { IUserMetadata } from "../../../models/mongo-models/user-metadata"

export default function Preparation() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const client: Client = useAppSelector((state) => state.network.client)
  const room: Room<PreparationState> | undefined = useAppSelector(
    (state) => state.network.preparation
  )
  const initialized = useRef<boolean>(false)
  const preloading = useRef<boolean>(false)
  const [toGame, setToGame] = useState<boolean>(false)
  const [toAuth, setToAuth] = useState<boolean>(false)
  const [toLobby, setToLobby] = useState<boolean>(false)
  const connectingToGame = useRef<boolean>(false)
  const gameRef = useRef<Phaser.Game | null>(null)
  const preloadingScene = useRef<PreloadingScene>()
  const [preloadingMessage, setPreloadingMessage] = useState<string>(
    t("preloading_start")
  )

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

      r.state.listen("selectedMap", (value, previousValue) => {
        dispatch(setSelectedMap(value))
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
      r.onMessage(Transfer.MESSAGES, (message) => {
        dispatch(pushMessage(message))
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

  useEffect(() => {
    if (!preloading.current) {
      preloading.current = true
      preloadingScene.current = new PreloadingScene(
        () =>
          setPreloadingMessage(
            preloadingScene.current?.loadingManager.statusMessage ?? ""
          ),
        () => {
          setPreloadingMessage(t("finished_preloading"))
          gameRef.current?.destroy(true)
          gameRef.current = null
        }
      )
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        scene: [preloadingScene.current],
        backgroundColor: "#000000"
      })
    }
  }, [preloading, t])

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
        <footer>
          <p id="preloading-message">{preloadingMessage}</p>
        </footer>
      </div>
    )
  }
}
