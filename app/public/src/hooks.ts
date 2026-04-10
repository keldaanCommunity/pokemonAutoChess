import { useEffect, useState } from "react"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { getGameEventResetDate } from "../../config"
import type { AppDispatch, RootState } from "./stores"

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// the player that is currently spectated
export const selectSpectatedPlayer = (state: RootState) =>
  state.game.players.find((p) => p.id === state.game.playerIdSpectated)

// the player that is linked to current user session (undefined when spectating another lobby)
export const selectConnectedPlayer = (state: RootState) =>
  state.game.players.find((p) => p.id === state.network.uid)

export const useGameEventResetCountdown = () => {
  const now = new Date()
  const resetDate = getGameEventResetDate()
  const [resetCountdown, setResetCountdown] = useState(
    Math.round((resetDate.getTime() - now.getTime()) / 1000)
  )

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setResetCountdown(
        Math.round((resetDate.getTime() - now.getTime()) / 1000)
      )
    }, 1000)
    return () => clearInterval(timer)
  }, [resetDate])

  return resetCountdown
}
