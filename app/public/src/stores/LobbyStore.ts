import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RoomAvailable } from "colyseus.js"
import {
  ILeaderboardBotInfo,
  ILeaderboardInfo
} from "../../../types/interfaces/LeaderboardInfo"
import LobbyUser, {
  ILobbyUser
} from "../../../models/colyseus-models/lobby-user"
import Message from "../../../models/colyseus-models/message"
import {
  TournamentBracketSchema,
  TournamentSchema
} from "../../../models/colyseus-models/tournament"
import { IBot, IStep } from "../../../models/mongo-models/bot-v2"
import { IPokemonConfig } from "../../../models/mongo-models/user-metadata"
import {
  IChatV2,
  IGameMetadata,
  IPreparationMetadata,
  ISuggestionUser,
  PkmWithConfig
} from "../../../types"
import { GameMode } from "../../../types/enum/Game"
import { Language } from "../../../types/enum/Language"
import { MAX_BOTS_STAGE } from "../pages/component/bot-builder/bot-logic"
import { ISpecialGamePlanned } from "../../../types/interfaces/Lobby"

export interface IUserLobbyState {
  botLogDatabase: string[]
  messages: IChatV2[]
  users: ILobbyUser[]
  leaderboard: ILeaderboardInfo[]
  botLeaderboard: ILeaderboardBotInfo[]
  levelLeaderboard: ILeaderboardInfo[]
  user: ILobbyUser | undefined
  searchedUser: ILobbyUser | undefined
  tabIndex: number
  preparationRooms: RoomAvailable[]
  gameRooms: RoomAvailable[]
  botList: IBot[]
  pastebinUrl: string
  botData: IBot
  pokemonCollection: IPokemonConfig[]
  boosterContent: PkmWithConfig[]
  suggestions: ISuggestionUser[]
  language: Language
  nextSpecialGame: ISpecialGamePlanned | null
  tournaments: TournamentSchema[]
}

const initialState: IUserLobbyState = {
  language: Language.en,
  botLogDatabase: [],
  suggestions: [],
  boosterContent: [],
  pokemonCollection: [],
  messages: [],
  users: [],
  leaderboard: [],
  botLeaderboard: [],
  levelLeaderboard: [],
  user: undefined,
  tabIndex: 0,
  preparationRooms: [],
  gameRooms: [],
  searchedUser: undefined,
  botList: [],
  pastebinUrl: "",
  botData: {
    steps: Array.from({ length: MAX_BOTS_STAGE + 1 }, () => ({
      roundsRequired: 1,
      board: []
    })) as IStep[],
    avatar: "ditto",
    author: "",
    elo: 1200,
    name: "ditto",
    id: ""
  },
  nextSpecialGame: null,
  tournaments: []
}

