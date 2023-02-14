import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { GameUser, IGameUser } from "../../../models/colyseus-models/game-user"
import { IMessage } from "../../../types"

interface IUserPreparationState {
  users: IGameUser[]
  gameStarted: boolean
  ownerId: string
  ownerName: string
  messages: IMessage[]
  name: string
  password: string | null
  user: GameUser | undefined
}

const initialState: IUserPreparationState = {
  users: [],
  gameStarted: false,
  ownerId: "",
  ownerName: "",
  messages: [],
  name: "",
  user: undefined,
  password: null
}

export const preparationSlice = createSlice({
  name: "preparation",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<GameUser>) => {
      const u: GameUser = JSON.parse(JSON.stringify(action.payload))
      state.user = u
    },
    pushMessage: (state, action: PayloadAction<IMessage>) => {
      const m: IMessage = JSON.parse(JSON.stringify(action.payload))
      state.messages.push(m)
    },
    addUser: (state, action: PayloadAction<IGameUser>) => {
      const u: IGameUser = JSON.parse(JSON.stringify(action.payload))
      state.users.push(u)
    },
    changeUser: (
      state,
      action: PayloadAction<{ id: string; field: string; value: any }>
    ) => {
      state.users[state.users.findIndex((u) => u.id == action.payload.id)][
        action.payload.field
      ] = action.payload.value
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users.splice(
        state.users.findIndex((u) => u.id == action.payload),
        1
      )
    },
    setGameStarted: (state, action: PayloadAction<boolean>) => {
      state.gameStarted = action.payload
    },
    setOwnerId: (state, action: PayloadAction<string>) => {
      state.ownerId = action.payload
    },
    setOwnerName: (state, action: PayloadAction<string>) => {
      state.ownerName = action.payload
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload
    },
    setPassword: (state, action: PayloadAction<string | null>) => {
      state.password = action.payload
    },
    leavePreparation: () => initialState
  }
})

export const {
  setUser,
  setName,
  pushMessage,
  addUser,
  changeUser,
  removeUser,
  setGameStarted,
  setOwnerId,
  setOwnerName,
  setPassword,
  leavePreparation
} = preparationSlice.actions

export default preparationSlice.reducer
