import { Client, getStateCallbacks, Room } from "colyseus.js"
import React, { useEffect, useRef, useState } from "react"
import { Navigate } from "react-router-dom"
import AfterGameState from "../../../rooms/states/after-game-state"
import { CloseCodes } from "../../../types/enum/CloseCodes"
import { useAppDispatch, useAppSelector } from "../hooks"
import { authenticateUser } from "../network"
import { preference } from "../preferences"
import {
  addPlayer,
  leaveAfter,
  setElligibilityToELO,
  setElligibilityToXP,
  setGameMode
} from "../stores/AfterGameStore"
import { joinAfter } from "../stores/NetworkStore"
import AfterMenu from "./component/after/after-menu"
import { playSound, SOUNDS } from "./utils/audio"
import { LocalStoreKeys, localStore } from "./utils/store"
import { ConnectionStatus } from "../../../types/enum/ConnectionStatus"
import { setConnectionStatus } from "../stores/NetworkStore"
// UI banner to surface lost/failed connection states to the player
import { ConnectionStatusNotification } from "./component/system/connection-status-notification"
import {
  RECONNECT_BASE_DELAY_MS,
  RECONNECT_JITTER_RATIO,
  RECONNECT_MAX_ATTEMPTS,
  RECONNECT_MAX_DELAY_MS
} from "../../../types/Config"
// Standardized reconnect helpers (backoff + telemetry)
import { backoffDelay, logReconnectTelemetry } from "../utils/reconnect"

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
    // BEFORE: single quick retry with fixed delay.
    // AFTER: exponential backoff with jitter + capped attempts for stability.
    const MAX_ATTEMPTS = RECONNECT_MAX_ATTEMPTS
    const reconnect = async (attempt = 1) => {
      initialized.current = true
      authenticateUser()
        .then(async () => {
          try {
            const cachedReconnectionToken = localStore.get(
              LocalStoreKeys.RECONNECTION_AFTER_GAME
            )?.reconnectionToken
            if (cachedReconnectionToken) {
              logReconnectTelemetry("after", "reconnect_attempt", {
                attempt,
                maxAttempts: MAX_ATTEMPTS
              })
              const r: Room<AfterGameState> = await client.reconnect(
                cachedReconnectionToken
              )
              await initialize(r)
              dispatch(joinAfter(r))
              dispatch(setConnectionStatus(ConnectionStatus.CONNECTED))
              logReconnectTelemetry("after", "reconnect_success", {
                attempt
              })
            } else {
              setToLobby(true)
            }
          } catch (error) {
            if (attempt < MAX_ATTEMPTS) {
              dispatch(setConnectionStatus(ConnectionStatus.CONNECTION_LOST))
              const delay = backoffDelay(
                attempt,
                RECONNECT_BASE_DELAY_MS,
                RECONNECT_MAX_DELAY_MS,
                RECONNECT_JITTER_RATIO
              )
              logReconnectTelemetry("after", "reconnect_attempt", {
                attempt: attempt + 1,
                delay
              })
              setTimeout(async () => reconnect(attempt + 1), delay)
            } else {
              dispatch(setConnectionStatus(ConnectionStatus.CONNECTION_FAILED))
              logReconnectTelemetry("after", "reconnect_failed", {
                lastError: (error as any)?.message
              })
              setToLobby(true)
            }
          }
        })
        .catch((err) => {
          if (err === CloseCodes.USER_NOT_AUTHENTICATED) {
            setToAuth(true)
          }
        })
    }

    const initialize = async (room: Room<AfterGameState>) => {
      localStore.delete(LocalStoreKeys.RECONNECTION_GAME)
      localStore.set(
        LocalStoreKeys.RECONNECTION_AFTER_GAME,
        { reconnectionToken: room.reconnectionToken, roomId: room.roomId },
        30
      )
      const $ = getStateCallbacks(room)
      const $state = $(room.state)
      $state.players.onAdd((player) => {
        dispatch(addPlayer(player))
        if (player.id === currentPlayerId) {
          playSound(
            SOUNDS["FINISH" + player.rank as keyof typeof SOUNDS],
            preference("musicVolume") / 100
          )
        }
      })
      $state.listen("eligibleToELO", (value, previousValue) => {
        dispatch(setElligibilityToELO(value))
      })
      $state.listen("eligibleToXP", (value, previousValue) => {
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
        <ConnectionStatusNotification />
      </div>
    )
  }
}
