import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { GameUser, IGameUser } from "../../../models/colyseus-models/game-user"
import Message from "../../../models/colyseus-models/message"
import { IChatV2 } from "../../../types"
import { EloRank } from "../../../types/enum/EloRank"
import { GameMode } from "../../../types/enum/Game"
import { SpecialGameRule } from "../../../types/enum/SpecialGameRule"

export interface IUserPreparationState {
  users: IGameUser[]
  gameStartedAt: string | null
  ownerId: string
  ownerName: string
  messages: IChatV2[]
  name: string
  password: string | null
  noElo: boolean
  minRank: EloRank | null
  maxRank: EloRank | null
  user: GameUser | undefined
  gameMode: GameMode
  specialGameRule: SpecialGameRule | null
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
  minRank: null,
  maxRank: null,
  gameMode: GameMode.CUSTOM_LOBBY,
  specialGameRule: null,
  whitelist: [],
  blacklist: []
}

export const preparationSlice = createSlice({
  name: "preparation",
  initialState: initialState,
  reducers: {
    setUser: (state, action: PayloadAction<GameUser>) => {
      const u: GameUser = structuredClone(action.payload)
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
      const u: IGameUser = structuredClone(action.payload)
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
    setSpecialGameRule: (
      state,
      action: PayloadAction<SpecialGameRule | null>
    ) => {
      state.specialGameRule = action.payload
    },
    setMinRank: (state, action: PayloadAction<EloRank | null>) => {
      state.minRank = action.payload
    },
    setMaxRank: (state, action: PayloadAction<EloRank | null>) => {
      state.maxRank = action.payload
    },
    setGameMode: (state, action: PayloadAction<GameMode>) => {
      state.gameMode = action.payload
    },
    resetPreparation: () => initialState,
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
  setMinRank,
  setMaxRank,
  setWhiteList,
  setBlackList,
  setGameMode,
  setSpecialGameRule,
  resetPreparation
} = preparationSlice.actions

export default preparationSlice.reducer
