import { Client, getStateCallbacks, Room } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { useCallback, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import type { NonFunctionPropNames } from "../../../types/HelperTypes"
import { GameUser } from "../../../models/colyseus-models/game-user"
import { IUserMetadata } from "../../../models/mongo-models/user-metadata"
import GameState from "../../../rooms/states/game-state"
import PreparationState from "../../../rooms/states/preparation-state"
import { Transfer } from "../../../types"
import { CloseCodes, CloseCodesMessages } from "../../../types/enum/CloseCodes"
import { GameMode } from "../../../types/enum/Game"
import { logger } from "../../../utils/logger"
import { useAppDispatch, useAppSelector } from "../hooks"
import {
  joinPreparation,
  logIn,
  setErrorAlertMessage,
  setProfile,
  toggleReady
} from "../stores/NetworkStore"
import {
  addUser,
  changeUser,
  resetPreparation,
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
  setBlackList,
  setMinRank,
  setMaxRank,
  setSpecialGameRule
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
                LocalStoreKeys.RECONNECTION_PREPARATION
              )?.reconnectionToken
              if (cachedReconnectionToken) {
                let r: Room<PreparationState>
                try {
                  r = await client.reconnect(
                    cachedReconnectionToken
                  )
                  if (r.name !== "preparation") {
                    throw new Error(
                      `Expected to join a preparation room but joined ${r.name} instead`
                    )
                  }
                } catch (error) {
                  logger.error(error)
                  localStore.delete(LocalStoreKeys.RECONNECTION_PREPARATION)
                  dispatch(resetPreparation())
                  navigate("/lobby")
                  return
                }
                localStore.set(
                  LocalStoreKeys.RECONNECTION_PREPARATION,
                  { reconnectionToken: r.reconnectionToken, roomId: r.roomId },
                  30
                )
                await initialize(r, user.uid)
                dispatch(joinPreparation(r))
              } else {
                navigate("/lobby")
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

    const initialize = async (room: Room<PreparationState>, uid: string) => {
      const $ = getStateCallbacks(room)
      const $state = $(room.state)

      $state.listen("gameStartedAt", (value, previousValue) => {
        dispatch(setGameStarted(value))
      })

      $state.listen("ownerId", (value, previousValue) => {
        dispatch(setOwnerId(value))
      })

      $state.listen("ownerName", (value, previousValue) => {
        dispatch(setOwnerName(value))
      })

      $state.listen("name", (value, previousValue) => {
        dispatch(setName(value))
      })

      $state.listen("password", (value, previousValue) => {
        dispatch(setPassword(value))
      })

      $state.listen("noElo", (value, previousValue) => {
        dispatch(setNoELO(value))
      })

      $state.listen("minRank", (value, previousValue) => {
        dispatch(setMinRank(value))
      })

      $state.listen("maxRank", (value, previousValue) => {
        dispatch(setMaxRank(value))
      })

      $state.listen("whitelist", (value, previousValue) => {
        dispatch(setWhiteList(value))
      })

      $state.listen("blacklist", (value, previousValue) => {
        dispatch(setBlackList(value))
      })

      $state.listen("gameMode", (value, previousValue) => {
        dispatch(setGameMode(value))
      })

      $state.listen("specialGameRule", (value, previousValue) => {
        dispatch(setSpecialGameRule(value))
      })

      $state.users.onAdd((user) => {
        dispatch(addUser(user))

        if (user.uid === uid) {
          dispatch(setUser(user))
          if (room.state.gameMode !== GameMode.CUSTOM_LOBBY) {
            dispatch(toggleReady(true)) // automatically set users ready in non-classic game mode
          }
        } else if (!user.isBot) {
          playSound(SOUNDS.JOIN_ROOM)
        }

        const $user = $(user)

        const fields: NonFunctionPropNames<GameUser>[] = [
          "anonymous",
          "avatar",
          "elo",
          "uid",
          "isBot",
          "name",
          "role",
          "title",
          "ready"
        ]

        fields.forEach((field) => {
          $user.listen(field, (value, previousValue) => {
            if (field === "ready" && value) {
              playSound(SOUNDS.SET_READY)
            }
            dispatch(changeUser({ id: user.uid, field: field, value: value }))
          })
        })
      })
      $state.users.onRemove((u) => {
        dispatch(removeUser(u.uid))
        if (!u.isBot && u.uid !== uid && !connectingToGame.current) {
          playSound(SOUNDS.LEAVE_ROOM)
        }
      })

      $state.messages.onAdd((m) => {
        dispatch(pushMessage(m))
      })
      $state.messages.onRemove((m) => {
        dispatch(removeMessage(m))
      })

      room.onLeave((code) => {
        const shouldGoToLobby = [
          CloseCodes.USER_KICKED,
          CloseCodes.ROOM_DELETED,
          CloseCodes.ROOM_FULL,
          CloseCodes.ROOM_EMPTY,
          CloseCodes.USER_BANNED,
          CloseCodes.USER_RANK_TOO_LOW,
          CloseCodes.USER_TIMEOUT
        ].includes(code)

        const shouldReconnect = code === CloseCodes.ABNORMAL_CLOSURE || code === CloseCodes.TIMEOUT
        logger.info(`left preparation room with code ${code}`, { shouldGoToLobby, shouldReconnect })

        if (shouldReconnect) {
          logger.log("Connection closed unexpectedly or timed out. Attempting reconnect.")
          // Restart the expiry timer of the reconnection token for reconnect
          localStore.set(
            LocalStoreKeys.RECONNECTION_PREPARATION,
            { reconnectionToken: room.reconnectionToken, roomId: room.roomId },
            30
          )
          // clearing state variables to re-initialize
          dispatch(resetPreparation())
          initialized.current = false
          reconnect()
        } else {
          localStore.delete(LocalStoreKeys.RECONNECTION_PREPARATION)
          dispatch(resetPreparation())
          if (shouldGoToLobby) {
            const errorMessage = CloseCodesMessages[code]
            if (errorMessage) {
              dispatch(setErrorAlertMessage(t(`errors.${errorMessage}`)))
            }
            navigate("/lobby")
            playSound(SOUNDS.LEAVE_ROOM)
          }
        }
      })

      room.onMessage(Transfer.GAME_START, async (roomId) => {
        const token = await firebase.auth().currentUser?.getIdToken()
        if (token && !connectingToGame.current) {
          playSound(SOUNDS.START_GAME)
          connectingToGame.current = true
          const game: Room<GameState> = await client.joinById(roomId, {
            idToken: token
          })
          localStore.set(
            LocalStoreKeys.RECONNECTION_GAME,
            { reconnectionToken: game.reconnectionToken, roomId: game.roomId },
            5 * 60
          ) // 5 minutes allowed to start game
          await Promise.allSettled([
            room.connection.isOpen && room.leave(),
            game.connection.isOpen && game.leave(false)
          ])
          dispatch(resetPreparation())
          navigate("/game")
        }
      })

      room.onMessage(Transfer.USER_PROFILE, (user: IUserMetadata) => {
        dispatch(setProfile(user))
      })
    }

    if (!initialized.current) {
      reconnect()
    }
  }, [initialized])

  const leavePreparationRoom = useCallback(async () => {
    if (room?.connection.isOpen) {
      await room.leave(true)
    }
    localStore.delete(LocalStoreKeys.RECONNECTION_PREPARATION)
    dispatch(resetPreparation())
    navigate("/lobby")
    playSound(SOUNDS.LEAVE_ROOM)
  }, [room])

  return (
    <div className="preparation-page">
      <MainSidebar
        page="preparation"
        leaveLabel={t("leave_room")}
        leave={leavePreparationRoom}
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
