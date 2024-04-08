import { User } from "@firebase/auth-types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Client, Room } from "colyseus.js"
import { IBot } from "../../../models/mongo-models/bot-v2"
import { IUserMetadata } from "../../../models/mongo-models/user-metadata"
import AfterGameState from "../../../rooms/states/after-game-state"
import GameState from "../../../rooms/states/game-state"
import PreparationState from "../../../rooms/states/preparation-state"
import {
  Emotion,
  ICustomLobbyState,
  Role,
  Title,
  Transfer
} from "../../../types"
import { DungeonPMDO } from "../../../types/enum/Dungeon"
import { BotDifficulty } from "../../../types/enum/Game"
import { Item } from "../../../types/enum/Item"
import { Language } from "../../../types/enum/Language"
import { PkmProposition } from "../../../types/enum/Pokemon"

export interface INetwork {
  client: Client
  lobby: Room<ICustomLobbyState> | undefined
  preparation: Room<PreparationState> | undefined
  game: Room<GameState> | undefined
  after: Room<AfterGameState> | undefined
  uid: string
  displayName: string
  profile: IUserMetadata | undefined
}

const endpoint = `${window.location.protocol.replace("http", "ws")}//${
  window.location.host
}`

const initalState: INetwork = {
  client: new Client(endpoint),
  lobby: undefined,
  preparation: undefined,
  game: undefined,
  after: undefined,
  uid: "",
  displayName: "",
  profile: undefined
}

