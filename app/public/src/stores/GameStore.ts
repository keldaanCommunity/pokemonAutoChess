import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { GamePhaseState } from "../../../types/enum/Game"
import { Weather } from "../../../types/enum/Weather"
import { IDps, IDpsHeal, IPlayer } from "../../../types"
import { ArraySchema, MapSchema } from "@colyseus/schema"
import ExperienceManager from "../../../models/colyseus-models/experience-manager"
import Synergies from "../../../models/colyseus-models/synergies"
import { IPokemonConfig } from "../../../models/mongo-models/user-metadata"
import PokemonCollection from "../../../models/colyseus-models/pokemon-collection"
import { Synergy } from "../../../types/enum/Synergy"
import { Pkm } from "../../../types/enum/Pokemon"
import { Item } from "../../../types/enum/Item"
import { toast } from "react-toastify"
import React from "react"
import { getAvatarSrc } from "../utils"
import { StageDuration } from "../../../types/Config"
import { getGameScene } from "../pages/game"

interface GameStateStore {
  afterGameId: string
  phaseDuration: number
  roundTime: number
  phase: GamePhaseState
  players: IPlayer[]
  stageLevel: number
  mapName: string
  noElo: boolean
  currentPlayerId: string
  money: number
  interest: number
  streak: number
  shopLocked: boolean
  experienceManager: ExperienceManager
  shop: Pkm[]
  itemsProposition: string[]
  pokemonsProposition: Pkm[]
  currentPlayerSynergies: [string, number][]
  currentPlayerOpponentId: string
  currentPlayerOpponentName: string
  currentPlayerOpponentAvatar: string
  currentPlayerOpponentTitle: string
  currentPlayerBoardSize: number
  currentPlayerLife: number
  currentPlayerMoney: number
  currentPlayerExperienceManager: ExperienceManager
  currentPlayerName: string
  currentPlayerAvatar: string
  currentPlayerTitle: string
  currentPlayerWeather: Weather
  blueDpsMeter: IDps[]
  redDpsMeter: IDps[]
  blueHealDpsMeter: IDpsHeal[]
  redHealDpsMeter: IDpsHeal[]
  pokemonCollection: MapSchema<IPokemonConfig>
  additionalPokemons: Pkm[]
}

const initialState: GameStateStore = {
  afterGameId: "",
  phaseDuration: StageDuration[1],
  roundTime: StageDuration[1],
  phase: GamePhaseState.PICK,
  players: new Array<IPlayer>(),
  stageLevel: 0,
  mapName: "",
  currentPlayerWeather: Weather.NEUTRAL,
  noElo: false,
  currentPlayerId: "",
  money: 5,
  interest: 0,
  streak: 0,
  shopLocked: false,
  experienceManager: new ExperienceManager(),
  shop: new Array<Pkm>(),
  itemsProposition: new Array<Item>(),
  pokemonsProposition: new Array<Pkm>(),
  currentPlayerSynergies: new Array<[Synergy, number]>(),
  currentPlayerOpponentId: "",
  currentPlayerOpponentName: "",
  currentPlayerOpponentAvatar: "0019/Normal",
  currentPlayerOpponentTitle: "",
  currentPlayerBoardSize: 0,
  currentPlayerLife: 100,
  currentPlayerMoney: 5,
  currentPlayerExperienceManager: new ExperienceManager(),
  currentPlayerName: "",
  currentPlayerTitle: "",
  currentPlayerAvatar: "0019/Normal",
  blueDpsMeter: new Array<IDps>(),
  redDpsMeter: new Array<IDps>(),
  blueHealDpsMeter: new Array<IDpsHeal>(),
  redHealDpsMeter: new Array<IDpsHeal>(),
  pokemonCollection: new MapSchema<IPokemonConfig>(),
  additionalPokemons: new Array<Pkm>()
}

