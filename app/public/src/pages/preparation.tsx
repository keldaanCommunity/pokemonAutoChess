import React, { useEffect, useRef, useState } from "react"
import Chat from "./component/chat/chat"
import PreparationMenu from "./component/preparation/preparation-menu"
import { Link, Navigate } from "react-router-dom"
import firebase from "firebase/compat/app"
import { FIREBASE_CONFIG } from "./utils/utils"
import PreparationState from "../../../rooms/states/preparation-state"
import { useAppDispatch, useAppSelector } from "../hooks"
import { Client, Room } from "colyseus.js"
import { gameStart, joinPreparation, logIn } from "../stores/NetworkStore"
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
  setUser
} from "../stores/PreparationStore"
import GameState from "../../../rooms/states/game-state"
import { Transfer } from "../../../types"
import "./preparation.css"
import { playSound, SOUNDS } from "./utils/audio"
import { IBot } from "../../../models/mongo-models/bot-v2"
import { logger } from "../../../utils/logger"

export default function Preparation() {
  const dispatch = useAppDispatch()
  const client: Client = useAppSelector((state) => state.network.client)
  const room: Room<PreparationState> | undefined = useAppSelector(
    (state) => state.network.preparation
  )
  const [initialized, setInitialized] = useState<boolean>(false)
  const [toGame, setToGame] = useState<boolean>(false)
  const [toAuth, setToAuth] = useState<boolean>(false)
  const [toLobby, setToLobby] = useState<boolean>(false)
  const connectingToGame = useRef<boolean>(false)

  useEffect(() => {
    const reconnect = async () => {
      setInitialized(true)
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG)
      }

      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          dispatch(logIn(user))
          try {
            const cachedReconnectionToken = localStorage.getItem(
              "cachedReconnectionToken"
            )
            if (cachedReconnectionToken) {
              const r: Room<PreparationState> = await client.reconnect(
                cachedReconnectionToken
              )
              await initialize(r, user.uid)
              dispatch(joinPreparation(r))
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
      r.state.onChange((changes) => {
        changes.forEach((change) => {
          if (change.field == "gameStarted") {
            dispatch(setGameStarted(change.value))
          } else if (change.field == "ownerId") {
            dispatch(setOwnerId(change.value))
          } else if (change.field == "ownerName") {
            dispatch(setOwnerName(change.value))
          } else if (change.field == "name") {
            dispatch(setName(change.value))
          } else if (change.field == "password") {
            dispatch(setPassword(change.value))
          } else if (change.field == "noElo") {
            dispatch(setNoELO(change.value))
          }
        })
      })
      r.state.users.onAdd((u) => {
        dispatch(addUser(u))

        if (u.id === uid) {
          dispatch(setUser(u))
        } else if (!u.isBot) {
          playSound(SOUNDS.JOIN_ROOM)
        }

        u.onChange((changes) => {
          changes.forEach((change) => {
            dispatch(
              changeUser({ id: u.id, field: change.field, value: change.value })
            )
            if (change.field === "ready" && change.value === true) {
              playSound(SOUNDS.SET_READY)
            }
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
        dispatch(leavePreparation())
        setToLobby(true)
        playSound(SOUNDS.LEAVE_ROOM)
      })

      r.onMessage(Transfer.REQUEST_BOT_LIST, (bots: IBot[]) => {
        dispatch(setBotsList(bots))
      })

      r.onMessage(Transfer.GAME_START_REQUEST, async (message) => {
        const token = await firebase.auth().currentUser?.getIdToken()
        if (message === "ok" && token && !connectingToGame.current) {
          const game: Room<GameState> = await client.create("game", {
            users: r.state.users,
            idToken: token,
            name: r.state.name,
            preparationId: r.id,
            noElo: r.state.noElo
          })

          dispatch(gameStart(game.id))
          playSound(SOUNDS.START_GAME)
          localStorage.setItem(
            "cachedReconnectionToken",
            game.reconnectionToken
          )
          await r.leave()
          game.connection.close()
          dispatch(leavePreparation())
          setToGame(true)
        }
      })

      r.onMessage(Transfer.GAME_START, async (message) => {
        const token = await firebase.auth().currentUser?.getIdToken()
        if (token && !connectingToGame.current) {
          playSound(SOUNDS.START_GAME)
          connectingToGame.current = true
          const game: Room<GameState> = await client.joinById(message.id, {
            idToken: token
          })
          localStorage.setItem(
            "cachedReconnectionToken",
            game.reconnectionToken
          )
          await r.leave()
          game.connection.close()
          dispatch(leavePreparation())
          setToGame(true)
        }
      })
    }

    if (!initialized) {
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
        <nav>
          <Link to="/lobby" style={{ textDecoration: "none" }}>
            <button
              className="bubbly blue"
              onClick={async () => {
                dispatch(leavePreparation())
                room?.connection.close()
              }}
            >
              Return to Lobby
            </button>
          </Link>
        </nav>
        <main>
          <PreparationMenu setToGame={setToGame} />
          <Chat source="preparation" />
        </main>
      </div>
    )
  }
}
