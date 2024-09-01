import { Client, Room } from "colyseus.js"
import { type NonFunctionPropNames } from "@colyseus/schema/lib/types/HelperTypes"
import firebase from "firebase/compat/app"
import React, { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { GameUser } from "../../../models/colyseus-models/game-user"
import { IUserMetadata } from "../../../models/mongo-models/user-metadata"
import GameState from "../../../rooms/states/game-state"
import PreparationState from "../../../rooms/states/preparation-state"
import { Transfer } from "../../../types"
import { CloseCodes, CloseCodesMessages } from "../../../types/enum/CloseCodes"
import { logger } from "../../../utils/logger"
import { useAppDispatch, useAppSelector } from "../hooks"
import {
  joinPreparation,
  logIn,
  setErrorAlertMessage,
  setProfile
} from "../stores/NetworkStore"
import {
  addUser,
  changeUser,
  leavePreparation,
  pushMessage,
  removeMessage,
  removeUser,
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
import "./preparation.css"

export default function Preparation() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const client: Client = useAppSelector((state) => state.network.client)
  const room: Room<PreparationState> | undefined = useAppSelector(
    (state) => state.network.preparation
  )
  const user = useAppSelector((state) => state.preparation.user)
  const initialized = useRef<boolean>(false)
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
                let r: Room<PreparationState>
                try {
                  r = await client.reconnect(
                    cachedReconnectionToken
                  )
                  if (r.name === "game") {
                    if (r.connection.isOpen) {
                      r.connection.close()
                    }
                    navigate("/game")
                    return
                  } else if (r.name !== "preparation") {
                    if (r.connection.isOpen) {
                      r.connection.close()
                    }
                    throw new Error("Preparation: Wrong room type.")
                  }
                } catch (error) {
                  logger.log(error)
                  localStore.delete(LocalStoreKeys.RECONNECTION_TOKEN)
                  navigate("/lobby")
                  return
                }
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
            logger.error(error)
            dispatch(setErrorAlertMessage(t("errors.UNKNOWN_ERROR", { error })))
            navigate("/")
          }
        } else {
          dispatch(setErrorAlertMessage(t("errors.USER_NOT_AUTHENTICATED")))
          navigate("/")
        }
      })
    }

    const initialize = async (r: Room<PreparationState>, uid: string) => {
      r.state.users.forEach((u) => {
        dispatch(addUser(u))
      })

      r.state.listen("gameStartedAt", (value, previousValue) => {
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

      r.onLeave((code) => {
        const shouldGoToLobby = (code === CloseCodes.USER_KICKED || code === CloseCodes.ROOM_DELETED || code === CloseCodes.ROOM_FULL || code === CloseCodes.ROOM_EMPTY || code === CloseCodes.USER_BANNED || code === CloseCodes.USER_RANK_TOO_LOW)
        logger.info(`left preparation room with code ${code}`, { shouldGoToLobby })
        if (shouldGoToLobby) {
          const errorMessage = CloseCodesMessages[code]
          if (errorMessage) {
            dispatch(setErrorAlertMessage(t(`errors.${errorMessage}`)))
          }
          localStore.delete(LocalStoreKeys.RECONNECTION_TOKEN)
          dispatch(leavePreparation())
          navigate("/lobby")
          playSound(SOUNDS.LEAVE_ROOM)
        }
      })

      r.onMessage(Transfer.GAME_START, async (roomId) => {
        const token = await firebase.auth().currentUser?.getIdToken()
        if (token && !connectingToGame.current) {
          playSound(SOUNDS.START_GAME)
          connectingToGame.current = true
          const game: Room<GameState> = await client.joinById(roomId, {
            idToken: token
          })
          localStore.set(LocalStoreKeys.RECONNECTION_GAME, roomId, 60 * 60)
          localStore.set(
            LocalStoreKeys.RECONNECTION_TOKEN,
            game.reconnectionToken,
            5 * 60
          ) // 5 minutes allowed to start game
          if (r.connection.isOpen) {
            await r.leave()
          }
          game.connection.close()
          dispatch(leavePreparation())
          navigate("/game")
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

  return (
    <div className="preparation-page">
      <MainSidebar
        page="preparation"
        leaveLabel={t("leave_room")}
        leave={async () => {
          await room?.leave(true)
          localStore.delete(LocalStoreKeys.RECONNECTION_TOKEN)
          dispatch(leavePreparation())
          navigate("/lobby")
          playSound(SOUNDS.LEAVE_ROOM)
        }}
      />
      <main>
        <PreparationMenu />
        <div className="my-container custom-bg chat-container">
          <h2>{user?.anonymous ? t("chat_disabled_anonymous") : t("chat")}</h2>
          <Chat source="preparation" canWrite={user ? !user.anonymous : false} />
        </div>
      </main>
    </div>
  )
}
