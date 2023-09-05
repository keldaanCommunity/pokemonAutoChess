import React, { useEffect, useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import AfterMenu from "./component/after/after-menu"
import { Client, Room } from "colyseus.js"
import { useAppDispatch, useAppSelector } from "../hooks"
import AfterGameState from "../../../rooms/states/after-game-state"
import firebase from "firebase/compat/app"
import { FIREBASE_CONFIG } from "./utils/utils"
import { joinAfter, logIn } from "../stores/NetworkStore"
import {
  addPlayer,
  leaveAfter,
  setElligibilityToELO,
  setElligibilityToXP
} from "../stores/AfterGameStore"
import { playSound, SOUNDS } from "./utils/audio"
import { localStore, LocalStoreKeys } from "./utils/store"

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
              LocalStoreKeys.RECONNECTION_TOKEN
            )
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
                LocalStoreKeys.RECONNECTION_TOKEN
              )
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

    const initialize = async (r: Room<AfterGameState>) => {
      localStore.set(LocalStoreKeys.RECONNECTION_TOKEN, r.reconnectionToken, 30)
      r.state.players.onAdd((player) => {
        dispatch(addPlayer(player))
        if (player.id === currentPlayerId) {
          playSound(SOUNDS["FINISH" + player.rank])
        }
      })
      r.state.listen("elligibleToELO", (value, previousValue) => {
        dispatch(setElligibilityToELO(value))
      })
      r.state.listen("elligibleToXP", (value, previousValue) => {
        dispatch(setElligibilityToXP(value))
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
            if (room) {
              room.connection.close()
            }
            dispatch(leaveAfter())
            localStore.delete(LocalStoreKeys.RECONNECTION_TOKEN)
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
