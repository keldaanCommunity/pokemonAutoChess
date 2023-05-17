import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import SimplePlayer from "../../../models/colyseus-models/simple-player"

interface IUserAfterState {
  players: SimplePlayer[]
  elligibleToXP: boolean
  elligibleToELO: boolean
}

const initialState: IUserAfterState = {
  players: new Array<SimplePlayer>(),
  elligibleToXP: false,
  elligibleToELO: false
}

export const afterSlice = createSlice({
  name: "after",
  initialState: initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<SimplePlayer>) => {
      state.players.push(JSON.parse(JSON.stringify(action.payload)))
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