export const networkSlice = createSlice({
  name: "network",
  initialState: initalState,
  reducers: {
    logIn: (state, action: PayloadAction<User>) => {
      if (action.payload) {
        state.uid = action.payload.uid
        state.displayName = action.payload.displayName
          ? action.payload.displayName
          : ""
      }
    },
    logOut: (state) => {
      state.client = new Client(endpoint)
      state.uid = ""
      state.displayName = ""
      state.preparation?.connection.close()
      state.preparation = undefined
      state.lobby?.connection.close()
      state.lobby = undefined
      state.game?.connection.close()
      state.game = undefined
      state.after?.connection.close()
      state.after = undefined
    },
    setProfile: (state, action: PayloadAction<IUserMetadata>) => {
      state.profile = action.payload
    },
    joinLobby: (state, action: PayloadAction<Room<ICustomLobbyState>>) => {
      state.lobby = action.payload
      state.preparation?.connection.close()
      state.preparation = undefined
      state.game?.connection.close()
      state.game = undefined
      state.after?.connection.close()
      state.after = undefined
    },
    joinPreparation: (state, action: PayloadAction<Room<PreparationState>>) => {
      state.preparation = action.payload
      state.lobby?.connection.close()
      state.lobby = undefined
      state.game?.connection.close()
      state.game = undefined
      state.after?.connection.close()
      state.after = undefined
    },
    joinGame: (state, action: PayloadAction<Room<GameState>>) => {
      Object.assign(state, { game: action.payload })
      state.preparation?.connection.close()
      state.preparation = undefined
      state.lobby?.connection.close()
      state.lobby = undefined
      state.after?.connection.close()
      state.after = undefined
    },
    joinAfter: (state, action: PayloadAction<Room<AfterGameState>>) => {
      state.after = action.payload
      state.game?.connection.close()
      state.game = undefined
      state.lobby?.connection.close()
      state.lobby = undefined
      state.preparation?.connection.close()
      state.preparation = undefined
    },
    sendMessage: (state, action: PayloadAction<string>) => {
      if (state.lobby) {
        state.lobby.send(Transfer.NEW_MESSAGE, action.payload)
      }
      if (state.preparation) {
        state.preparation.send(Transfer.NEW_MESSAGE, action.payload)
      }
    },
    removeMessage: (state, action: PayloadAction<{ id: string }>) => {
      if (state.lobby) {
        state.lobby.send(Transfer.REMOVE_MESSAGE, action.payload)
      }
      if (state.preparation) {
        state.preparation.send(Transfer.REMOVE_MESSAGE, action.payload)
      }
    },
    searchName: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.SEARCH, { name: action.payload })
    },
    changeName: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.CHANGE_NAME, { name: action.payload })
    },
    changeAvatar: (
      state,
      action: PayloadAction<{ index: string; emotion: Emotion; shiny: boolean }>
    ) => {
      state.lobby?.send(Transfer.CHANGE_AVATAR, action.payload)
    },
    requestBotList: (
      state,
      action: PayloadAction<{ withSteps: boolean } | undefined>
    ) => {
      state.lobby?.send(Transfer.REQUEST_BOT_LIST, action.payload)
    },
    createBot: (state, action: PayloadAction<IBot>) => {
      state.lobby?.send(Transfer.BOT_CREATION, { bot: action.payload })
    },
    requestBotData: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.REQUEST_BOT_DATA, action.payload)
    },
    requestLeaderboard: (state) => {
      state.lobby?.send(Transfer.REQUEST_LEADERBOARD)
    },
    requestBotLeaderboard: (state) => {
      state.lobby?.send(Transfer.REQUEST_BOT_LEADERBOARD)
    },
    requestLevelLeaderboard: (state) => {
      state.lobby?.send(Transfer.REQUEST_LEVEL_LEADERBOARD)
    },
    addBot: (state, action: PayloadAction<BotDifficulty | IBot>) => {
      state.preparation?.send(Transfer.ADD_BOT, action.payload)
    },
    removeBot: (state, action: PayloadAction<string>) => {
      state.preparation?.send(Transfer.REMOVE_BOT, action.payload)
    },
    listBots: (state) => {
      state.preparation?.send(Transfer.REQUEST_BOT_LIST)
    },
    toggleReady: (state) => {
      state.preparation?.send(Transfer.TOGGLE_READY)
    },
    toggleEloRoom: (state, action: PayloadAction<boolean>) => {
      state.preparation?.send(Transfer.TOGGLE_NO_ELO, action.payload)
    },
    requestTilemap: (state) => {
      state.game?.send(Transfer.REQUEST_TILEMAP)
    },
    selectTilemap: (state, action: PayloadAction<DungeonPMDO | "random">) => {
      state.preparation?.send(Transfer.SELECT_TILEMAP, action.payload)
    },
    refreshClick: (state) => {
      state.game?.send(Transfer.REFRESH)
    },
    lockClick: (state) => {
      state.game?.send(Transfer.LOCK)
    },
    levelClick: (state) => {
      state.game?.send(Transfer.LEVEL_UP)
    },
    shopClick: (state, action: PayloadAction<number>) => {
      state.game?.send(Transfer.SHOP, { id: action.payload })
    },
    pokemonPropositionClick: (state, action: PayloadAction<PkmProposition>) => {
      state.game?.send(Transfer.POKEMON_PROPOSITION, action.payload)
    },
    itemClick: (state, action: PayloadAction<Item>) => {
      state.game?.send(Transfer.ITEM, action.payload)
    },
    gameStartRequest: (state, action: PayloadAction<string>) => {
      state.preparation?.send(Transfer.GAME_START_REQUEST, {
        token: action.payload
      })
    },
    changeRoomName: (state, action: PayloadAction<string>) => {
      state.preparation?.send(Transfer.CHANGE_ROOM_NAME, action.payload)
    },
    changeRoomPassword: (state, action: PayloadAction<string | null>) => {
      state.preparation?.send(Transfer.CHANGE_ROOM_PASSWORD, action.payload)
    },
    changeSelectedEmotion: (
      state,
      action: PayloadAction<{ index: string; emotion: Emotion; shiny: boolean }>
    ) => {
      state.lobby?.send(Transfer.CHANGE_SELECTED_EMOTION, action.payload)
    },
    buyEmotion: (
      state,
      action: PayloadAction<{ index: string; emotion: Emotion; shiny: boolean }>
    ) => {
      state.lobby?.send(Transfer.BUY_EMOTION, action.payload)
    },
    buyBooster: (state, action: PayloadAction<{ index: string }>) => {
      state.lobby?.send(Transfer.BUY_BOOSTER, action.payload)
    },
    openBooster: (state) => {
      state.lobby?.send(Transfer.OPEN_BOOSTER)
    },
    toggleAnimation: (state, action: PayloadAction<string | undefined>) => {
      state.game?.send(Transfer.TOGGLE_ANIMATION, action.payload)
    },
    searchById: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.SEARCH_BY_ID, action.payload)
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.SET_TITLE, action.payload)
    },
    removeTournament: (state, action: PayloadAction<{ id: string }>) => {
      state.lobby?.send(Transfer.REMOVE_TOURNAMENT, action.payload)
    },
    createTournamentLobbies: (state, action: PayloadAction<{ id: string }>) => {
      state.lobby?.send(Transfer.REMAKE_TOURNAMENT_LOBBIES, action.payload)
    },
    participateInTournament: (
      state,
      action: PayloadAction<{ tournamentId: string; participate: boolean }>
    ) => {
      state.lobby?.send(Transfer.PARTICIPATE_TOURNAMENT, action.payload)
    },
    giveBooster: (
      state,
      action: PayloadAction<{ uid: string; numberOfBoosters: number }>
    ) => {
      state.lobby?.send(Transfer.GIVE_BOOSTER, action.payload)
    },
    giveRole: (state, action: PayloadAction<{ uid: string; role: Role }>) => {
      state.lobby?.send(Transfer.SET_ROLE, action.payload)
    },
    giveTitle: (
      state,
      action: PayloadAction<{ uid: string; title: Title }>
    ) => {
      state.lobby?.send(Transfer.GIVE_TITLE, action.payload)
    },
    kick: (state, action: PayloadAction<string>) => {
      state.preparation?.send(Transfer.KICK, action.payload)
    },
    deleteRoom: (state) => {
      state.preparation?.send(Transfer.DELETE_ROOM)
    },
    ban: (
      state,
      action: PayloadAction<{ uid: string; name: string; reason: string }>
    ) => {
      state.lobby?.send(Transfer.BAN, action.payload)
    },
    unban: (state, action: PayloadAction<{ uid: string; name: string }>) => {
      state.lobby?.send(Transfer.UNBAN, action.payload)
    },
    deleteBotDatabase: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.DELETE_BOT_DATABASE, action.payload)
    },
    addBotDatabase: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.ADD_BOT_DATABASE, action.payload)
    },
    selectLanguage: (state, action: PayloadAction<Language>) => {
      state.lobby?.send(Transfer.SELECT_LANGUAGE, action.payload)
    },
    makeServerAnnouncement: (
      state,
      action: PayloadAction<{ message: string }>
    ) => {
      state.lobby?.send(Transfer.SERVER_ANNOUNCEMENT, action.payload)
    },
    createTournament: (state, action: PayloadAction<{ name: string, startDate: string }>) => {
      state.lobby?.send(Transfer.NEW_TOURNAMENT, action.payload)
    }
  }
})

export const {
  selectLanguage,
  unban,
  deleteBotDatabase,
  addBotDatabase,
  ban,
  pokemonPropositionClick,
  requestLeaderboard,
  requestBotLeaderboard,
  requestLevelLeaderboard,
  giveTitle,
  giveRole,
  removeMessage,
  removeTournament,
  createTournamentLobbies,
  participateInTournament,
  giveBooster,
  toggleAnimation,
  openBooster,
  changeSelectedEmotion,
  buyEmotion,
  buyBooster,
  changeRoomName,
  changeRoomPassword,
  gameStartRequest,
  logIn,
  logOut,
  setProfile,
  joinLobby,
  sendMessage,
  searchName,
  joinPreparation,
  joinGame,
  joinAfter,
  changeName,
  changeAvatar,
  requestBotList,
  createBot,
  requestBotData,
  addBot,
  removeBot,
  listBots,
  toggleReady,
  toggleEloRoom,
  requestTilemap,
  selectTilemap,
  itemClick,
  shopClick,
  levelClick,
  lockClick,
  refreshClick,
  searchById,
  setTitle,
  kick,
  deleteRoom,
  makeServerAnnouncement,
  createTournament
} = networkSlice.actions

export default networkSlice.reducer
