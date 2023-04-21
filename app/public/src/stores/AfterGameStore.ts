import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import SimplePlayer from "../../../models/colyseus-models/simple-player"

interface IUserAfterState {
  players: SimplePlayer[]
  noElo: boolean
}

const initialState: IUserAfterState = {
  players: new Array<SimplePlayer>(),
  noElo: false
}

export const afterSlice = createSlice({
  name: "after",
  initialState: initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<SimplePlayer>) => {
      state.players.push(JSON.parse(JSON.stringify(action.payload)))
    },
    leaveAfter: () => initialState,
    setNoELO: (state, action: PayloadAction<boolean>) => {
      state.noElo = action.payload
    },
  }
})

export const { 
  addPlayer,
  leaveAfter,
  setNoELO
} = afterSlice.actions

export default afterSlice.reducer
