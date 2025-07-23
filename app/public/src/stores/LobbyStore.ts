import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RoomAvailable } from "colyseus.js"
import Message from "../../../models/colyseus-models/message"
import {
  TournamentBracketSchema,
  TournamentSchema
} from "../../../models/colyseus-models/tournament"
import {
  IChatV2,
  IGameMetadata,
  IPreparationMetadata,
  ISuggestionUser
} from "../../../types"
import type { Booster } from "../../../types/Booster"
import { Language } from "../../../types/enum/Language"
import {
  ILeaderboardBotInfo,
  ILeaderboardEventInfo,
  ILeaderboardInfo
} from "../../../types/interfaces/LeaderboardInfo"
import { IUserMetadataClient } from "../../../types/interfaces/UserMetadata"

export interface IUserLobbyState {
  messages: IChatV2[]
  leaderboard: ILeaderboardInfo[]
  botLeaderboard: ILeaderboardBotInfo[]
  levelLeaderboard: ILeaderboardInfo[]
  eventLeaderboard: ILeaderboardEventInfo[]
  user: IUserMetadataClient | undefined
  searchedUser: IUserMetadataClient | undefined
  tabIndex: number
  preparationRooms: RoomAvailable[]
  gameRooms: RoomAvailable[]
  boosterContent: Booster
  suggestions: ISuggestionUser[]
  language: Language
  tournaments: TournamentSchema[]
  ccu: number
}

const initialState: IUserLobbyState = {
  language: Language.en,
  suggestions: [],
  boosterContent: [],
  messages: [],
  leaderboard: [],
  botLeaderboard: [],
  levelLeaderboard: [],
  eventLeaderboard: [],
  user: undefined,
  tabIndex: 0,
  preparationRooms: [],
  gameRooms: [],
  searchedUser: undefined,
  tournaments: [],
  ccu: 0
}

export const lobbySlice = createSlice({
  name: "lobby",
  initialState: initialState,
  reducers: {
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
    setEventLeaderboard: (
      state,
      action: PayloadAction<ILeaderboardEventInfo[]>
    ) => {
      state.eventLeaderboard = action.payload
    },
    setTabIndex: (state, action: PayloadAction<number>) => {
      state.tabIndex = action.payload
    },
    setCcu: (state, action: PayloadAction<number>) => {
      state.ccu = action.payload
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
    setSearchedUser: (
      state,
      action: PayloadAction<IUserMetadataClient | undefined>
    ) => {
      state.searchedUser = action.payload
      state.suggestions = []
    },
    setBoosterContent: (state, action: PayloadAction<Booster>) => {
      state.boosterContent = action.payload
    },
    setSuggestions: (state, action: PayloadAction<ISuggestionUser[]>) => {
      state.suggestions = action.payload
    },
    resetLobby: () => initialState,
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
  removeMessage,
  setBoosterContent,
  pushMessage,
  setLeaderboard,
  setBotLeaderboard,
  setLevelLeaderboard,
  setEventLeaderboard,
  setTabIndex,
  addRoom,
  removeRoom,
  setCcu,
  setSearchedUser,
  resetLobby,
  setSuggestions,
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
