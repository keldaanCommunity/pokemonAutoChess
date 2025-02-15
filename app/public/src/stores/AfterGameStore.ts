import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IAfterGamePlayer } from "../../../types"
import { GameMode } from "../../../types/enum/Game"

export interface IUserAfterState {
  players: IAfterGamePlayer[]
  elligibleToXP: boolean
  elligibleToELO: boolean
  gameMode: GameMode
}

const initialState: IUserAfterState = {
  players: new Array<IAfterGamePlayer>(),
  elligibleToXP: false,
  elligibleToELO: false,
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
      state.elligibleToXP = action.payload
    },
    setElligibilityToELO: (state, action: PayloadAction<boolean>) => {
      state.elligibleToELO = action.payload
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
