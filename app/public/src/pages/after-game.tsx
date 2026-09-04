import { getStateCallbacks, type Room } from "@colyseus/sdk"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Navigate } from "react-router"
import { GADGETS } from "../../../config/game/gadgets"
import type AfterGameState from "../../../rooms/states/after-game-state"
import { CloseCodes } from "../../../types/enum/CloseCodes"
import { DungeonMusic } from "../../../types/enum/Dungeon"
import { useAppDispatch, useAppSelector } from "../hooks"
import { authenticateUser, client, joinAfter, rooms } from "../network"
import { preference } from "../preferences"
import {
  addPlayer,
  leaveAfter,
  setElligibilityToELO,
  setElligibilityToXP,
  setGameMode
} from "../stores/AfterGameStore"
import AfterMenu from "./component/after/after-menu"
import RecorderEndGame from "./component/replay/recorder-endgame"
import { playSound, SOUNDS } from "./utils/audio"
import { LocalStoreKeys, localStore } from "./utils/store"

export default function AfterGame() {
  const dispatch = useAppDispatch()
  const currentPlayerId: string = useAppSelector((state) => state.network.uid)
  const profile = useAppSelector((state) => state.network.profile)
  const { t } = useTranslation()
  const room: Room<AfterGameState> | undefined = rooms.after
  const initialized = useRef<boolean>(false)
  const [toLobby, setToLobby] = useState<boolean>(false)
  const [toAuth, setToAuth] = useState<boolean>(false)
  const endMusic = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const reconnect = async () => {
      initialized.current = true
      authenticateUser()
        .then(async () => {
          try {
            const cachedReconnectionToken = localStore.get(
              LocalStoreKeys.RECONNECTION_AFTER_GAME
            )?.reconnectionToken
            if (cachedReconnectionToken) {
              const r = await client.reconnect<AfterGameState>(
                cachedReconnectionToken
              )
              await initialize(r)
              joinAfter(r)
            } else {
              setToLobby(true)
            }
          } catch (error) {
            setTimeout(async () => {
              const cachedReconnectionToken = localStore.get(
                LocalStoreKeys.RECONNECTION_AFTER_GAME
              )?.reconnectionToken
              if (cachedReconnectionToken) {
                const r = await client.reconnect<AfterGameState>(
                  cachedReconnectionToken
                )
                await initialize(r)
                joinAfter(r)
              } else {
                setToLobby(true)
              }
            }, 1000)
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
          const jingle = playSound(
            SOUNDS[("FINISH" + player.rank) as keyof typeof SOUNDS],
            preference("musicVolume") / 100
          )

          const music =
            player.rank <= 4
              ? DungeonMusic.AT_THE_END_OF_THE_DAY
              : DungeonMusic.IN_THE_HANDS_OF_FATE
          endMusic.current = new Audio(`assets/musics/ogg/${music}.ogg`)
          endMusic.current.volume = preference("musicVolume") / 300
          jingle?.addEventListener("ended", () =>
            setTimeout(() => endMusic.current?.play(), 1000)
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

    return () => {
      endMusic.current?.pause()
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
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1em",
            gap: "1em"
          }}
        >
          <button
            className="bubbly blue"
            onClick={() => {
              if (room?.connection.isOpen) {
                room.leave()
              }
              dispatch(leaveAfter())
              localStore.delete(LocalStoreKeys.RECONNECTION_AFTER_GAME)
              setToLobby(true)
            }}
          >
            {t("back_to_lobby")}
          </button>
          {profile && profile.level >= GADGETS.recorder.levelRequired && (
            <RecorderEndGame />
          )}
        </nav>
        <AfterMenu />
      </div>
    )
  }
}
