
import { User } from "@firebase/auth-types"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { CollectionUtils } from "../../../core/collection"

import { Emotion, Title, Transfer } from "../../../types"
import { ConnectionStatus } from "../../../types/enum/ConnectionStatus"
import { Language } from "../../../types/enum/Language"
import {
  IPokemonCollectionItemUnpacked,
  IUserMetadataJSON,
  IUserMetadataUnpacked
} from "../../../types/interfaces/UserMetadata"
import { getAvatarString } from "../../../utils/avatar"
import { leaveAllRooms, rooms } from "../network.js"

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
    setTitle: (state, action: PayloadAction<Title | "">) => {
      if (state.profile) state.profile.title = action.payload
      rooms.lobby?.send(Transfer.SET_TITLE, action.payload)
    },
    selectLanguage: (state, action: PayloadAction<Language>) => {
      if (state.profile) state.profile.language = action.payload
      rooms.lobby?.send(Transfer.SELECT_LANGUAGE, action.payload)
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
  logIn,
  logOut,
  setProfile,
  changeName,
  changeAvatar,
  changeSelectedEmotion,
  setTitle,
  selectLanguage,
  setConnectionStatus,
  setErrorAlertMessage,
  setPendingGameId
} = networkSlice.actions

export default networkSlice.reducer
