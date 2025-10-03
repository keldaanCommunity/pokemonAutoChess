import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IAfterGamePlayer } from "../../../types"
import { GameMode } from "../../../types/enum/Game"

export interface IUserAfterState {
  players: IAfterGamePlayer[]
  eligibleToXP: boolean
  eligibleToELO: boolean
  gameMode: GameMode
}

const initialState: IUserAfterState = {
  players: new Array<IAfterGamePlayer>(),
  eligibleToXP: false,
  eligibleToELO: false,
  gameMode: GameMode.CUSTOM_LOBBY
}

export const afterSlice = createSlice({
  name: "after",
  initialState: initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<IAfterGamePlayer>) => {
      state.players.push(action.payload)
    },
    leaveAfter: () => initialState,
    setElligibilityToXP: (state, action: PayloadAction<boolean>) => {
      state.eligibleToXP = action.payload
    },
    setElligibilityToELO: (state, action: PayloadAction<boolean>) => {
      state.eligibleToELO = action.payload
    },
    setGameMode: (state, action: PayloadAction<GameMode>) => {
      state.gameMode = action.payload
    }
  }
})

export const {
  addPlayer,
  leaveAfter,
  setElligibilityToXP,
  setElligibilityToELO,
  setGameMode
} = afterSlice.actions

export default afterSlice.reducer
