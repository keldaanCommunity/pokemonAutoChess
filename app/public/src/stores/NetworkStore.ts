
import { User } from "@firebase/auth-types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { server } from "../../../app.config.ts"
import { CollectionUtils } from "../../../core/collection"
import { IBot } from "../../../models/mongo-models/bot-v2"

import { Emotion, Role, Title, Transfer } from "../../../types"
import { ConnectionStatus } from "../../../types/enum/ConnectionStatus"
import { EloRank } from "../../../types/enum/EloRank"
import { BotDifficulty } from "../../../types/enum/Game"
import { Item } from "../../../types/enum/Item"
import { Language } from "../../../types/enum/Language"
import { PkmProposition } from "../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../types/enum/SpecialGameRule"
import {
  IPokemonCollectionItemUnpacked,
  IUserMetadataJSON,
  IUserMetadataUnpacked
} from "../../../types/interfaces/UserMetadata"
import { getAvatarString } from "../../../utils/avatar"
import { leaveAllRooms, leaveRoom, rooms } from "../network.js"

export interface INetwork {
  uid: string
  displayName: string
  email: string
  profile: IUserMetadataUnpacked | undefined
  pendingGameId: string | null
  connectionStatus: ConnectionStatus
  error: string | null
}

const initalState: INetwork = {
  uid: "",
  displayName: "",
  email: "",
  profile: undefined,
  pendingGameId: null,
  error: null,
  connectionStatus: ConnectionStatus.PENDING
}