export const lobbySlice = createSlice({
  name: "lobby",
  initialState: initialState,
  reducers: {
    pushBotLog: (state, action: PayloadAction<string>) => {
      state.botLogDatabase.push(action.payload)
    },
    pushMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(structuredClone(action.payload))
    },
    removeMessage: (state, action: PayloadAction<Message>) => {
      state.messages = state.messages.filter(
        (m) => m.payload !== action.payload.payload
      )
    },
    setLeaderboard: (state, action: PayloadAction<ILeaderboardInfo[]>) => {
      state.leaderboard = action.payload
    },
    setBotLeaderboard: (
      state,
      action: PayloadAction<ILeaderboardBotInfo[]>
    ) => {
      state.botLeaderboard = action.payload
    },
    setLevelLeaderboard: (state, action: PayloadAction<ILeaderboardInfo[]>) => {
      state.levelLeaderboard = action.payload
    },
    addPokemonConfig: (state, action: PayloadAction<IPokemonConfig>) => {
      state.pokemonCollection = [...state.pokemonCollection, action.payload]
    },
    changePokemonConfig: (
      state,
      action: PayloadAction<{ id: string; field: string; value: any }>
    ) => {
      const index = state.pokemonCollection.findIndex(
        (p) => p.id === action.payload.id
      )
      const clonedCollection = [...state.pokemonCollection]
      if (index !== -1) {
        clonedCollection[index][action.payload.field] = action.payload.value
        state.pokemonCollection = clonedCollection
      }
    },
    addUser: (state, action: PayloadAction<LobbyUser>) => {
      const u: ILobbyUser = JSON.parse(JSON.stringify(action.payload))
      if (!state.users.find((user) => user.id === u.id)) {
        state.users.push(u)
        state.users.sort((a, b) => b.elo - a.elo)
      }
    },
    changeUser: (
      state,
      action: PayloadAction<{ id: string; field: string; value: any }>
    ) => {
      if (state.user && action.payload.id == state.user.id) {
        state.user[action.payload.field] = action.payload.value
      }
      const index = state.users.findIndex((u) => u.id == action.payload.id)

      if (index != -1) {
        state.users[index][action.payload.field] = action.payload.value
      }
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users.splice(
        state.users.findIndex((u) => u.id == action.payload),
        1
      )
    },
    setUser: (state, action: PayloadAction<LobbyUser>) => {
      const u: ILobbyUser = JSON.parse(JSON.stringify(action.payload))
      state.user = u
    },
    setTabIndex: (state, action: PayloadAction<number>) => {
      state.tabIndex = action.payload
    },
    addRoom: (state, action: PayloadAction<RoomAvailable>) => {
      const metadata: IPreparationMetadata | IGameMetadata =
        action.payload.metadata
      if (metadata && metadata.name) {
        const rooms =
          metadata.type === "preparation"
            ? state.preparationRooms
            : state.gameRooms
        const roomIndex = rooms.findIndex(
          (room) => room.roomId === action.payload.roomId
        )
        if (roomIndex !== -1) {
          rooms[roomIndex] = action.payload
        } else {
          rooms.push(action.payload)
        }
      }
    },
    removeRoom: (state, action: PayloadAction<string>) => {
      state.preparationRooms = state.preparationRooms.filter(
        (room) => room.roomId !== action.payload
      )
      state.gameRooms = state.gameRooms.filter(
        (room) => room.roomId !== action.payload
      )
    },
    setSearchedUser: (state, action: PayloadAction<LobbyUser | undefined>) => {
      state.searchedUser = action.payload
    },
    setBotList: (state, action: PayloadAction<IBot[]>) => {
      state.botList = action.payload
    },
    setPastebinUrl: (state, action: PayloadAction<string>) => {
      state.pastebinUrl = action.payload
    },
    setBotData: (state, action: PayloadAction<IBot>) => {
      state.botData = action.payload
    },
    setBoosterContent: (state, action: PayloadAction<PkmWithConfig[]>) => {
      state.boosterContent = action.payload
    },
    setSuggestions: (state, action: PayloadAction<ISuggestionUser[]>) => {
      state.suggestions = action.payload
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
    },
    leaveLobby: () => initialState,
    setNextSpecialGame: (state, action: PayloadAction<ISpecialGamePlanned>) => {
      state.nextSpecialGame = action.payload
    },
    addTournament: (state, action: PayloadAction<TournamentSchema>) => {
      // remove previous potential duplicate
      state.tournaments = state.tournaments.filter(
        (tournament) => tournament.id !== action.payload.id
      )
      state.tournaments.push(action.payload)
    },
    removeTournament: (state, action: PayloadAction<TournamentSchema>) => {
      state.tournaments = state.tournaments.filter(
        (tournament) => tournament.id !== action.payload.id
      )
    },
    changeTournament: (
      state,
      action: PayloadAction<{ tournamentId: string; field: string; value: any }>
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id == action.payload.tournamentId
      )
      if (tournament) {
        tournament[action.payload.field] = action.payload.value
      }
    },
    updateTournament: (state) => {
      state.tournaments = [...state.tournaments] // TOFIX: force reactivity through immutability
    },
    changeTournamentPlayer: (
      state,
      action: PayloadAction<{
        tournamentId: string
        playerId: string
        field: string
        value: any
      }>
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id == action.payload.tournamentId
      )
      if (tournament && tournament.players.has(action.payload.playerId)) {
        const player = tournament.players.get(action.payload.playerId)!
        player[action.payload.field] = action.payload.value
        state.tournaments = [...state.tournaments] // TOFIX: force reactivity through immutability
      }
    },

    addTournamentBracket: (
      state,
      action: PayloadAction<{
        tournamendId: string
        bracketId: string
        bracket: TournamentBracketSchema
      }>
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id == action.payload.tournamendId
      )
      if (tournament) {
        tournament.brackets.set(
          action.payload.bracketId,
          action.payload.bracket
        )
        state.tournaments = [...state.tournaments] // TOFIX: force reactivity through immutability
      }
    },
    removeTournamentBracket: (
      state,
      action: PayloadAction<{ tournamendId: string; bracketId: string }>
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id == action.payload.tournamendId
      )
      if (tournament) {
        tournament.brackets.delete(action.payload.bracketId)
        state.tournaments = [...state.tournaments] // TOFIX: force reactivity through immutability
      }
    },
    changeTournamentBracket: (
      state,
      action: PayloadAction<{
        tournamentId: string
        bracketId: string
        field: string
        value: any
      }>
    ) => {
      const tournament = state.tournaments.find(
        (t) => t.id == action.payload.tournamentId
      )
      if (tournament && tournament.brackets.has(action.payload.bracketId)) {
        const player = tournament.brackets.get(action.payload.bracketId)!
        player[action.payload.field] = action.payload.value
        state.tournaments = [...state.tournaments] // TOFIX: force reactivity through immutability
      }
    }
  }
})

export const {
  setLanguage,
  removeMessage,
  setBoosterContent,
  addPokemonConfig,
  changePokemonConfig,
  pushMessage,
  setLeaderboard,
  setBotLeaderboard,
  setLevelLeaderboard,
  addUser,
  changeUser,
  removeUser,
  setUser,
  setTabIndex,
  addRoom,
  removeRoom,
  setSearchedUser,
  setBotList,
  setPastebinUrl,
  setBotData,
  leaveLobby,
  setSuggestions,
  pushBotLog,
  setNextSpecialGame,
  addTournament,
  removeTournament,
  changeTournament,
  updateTournament,
  changeTournamentPlayer,
  addTournamentBracket,
  removeTournamentBracket,
  changeTournamentBracket
} = lobbySlice.actions

export default lobbySlice.reducer
