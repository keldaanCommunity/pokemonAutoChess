import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Room, Client } from "colyseus.js"
import { User } from "@firebase/auth-types"
import { Emotion, ICustomLobbyState, Title, Transfer } from "../../../types"
import { IBot } from "../../../models/mongo-models/bot-v2"
import PreparationState from "../../../rooms/states/preparation-state"
import GameState from "../../../rooms/states/game-state"
import AfterGameState from "../../../rooms/states/after-game-state"
import { BotDifficulty } from "../../../types/enum/Game"
import { Pkm } from "../../../types/enum/Pokemon"

interface INetwork {
  client: Client
  lobby: Room<ICustomLobbyState> | undefined
  preparation: Room<PreparationState> | undefined
  game: Room<GameState> | undefined
  after: Room<AfterGameState> | undefined
  uid: string
  displayName: string
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
  displayName: ""
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
      state.preparation = undefined
      state.lobby = undefined
      state.game = undefined
      state.after = undefined
    },
    joinLobby: (state, action: PayloadAction<Room<ICustomLobbyState>>) => {
      state.lobby = action.payload
      state.preparation = undefined
      state.game = undefined
      state.after = undefined
    },
    joinPreparation: (state, action: PayloadAction<Room<PreparationState>>) => {
      state.preparation = action.payload
      state.lobby = undefined
      state.game = undefined
      state.after = undefined
    },
    joinGame: (state, action: PayloadAction<Room<GameState>>) => {
      state.game = action.payload
      state.preparation = undefined
      state.lobby = undefined
      state.after = undefined
    },
    joinAfter: (state, action: PayloadAction<Room<AfterGameState>>) => {
      state.after = action.payload
      state.game = undefined
      state.lobby = undefined
      state.preparation = undefined
    },
    sendMessage: (state, action: PayloadAction<string>) => {
      if (state.lobby) {
        state.lobby.send(Transfer.NEW_MESSAGE, { payload: action.payload })
      }
      if (state.preparation) {
        state.preparation.send(Transfer.NEW_MESSAGE, {
          payload: action.payload
        })
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
    requestMeta: (state) => {
      state.lobby?.send(Transfer.REQUEST_META)
    },
    requestBotList: (state) => {
      state.lobby?.send(Transfer.REQUEST_BOT_LIST)
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
    pokemonPropositionClick: (state, action: PayloadAction<Pkm>) => {
      state.game?.send(Transfer.POKEMON_PROPOSITION, action.payload)
    },
    itemClick: (state, action: PayloadAction<string>) => {
      state.game?.send(Transfer.ITEM, { id: action.payload })
    },
    gameStartRequest: (state, action: PayloadAction<string>) => {
      state.preparation?.send(Transfer.GAME_START_REQUEST, { token: action.payload })
    },
    gameStart: (state, action: PayloadAction<string>) => {
      state.preparation?.send(Transfer.GAME_START, { id: action.payload })
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
    buyBooster: (state, action: PayloadAction<{ index: string; }>) => {
      state.lobby?.send(Transfer.BUY_BOOSTER, action.payload)
    },
    openBooster: (state) => {
      state.lobby?.send(Transfer.OPEN_BOOSTER)
    },
    broadcastEmote: (state, action: PayloadAction<string>) => {
      state.game?.send(Transfer.BROADCAST_EMOTE, action.payload)
    },
    searchById: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.SEARCH_BY_ID, action.payload)
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.SET_TITLE, action.payload)
    },
    removeMessage: (
      state,
      action: PayloadAction<{ author: string; payload: string }>
    ) => {
      state.lobby?.send(Transfer.REMOVE_MESSAGE, action.payload)
    },
    giveBooster: (
      state,
      action: PayloadAction<{ uid: string; numberOfBoosters: number }>
    ) => {
      state.lobby?.send(Transfer.GIVE_BOOSTER, action.payload)
    },
    setModerator: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.SET_MODERATOR, action.payload)
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
    ban: (state, action: PayloadAction<string>) => {
      state.lobby?.send(Transfer.BAN, action.payload)
    }
  }
})

export const {
  ban,
  pokemonPropositionClick,
  requestLeaderboard,
  requestBotLeaderboard,
  requestLevelLeaderboard,
  giveTitle,
  removeMessage,
  giveBooster,
  setModerator,
  broadcastEmote,
  openBooster,
  changeSelectedEmotion,
  buyEmotion,
  buyBooster,
  changeRoomName,
  changeRoomPassword,
  gameStart,
  gameStartRequest,
  logIn,
  logOut,
  joinLobby,
  sendMessage,
  searchName,
  joinPreparation,
  joinGame,
  joinAfter,
  changeName,
  changeAvatar,
  requestMeta,
  requestBotList,
  createBot,
  requestBotData,
  addBot,
  removeBot,
  listBots,
  toggleReady,
  toggleEloRoom,
  requestTilemap,
  itemClick,
  shopClick,
  levelClick,
  lockClick,
  refreshClick,
  searchById,
  setTitle,
  kick
} = networkSlice.actions

export default networkSlice.reducer
