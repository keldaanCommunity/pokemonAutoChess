import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { GameUser, IGameUser } from "../../../models/colyseus-models/game-user"
import Message from "../../../models/colyseus-models/message"
import { IBot } from "../../../models/mongo-models/bot-v2"
import { IChatV2 } from "../../../types"
import { GameMode } from "../../../types/enum/Game"

export interface IUserPreparationState {
  users: IGameUser[]
  gameStartedAt: string | null
  ownerId: string
  ownerName: string
  messages: IChatV2[]
  name: string
  password: string | null
  noElo: boolean
  user: GameUser | undefined
  gameMode: GameMode
  whitelist: string[]
  blacklist: string[]
}

const initialState: IUserPreparationState = {
  users: [],
  gameStartedAt: null,
  ownerId: "",
  ownerName: "",
  messages: [],
  name: "",
  user: undefined,
  password: null,
  noElo: false,
  gameMode: GameMode.NORMAL,
  whitelist: [],
  blacklist: []
}

export const preparationSlice = createSlice({
  name: "preparation",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<GameUser>) => {
      const u: GameUser = JSON.parse(JSON.stringify(action.payload))
      state.user = u
    },
    pushMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(structuredClone(action.payload))
    },
    removeMessage: (state, action: PayloadAction<Message>) => {
      state.messages = state.messages.filter(
        (m) => m.payload !== action.payload.payload
      )
    },
    addUser: (state, action: PayloadAction<IGameUser>) => {
      const u: IGameUser = JSON.parse(JSON.stringify(action.payload))
      state.users.push(u)
    },
    changeUser: (
      state,
      action: PayloadAction<{ id: string; field: string; value: any }>
    ) => {
      state.users[state.users.findIndex((u) => u.uid == action.payload.id)][
        action.payload.field
      ] = action.payload.value
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users.splice(
        state.users.findIndex((u) => u.uid == action.payload),
        1
      )
    },
    setGameStarted: (state, action: PayloadAction<string | null>) => {
      state.gameStartedAt = action.payload
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
    setNoELO: (state, action: PayloadAction<boolean>) => {
      state.noElo = action.payload
    },
    setGameMode: (state, action: PayloadAction<GameMode>) => {
      state.gameMode = action.payload
    },
    leavePreparation: () => initialState,
    setWhiteList: (state, action: PayloadAction<string[]>) => {
      state.whitelist = action.payload
    },
    setBlackList: (state, action: PayloadAction<string[]>) => {
      state.blacklist = action.payload
    }
  }
})

export const {
  setUser,
  setName,
  pushMessage,
  removeMessage,
  addUser,
  changeUser,
  removeUser,
  setGameStarted,
  setOwnerId,
  setOwnerName,
  setPassword,
  setNoELO,
  setWhiteList,
  setBlackList,
  setGameMode,
  leavePreparation
} = preparationSlice.actions

export default preparationSlice.reducer