export const networkSlice = createSlice({
  name: "network",
  initialState: initalState,
  reducers: {
    logIn: (state, action: PayloadAction<User>) => {
      if (action.payload) {
        state.uid = action.payload.uid
        state.displayName = action.payload.displayName ?? "Anonymous"
        state.email = action.payload.email ?? ""
      }
    },
    logOut: (state) => {
      state.uid = ""
      state.displayName = ""
      state.email = ""
      leaveAllRooms()
    },
    setProfile: (state, action: PayloadAction<IUserMetadataJSON>) => {
      const unpackedCollection: Map<string, IPokemonCollectionItemUnpacked> =
        new Map()
      for (const index in action.payload.pokemonCollection) {
        const item = action.payload.pokemonCollection[index]
        unpackedCollection.set(
          index,
          CollectionUtils.unpackCollectionItem(item)
        )
      }

      state.profile = {
        ...action.payload,
        pokemonCollection: unpackedCollection
      }
    },  
  
    searchName: (state, action: PayloadAction<string>) => {
      rooms.lobby?.send(Transfer.SEARCH, { name: action.payload })
    },
    changeName: (state, action: PayloadAction<string>) => {
      if (state.profile) state.profile.displayName = action.payload
      rooms.lobby?.send(Transfer.CHANGE_NAME, { name: action.payload })
    },
    changeAvatar: (
      state,
      action: PayloadAction<{ index: string; emotion: Emotion; shiny: boolean }>
    ) => {
      if (state.profile)
        state.profile.avatar = getAvatarString(
          action.payload.index,
          action.payload.shiny,
          action.payload.emotion
        )
      rooms.lobby?.send(Transfer.CHANGE_AVATAR, action.payload)
    },
    addBot: (state, action: PayloadAction<BotDifficulty | IBot>) => {
      rooms.preparation?.send(Transfer.ADD_BOT, action.payload)
    },
    removeBot: (state, action: PayloadAction<string>) => {
      rooms.preparation?.send(Transfer.REMOVE_BOT, action.payload)
    },
    toggleReady: (state, action: PayloadAction<boolean>) => {
      rooms.preparation?.send(Transfer.TOGGLE_READY, action.payload)
    },
    setNoElo: (state, action: PayloadAction<boolean>) => {
      rooms.preparation?.send(Transfer.CHANGE_NO_ELO, action.payload)
    },
    lockShop: (state) => {
      rooms.game?.send(Transfer.LOCK)
    },
    levelClick: (state) => {
      rooms.game?.send(Transfer.LEVEL_UP)
    },
    shopClick: (state, action: PayloadAction<number>) => {
      rooms.game?.send(Transfer.SHOP, { id: action.payload })
    },
    pokemonPropositionClick: (state, action: PayloadAction<PkmProposition>) => {
      rooms.game?.send(Transfer.POKEMON_PROPOSITION, action.payload)
    },
    itemClick: (state, action: PayloadAction<Item>) => {
      rooms.game?.send(Transfer.ITEM, action.payload)
    },
    gameStartRequest: (state, action: PayloadAction<string>) => {
      rooms.preparation?.send(Transfer.GAME_START_REQUEST, {
        token: action.payload
      })
    },
    changeRoomName: (state, action: PayloadAction<string>) => {
      rooms.preparation?.send(Transfer.CHANGE_ROOM_NAME, action.payload)
    },
    changeRoomPassword: (state, action: PayloadAction<string | null>) => {
      rooms.preparation?.send(Transfer.CHANGE_ROOM_PASSWORD, action.payload)
    },
    changeRoomMinMaxRanks: (
      state,
      action: PayloadAction<{
        minRank: EloRank | null
        maxRank: EloRank | null
      }>
    ) => {
      rooms.preparation?.send(Transfer.CHANGE_ROOM_RANKS, action.payload)
    },
    setSpecialRule: (state, action: PayloadAction<SpecialGameRule | null>) => {
      rooms.preparation?.send(Transfer.CHANGE_SPECIAL_RULE, action.payload)
    },
    changeSelectedEmotion: (
      state,
      action: PayloadAction<{
        index: string
        emotion: Emotion | null
        shiny: boolean
      }>
    ) => {
      if (state.profile) {
        const pokemonCollectionItem = state.profile.pokemonCollection.get(
          action.payload.index
        )
        if (pokemonCollectionItem) {
          pokemonCollectionItem.selectedEmotion = action.payload.emotion
          pokemonCollectionItem.selectedShiny = action.payload.shiny
        }
      }
      rooms.lobby?.send(Transfer.CHANGE_SELECTED_EMOTION, action.payload)
    },
    buyEmotion: (
      state,
      action: PayloadAction<{ index: string; emotion: Emotion; shiny: boolean }>
    ) => {
      rooms.lobby?.send(Transfer.BUY_EMOTION, action.payload)
    },
    buyBooster: (state, action: PayloadAction<{ index: string }>) => {
      rooms.lobby?.send(Transfer.BUY_BOOSTER, action.payload)
    },
    openBooster: (state) => {
      rooms.lobby?.send(Transfer.OPEN_BOOSTER)
    },
    showEmote: (state, action: PayloadAction<string | undefined>) => {
      rooms.game?.send(Transfer.SHOW_EMOTE, action.payload)
    },
    searchById: (state, action: PayloadAction<string>) => {
      rooms.lobby?.send(Transfer.SEARCH_BY_ID, action.payload)
    },
    setTitle: (state, action: PayloadAction<Title | "">) => {
      if (state.profile) state.profile.title = action.payload
      rooms.lobby?.send(Transfer.SET_TITLE, action.payload)
    },
    deleteTournament: (state, action: PayloadAction<{ id: string }>) => {
      rooms.lobby?.send(Transfer.DELETE_TOURNAMENT, action.payload)
    },
    remakeTournamentLobby: (
      state,
      action: PayloadAction<{ tournamentId: string; bracketId: string }>
    ) => {
      rooms.lobby?.send(Transfer.REMAKE_TOURNAMENT_LOBBY, action.payload)
    },
    participateInTournament: (
      state,
      action: PayloadAction<{ tournamentId: string; participate: boolean }>
    ) => {
      rooms.lobby?.send(Transfer.PARTICIPATE_TOURNAMENT, action.payload)
    },
    giveBooster: (
      state,
      action: PayloadAction<{ uid: string; numberOfBoosters: number }>
    ) => {
      rooms.lobby?.send(Transfer.GIVE_BOOSTER, action.payload)
    },
    heapSnapshot: (state) => {
      rooms.lobby?.send(Transfer.HEAP_SNAPSHOT)
    },
    deleteAccount: (state) => {
      rooms.lobby?.send(Transfer.DELETE_ACCOUNT)
    },
    giveRole: (state, action: PayloadAction<{ uid: string; role: Role }>) => {
      rooms.lobby?.send(Transfer.SET_ROLE, action.payload)
    },
    giveTitle: (
      state,
      action: PayloadAction<{ uid: string; title: Title }>
    ) => {
      rooms.lobby?.send(Transfer.GIVE_TITLE, action.payload)
    },
    kick: (state, action: PayloadAction<string>) => {
      rooms.preparation?.send(Transfer.KICK, action.payload)
    },
    ban: (state, action: PayloadAction<{ uid: string; reason: string }>) => {
      rooms.lobby?.send(Transfer.BAN, action.payload)
    },
    unban: (state, action: PayloadAction<{ uid: string; name: string }>) => {
      rooms.lobby?.send(Transfer.UNBAN, action.payload)
    },
    selectLanguage: (state, action: PayloadAction<Language>) => {
      if (state.profile) state.profile.language = action.payload
      rooms.lobby?.send(Transfer.SELECT_LANGUAGE, action.payload)
    },
    createTournament: (
      state,
      action: PayloadAction<{ name: string; startDate: string }>
    ) => {
      rooms.lobby?.send(Transfer.NEW_TOURNAMENT, action.payload)
    },
    setErrorAlertMessage: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setConnectionStatus: (state, action: PayloadAction<ConnectionStatus>) => {
      state.connectionStatus = action.payload
    },
    setPendingGameId: (state, action: PayloadAction<string | null>) => {
      state.pendingGameId = action.payload
    }
  }
})

export const {
  heapSnapshot,
  selectLanguage,
  unban,
  ban,
  pokemonPropositionClick,
  giveTitle,
  giveRole,
  deleteTournament,
  remakeTournamentLobby,
  participateInTournament,
  giveBooster,
  showEmote,
  openBooster,
  changeSelectedEmotion,
  buyEmotion,
  buyBooster,
  changeRoomName,
  changeRoomPassword,
  changeRoomMinMaxRanks,
  setSpecialRule,
  gameStartRequest,
  logIn,
  logOut,
  setProfile,
  searchName,
  changeName,
  changeAvatar,
  addBot,
  removeBot,
  toggleReady,
  setNoElo,
  itemClick,
  shopClick,
  levelClick,
  lockShop,
  searchById,
  setTitle,
  kick,
  createTournament,
  setConnectionStatus,
  setErrorAlertMessage,
  deleteAccount,
  setPendingGameId
} = networkSlice.actions

export default networkSlice.reducer
