import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IAfterGamePlayer } from "../../../types"

export interface IUserAfterState {
  players: IAfterGamePlayer[]
  elligibleToXP: boolean
  elligibleToELO: boolean
}

const initialState: IUserAfterState = {
  players: new Array<IAfterGamePlayer>(),
  elligibleToXP: false,
  elligibleToELO: false
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
    }
  }
})

export const {
  addPlayer,
  leaveAfter,
  setElligibilityToXP,
  setElligibilityToELO
} = afterSlice.actions

export default afterSlice.reducer