export const gameSlice = createSlice({
  name: "game",
  initialState: initialState,
  reducers: {
    setRoundTime: (state, action: PayloadAction<number>) => {
      if (action.payload > state.roundTime) state.phaseDuration = action.payload
      state.roundTime = action.payload
    },
    setAfterGameId: (state, action: PayloadAction<string>) => {
      state.afterGameId = action.payload
    },
    setPhase: (state, action: PayloadAction<GamePhaseState>) => {
      state.phase = action.payload
    },
    setStageLevel: (state, action: PayloadAction<number>) => {
      state.stageLevel = action.payload
    },
    setMapName: (state, action: PayloadAction<string>) => {
      state.mapName = action.payload
    },
    setNoELO: (state, action: PayloadAction<boolean>) => {
      state.noElo = action.payload
    },
    addPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.players.push(JSON.parse(JSON.stringify(action.payload)))
    },
    setMoney: (state, action: PayloadAction<number>) => {
      state.money = action.payload
    },
    setInterest: (state, action: PayloadAction<number>) => {
      state.interest = action.payload
    },
    setStreak: (state, action: PayloadAction<number>) => {
      state.streak = action.payload
    },
    setShopLocked: (state, action: PayloadAction<boolean>) => {
      state.shopLocked = action.payload
    },
    setExperienceManager: (state, action: PayloadAction<ExperienceManager>) => {
      state.experienceManager = action.payload
    },
    changePlayer: (
      state,
      action: PayloadAction<{ id: string; field: string; value: any }>
    ) => {
      const index = state.players.findIndex((e) => action.payload.id == e.id)
      state.players[index][action.payload.field] = action.payload.value
    },
    setShop: (state, action: PayloadAction<ArraySchema<Pkm>>) => {
      state.shop = action.payload
    },
    setItemsProposition: (state, action: PayloadAction<ArraySchema<Item>>) => {
      state.itemsProposition = JSON.parse(JSON.stringify(action.payload))
    },
    setPokemonProposition: (state, action: PayloadAction<Pkm[]>) => {
      state.pokemonsProposition = JSON.parse(JSON.stringify(action.payload))
    },
    setAdditionalPokemons: (state, action: PayloadAction<Pkm[]>) => {
      state.additionalPokemons = JSON.parse(JSON.stringify(action.payload))
    },
    setSynergies: (
      state,
      action: PayloadAction<{ value: Synergies; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerSynergies = Array.from(action.payload.value)
      }
    },
    setOpponentId: (
      state,
      action: PayloadAction<{ value: string; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerOpponentId = action.payload.value
      }
    },
    setOpponentName: (
      state,
      action: PayloadAction<{ value: string; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerOpponentName = action.payload.value
      }
    },
    setOpponentAvatar: (
      state,
      action: PayloadAction<{ value: string; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerOpponentAvatar = action.payload.value
        getGameScene()?.board?.updateOpponentAvatar(state.currentPlayerOpponentId, state.currentPlayerOpponentAvatar)
      }
    },
    setOpponentTitle: (
      state,
      action: PayloadAction<{ value: string; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerOpponentTitle = action.payload.value
      }
    },
    setBoardSize: (
      state,
      action: PayloadAction<{ value: number; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerBoardSize = action.payload.value
      }
    },
    setLife: (state, action: PayloadAction<{ value: number; id: string }>) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerLife = action.payload.value
      }
      getGameScene()?.board?.updateAvatarLife(action.payload.id, action.payload.value)
    },
    setPlayerExperienceManager: (
      state,
      action: PayloadAction<{ value: ExperienceManager; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerExperienceManager = action.payload.value
      }
      const player = state.players.find((e) => e.id === action.payload.id)
      if(player){
        player.experienceManager = action.payload.value
      }
    },
    setCurrentPlayerMoney: (
      state,
      action: PayloadAction<{ value: number; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerMoney = action.payload.value
      }
    },
    setCurrentPlayerName: (
      state,
      action: PayloadAction<{ value: string; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerName = action.payload.value
      }
    },
    setCurrentPlayerTitle: (
      state,
      action: PayloadAction<{ value: string; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerTitle = action.payload.value
      }
    },
    setCurrentPlayerAvatar: (
      state,
      action: PayloadAction<{ value: string; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerAvatar = action.payload.value
      }
    },
    setLoadingProgress: (
      state,
      action: PayloadAction<{ value: number; id: string }>
    ) => {
      const player = state.players.find((p) => p.id === action.payload.id)
      if (player) {
        player.loadingProgress = action.payload.value
      }
    },
    setCurrentPlayerWeather: (
      state,
      action: PayloadAction<{ value: Weather; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerWeather = action.payload.value
      }
    },
    setPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.currentPlayerId = action.payload.id
      state.currentPlayerMoney = action.payload.money
      state.currentPlayerExperienceManager = action.payload.experienceManager
      state.currentPlayerOpponentId = action.payload.opponentId
      state.currentPlayerOpponentName = action.payload.opponentName
      state.currentPlayerOpponentAvatar = action.payload.opponentAvatar
      state.currentPlayerOpponentTitle = action.payload.opponentTitle
      state.currentPlayerWeather = action.payload.simulation.weather
      state.currentPlayerLife = action.payload.life
      state.currentPlayerSynergies = Array.from(action.payload.synergies)
      state.currentPlayerAvatar = action.payload.avatar
      state.currentPlayerName = action.payload.name
      state.currentPlayerTitle = action.payload.title
      state.currentPlayerBoardSize = action.payload.boardSize
      state.blueDpsMeter = new Array<IDps>()
      state.redDpsMeter = new Array<IDps>()
      state.blueHealDpsMeter = new Array<IDpsHeal>()
      state.redHealDpsMeter = new Array<IDpsHeal>()
      action.payload.simulation.blueDpsMeter.forEach((dps) => {
        state.blueDpsMeter.push(JSON.parse(JSON.stringify(dps)))
      })
      action.payload.simulation.redDpsMeter.forEach((dps) => {
        state.redDpsMeter.push(JSON.parse(JSON.stringify(dps)))
      })
      action.payload.simulation.redHealDpsMeter.forEach((dps) => {
        state.redHealDpsMeter.push(JSON.parse(JSON.stringify(dps)))
      })
      action.payload.simulation.blueHealDpsMeter.forEach((dps) => {
        state.blueHealDpsMeter.push(JSON.parse(JSON.stringify(dps)))
      })
    },
    addRedDpsMeter: (
      state,
      action: PayloadAction<{ value: IDps; id: string }>
    ) => {
      if (
        state.currentPlayerId === action.payload.id &&
        state.redDpsMeter.find((d) => d.id == action.payload.value.id) ===
          undefined
      ) {
        state.redDpsMeter.push(JSON.parse(JSON.stringify(action.payload.value)))
      }
    },
    addBlueDpsMeter: (
      state,
      action: PayloadAction<{ value: IDps; id: string }>
    ) => {
      if (
        state.currentPlayerId === action.payload.id &&
        state.blueDpsMeter.find((d) => d.id == action.payload.value.id) ===
          undefined
      ) {
        state.blueDpsMeter.push(
          JSON.parse(JSON.stringify(action.payload.value))
        )
      }
    },
    addRedHealDpsMeter: (
      state,
      action: PayloadAction<{ value: IDpsHeal; id: string }>
    ) => {
      if (
        state.currentPlayerId === action.payload.id &&
        state.redHealDpsMeter.find((d) => d.id == action.payload.value.id) ===
          undefined
      ) {
        state.redHealDpsMeter.push(
          JSON.parse(JSON.stringify(action.payload.value))
        )
      }
    },
    addBlueHealDpsMeter: (
      state,
      action: PayloadAction<{ value: IDpsHeal; id: string }>
    ) => {
      if (
        state.currentPlayerId === action.payload.id &&
        state.blueHealDpsMeter.find((d) => d.id == action.payload.value.id) ===
          undefined
      ) {
        state.blueHealDpsMeter.push(
          JSON.parse(JSON.stringify(action.payload.value))
        )
      }
    },
    changeRedDpsMeter: (
      state,
      action: PayloadAction<{
        id: string
        field: string
        value: string | number
        playerId: string
      }>
    ) => {
      if (state.currentPlayerId === action.payload.playerId) {
        const index = state.redDpsMeter.findIndex(
          (e) => action.payload.id == e.id
        )
        if (index >= 0) {
          state.redDpsMeter[index][action.payload.field] = action.payload.value
        }
      }
    },
    changeBlueDpsMeter: (
      state,
      action: PayloadAction<{
        id: string
        field: string
        value: string | number
        playerId: string
      }>
    ) => {
      if (state.currentPlayerId === action.payload.playerId) {
        const index = state.blueDpsMeter.findIndex(
          (e) => action.payload.id == e.id
        )
        if (index >= 0) {
          state.blueDpsMeter[
            state.blueDpsMeter.findIndex((e) => action.payload.id == e.id)
          ][action.payload.field] = action.payload.value
        }
      }
    },
    changeRedHealDpsMeter: (
      state,
      action: PayloadAction<{
        id: string
        field: string
        value: string | number
        playerId: string
      }>
    ) => {
      if (state.currentPlayerId === action.payload.playerId) {
        const index = state.redHealDpsMeter.findIndex(
          (e) => action.payload.id == e.id
        )
        if (index >= 0) {
          state.redHealDpsMeter[
            state.redHealDpsMeter.findIndex((e) => action.payload.id == e.id)
          ][action.payload.field] = action.payload.value
        }
      }
    },
    changeBlueHealDpsMeter: (
      state,
      action: PayloadAction<{
        id: string
        field: string
        value: string | number
        playerId: string
      }>
    ) => {
      if (state.currentPlayerId === action.payload.playerId) {
        const index = state.blueHealDpsMeter.findIndex(
          (e) => action.payload.id == e.id
        )
        if (index >= 0) {
          state.blueHealDpsMeter[
            state.blueHealDpsMeter.findIndex((e) => action.payload.id == e.id)
          ][action.payload.field] = action.payload.value
        }
      }
    },
    removeRedDpsMeter: (state, action: PayloadAction<string>) => {
      if (state.currentPlayerId === action.payload) {
        state.redDpsMeter = new Array<IDps>()
      }
    },
    removeBlueDpsMeter: (state, action: PayloadAction<string>) => {
      if (state.currentPlayerId === action.payload) {
        state.blueDpsMeter = new Array<IDps>()
      }
    },
    removeRedHealDpsMeter: (state, action: PayloadAction<string>) => {
      if (state.currentPlayerId === action.payload) {
        state.redHealDpsMeter = new Array<IDpsHeal>()
      }
    },
    removeBlueHealDpsMeter: (state, action: PayloadAction<string>) => {
      if (state.currentPlayerId === action.payload) {
        state.blueHealDpsMeter = new Array<IDpsHeal>()
      }
    },
    setPokemonCollection: (state, action: PayloadAction<PokemonCollection>) => {
      state.pokemonCollection = action.payload
    },
    leaveGame: () => initialState
  }
})

