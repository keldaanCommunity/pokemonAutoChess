import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { Booster } from "../../../types/Booster"

export interface IUserBoostersState {
  boosterContent: Booster
  lastBoostersOpened: Booster[]
}

const initialState: IUserBoostersState = {
  boosterContent: [],
  lastBoostersOpened: []
}

export const boostersSlice = createSlice({
  name: "boosters",
  initialState,
  reducers: {
    setBoosterContent: (state, action: PayloadAction<Booster>) => {
      state.boosterContent = action.payload
      state.lastBoostersOpened.push([...action.payload])
    },
    resetLastBoostersOpened: (state) => {
      state.lastBoostersOpened = []
    },
    resetBoosters: () => initialState
  }
})

export const { setBoosterContent, resetLastBoostersOpened, resetBoosters } =
  boostersSlice.actions

export default boostersSlice.reducer
