import { Client, getStateCallbacks, Room } from "colyseus.js"
import firebase from "firebase/compat/app"
import React, { useEffect, useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import AfterGameState from "../../../rooms/states/after-game-state"
import { useAppDispatch, useAppSelector } from "../hooks"
import { preference } from "../preferences"
import {
  addPlayer,
  leaveAfter,
  setElligibilityToELO,
  setElligibilityToXP,
  setGameMode
} from "../stores/AfterGameStore"
import { joinAfter, logIn } from "../stores/NetworkStore"
import AfterMenu from "./component/after/after-menu"
import { SOUNDS, playSound } from "./utils/audio"
import { LocalStoreKeys, localStore } from "./utils/store"
import { FIREBASE_CONFIG } from "./utils/utils"

export default function AfterGame() {
  const dispatch = useAppDispatch()
  const client: Client = useAppSelector((state) => state.network.client)
  const currentPlayerId: string = useAppSelector((state) => state.network.uid)
  const room: Room<AfterGameState> | undefined = useAppSelector(
    (state) => state.network.after
  )
  const initialized = useRef<boolean>(false)
  const [toLobby, setToLobby] = useState<boolean>(false)
  const [toAuth, setToAuth] = useState<boolean>(false)

  useEffect(() => {
    const reconnect = async () => {
      initialized.current = true
      if (!firebase.apps.length) {
        firebase.initializeApp(FIREBASE_CONFIG)
      }
      firebase.auth().onAuthStateChanged(async (user) => {
        if (user) {
          dispatch(logIn(user))
          try {
            const cachedReconnectionToken = localStore.get(
              LocalStoreKeys.RECONNECTION_AFTER_GAME
            )?.reconnectionToken
            if (cachedReconnectionToken) {
              const r: Room<AfterGameState> = await client.reconnect(
                cachedReconnectionToken
              )
              await initialize(r)
              dispatch(joinAfter(r))
            } else {
              setToLobby(true)
            }
          } catch (error) {
            setTimeout(async () => {
              const cachedReconnectionToken = localStore.get(
                LocalStoreKeys.RECONNECTION_AFTER_GAME
              )?.reconnectionToken
              if (cachedReconnectionToken) {
                const r: Room<AfterGameState> = await client.reconnect(
                  cachedReconnectionToken
                )
                await initialize(r)
                dispatch(joinAfter(r))
              } else {
                setToLobby(true)
              }
            }, 1000)
          }
        } else {
          setToAuth(true)
        }
      })
    }

    const initialize = async (room: Room<AfterGameState>) => {
      localStore.delete(LocalStoreKeys.RECONNECTION_GAME)
      localStore.set(LocalStoreKeys.RECONNECTION_AFTER_GAME, { reconnectionToken: room.reconnectionToken, roomId: room.roomId }, 30)
      const $ = getStateCallbacks(room)
      const $state = $(room.state)
      $state.players.onAdd((player) => {
        dispatch(addPlayer(player))
        if (player.id === currentPlayerId) {
          playSound(SOUNDS["FINISH" + player.rank], preference("musicVolume") / 100)
        }
      })
      $state.listen("elligibleToELO", (value, previousValue) => {
        dispatch(setElligibilityToELO(value))
      })
      $state.listen("elligibleToXP", (value, previousValue) => {
        dispatch(setElligibilityToXP(value))
      })
      $state.listen("gameMode", (value, previousValue) => {
        dispatch(setGameMode(value))
      })
    }

    if (!initialized.current) {
      reconnect()
    }
  })

  if (toLobby) {
    return <Navigate to="/lobby" />
  }
  if (toAuth) {
    return <Navigate to="/auth" />
  } else {
    return (
      <div className="after-game">
        <button
          className="bubbly blue"
          style={{ margin: "10px 0 0 10px" }}
          onClick={() => {
            if (room?.connection.isOpen) {
              room.leave()
            }
            dispatch(leaveAfter())
            localStore.delete(LocalStoreKeys.RECONNECTION_AFTER_GAME)
            setToLobby(true)
          }}
        >
          Back to Lobby
        </button>
        <AfterMenu />
      </div>
    )
  }
}