export const {
  setAdditionalPokemons,
  setPokemonProposition,
  setPokemonCollection,
  leaveGame,
  removeBlueDpsMeter,
  removeRedDpsMeter,
  removeBlueHealDpsMeter,
  removeRedHealDpsMeter,
  changeBlueDpsMeter,
  changeRedDpsMeter,
  changeBlueHealDpsMeter,
  changeRedHealDpsMeter,
  addRedDpsMeter,
  addBlueDpsMeter,
  addRedHealDpsMeter,
  addBlueHealDpsMeter,
  setCurrentPlayerName,
  setCurrentPlayerTitle,
  setLoadingProgress,
  setPlayer,
  setCurrentPlayerAvatar,
  setPlayerExperienceManager,
  setCurrentPlayerMoney,
  setLife,
  setBoardSize,
  setOpponentId,
  setOpponentName,
  setOpponentAvatar,
  setOpponentTitle,
  setSynergies,
  setRoundTime,
  setAfterGameId,
  setPhase,
  setStageLevel,
  setMapName,
  setCurrentPlayerWeather,
  setNoELO,
  addPlayer,
  setExperienceManager,
  setStreak,
  setInterest,
  setMoney,
  setShopLocked,
  changePlayer,
  setShop,
  setItemsProposition
} = gameSlice.actions

export default gameSlice.reducer
