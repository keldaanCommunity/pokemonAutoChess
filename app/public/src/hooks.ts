import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
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
