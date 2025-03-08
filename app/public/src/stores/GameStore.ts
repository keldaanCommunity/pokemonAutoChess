import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import Simulation from "../../../core/simulation"
import ExperienceManager from "../../../models/colyseus-models/experience-manager"
import Synergies from "../../../models/colyseus-models/synergies"
import {
  Emotion,
  IDps,
  IExperienceManager,
  IPlayer,
  ISimulation
} from "../../../types"
import { StageDuration } from "../../../types/Config"
import { GamePhaseState, Team } from "../../../types/enum/Game"
import { Item } from "../../../types/enum/Item"
import { Pkm, PkmProposition } from "../../../types/enum/Pokemon"
import { SpecialGameRule } from "../../../types/enum/SpecialGameRule"
import { Synergy } from "../../../types/enum/Synergy"
import { Weather } from "../../../types/enum/Weather"
import { getGameScene } from "../pages/game"
import { entries } from "../../../utils/schemas"
import { ILeaderboardInfo } from "../../../types/interfaces/LeaderboardInfo"

export interface GameStateStore {
  afterGameId: string
  phaseDuration: number
  roundTime: number
  phase: GamePhaseState
  players: IPlayer[]
  simulations: ISimulation[]
  stageLevel: number
  noElo: boolean
  specialGameRule: SpecialGameRule | null
  currentPlayerId: string
  currentSimulationId: string
  currentTeam: Team
  money: number
  interest: number
  streak: number
  shopFreeRolls: number
  shopLocked: boolean
  experienceManager: IExperienceManager
  shop: Pkm[]
  itemsProposition: Item[]
  pokemonsProposition: PkmProposition[]
  currentPlayerSynergies: [string, number][]
  weather: Weather
  blueDpsMeter: IDps[]
  redDpsMeter: IDps[]
  emotesUnlocked: Emotion[]
  additionalPokemons: Pkm[]
  podium: ILeaderboardInfo[]
}

const initialState: GameStateStore = {
  afterGameId: "",
  phaseDuration: StageDuration[1],
  roundTime: StageDuration[1],
  phase: GamePhaseState.PICK,
  players: new Array<IPlayer>(),
  simulations: new Array<ISimulation>(),
  stageLevel: 0,
  weather: Weather.NEUTRAL,
  noElo: false,
  currentPlayerId: "",
  currentSimulationId: "",
  currentTeam: Team.BLUE_TEAM,
  money: 5,
  interest: 0,
  streak: 0,
  shopFreeRolls: 0,
  shopLocked: false,
  experienceManager: new ExperienceManager(),
  shop: new Array<Pkm>(),
  itemsProposition: new Array<Item>(),
  pokemonsProposition: new Array<Pkm>(),
  currentPlayerSynergies: new Array<[Synergy, number]>(),
  blueDpsMeter: new Array<IDps>(),
  redDpsMeter: new Array<IDps>(),
  emotesUnlocked: [],
  additionalPokemons: new Array<Pkm>(),
  specialGameRule: null,
  podium: new Array<ILeaderboardInfo>()
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
    setNoELO: (state, action: PayloadAction<boolean>) => {
      state.noElo = action.payload
    },
    setSpecialGameRule: (
      state,
      action: PayloadAction<SpecialGameRule | null>
    ) => {
      state.specialGameRule = action.payload
    },
    addPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.players.push(JSON.parse(JSON.stringify(action.payload)))
    },
    removePlayer: (state, action: PayloadAction<IPlayer>) => {
      state.players = state.players.filter((p) => p.id !== action.payload.id)
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
    setShopFreeRolls: (state, action: PayloadAction<number>) => {
      state.shopFreeRolls = action.payload
    },
    updateExperienceManager: (
      state,
      action: PayloadAction<IExperienceManager>
    ) => {
      state.experienceManager = {
        ...state.experienceManager,
        experience: action.payload.experience,
        expNeeded: action.payload.expNeeded,
        level: action.payload.level
      }
    },
    changePlayer: (
      state,
      action: PayloadAction<{ id: string; field: string; value: any }>
    ) => {
      const index = state.players.findIndex((e) => action.payload.id == e.id)
      if (index >= 0) {
        state.players[index][action.payload.field] = action.payload.value
      } else {
        console.error(
          `changePlayer: Player not found ${action.payload.id} in ${state.players.map((p) => p.id)}`
        )
      }
    },
    changeShop: (
      state,
      action: PayloadAction<{ index: number; value: Pkm }>
    ) => {
      state.shop[action.payload.index] = action.payload.value
    },
    refreshShopUI: (state) => {
      state.shop = state.shop.slice()
    },
    setItemsProposition: (state, action: PayloadAction<Item[]>) => {
      state.itemsProposition = action.payload
    },
    setPokemonProposition: (state, action: PayloadAction<PkmProposition[]>) => {
      state.pokemonsProposition = action.payload
    },
    setAdditionalPokemons: (state, action: PayloadAction<Pkm[]>) => {
      state.additionalPokemons = action.payload
    },
    setSynergies: (
      state,
      action: PayloadAction<{ value: Synergies; id: string }>
    ) => {
      if (state.currentPlayerId === action.payload.id) {
        state.currentPlayerSynergies = Array.from(action.payload.value)
      }

      const playerToUpdate = state.players.findIndex(
        (player) => player.id === action.payload.id
      )

      if (playerToUpdate !== -1) {
        state.players.at(playerToUpdate)!.synergies = new Map(
          entries(action.payload.value)
        )
      }
    },
    setLife: (state, action: PayloadAction<{ value: number; id: string }>) => {
      getGameScene()?.board?.updateAvatarLife(
        action.payload.id,
        action.payload.value
      )
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
    setWeather: (
      state,
      action: PayloadAction<{ value: Weather; id: string }>
    ) => {
      if (state.currentSimulationId === action.payload.id) {
        state.weather = action.payload.value
      }
    },
    setSimulation: (state, action: PayloadAction<Simulation>) => {
      if (
        state.currentPlayerId === action.payload.bluePlayerId ||
        state.currentPlayerId === action.payload.redPlayerId
      ) {
        state.currentSimulationId = action.payload.id
        state.currentTeam =
          state.currentPlayerId === action.payload.bluePlayerId
            ? Team.BLUE_TEAM
            : Team.RED_TEAM
        state.weather = action.payload.weather
        state.blueDpsMeter = new Array<IDps>()
        state.redDpsMeter = new Array<IDps>()
        action.payload.blueDpsMeter.forEach((dps) => {
          state.blueDpsMeter.push(structuredClone(dps))
        })
        action.payload.redDpsMeter.forEach((dps) => {
          state.redDpsMeter.push(structuredClone(dps))
        })
      }
    },
    setPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.currentPlayerId = action.payload.id
      state.currentSimulationId = action.payload.simulationId
      state.currentTeam = action.payload.team
      state.currentPlayerSynergies = Array.from(action.payload.synergies)
    },
    addDpsMeter: (
      state,
      action: PayloadAction<{ value: IDps; team: Team; id: string }>
    ) => {
      const { value, team, id } = action.payload
      const dpsMeter =
        team === Team.BLUE_TEAM ? state.blueDpsMeter : state.redDpsMeter
      if (
        state.currentSimulationId === id &&
        dpsMeter.find((d) => d.id == value.id) === undefined
      ) {
        dpsMeter.push(structuredClone(value))
      }
    },

    changeDpsMeter: (
      state,
      action: PayloadAction<{
        id: string
        team: Team
        field: string
        value: string | number
        simulationId: string
      }>
    ) => {
      const { value, field, team, id, simulationId } = action.payload
      const dpsMeter =
        team === Team.BLUE_TEAM ? state.blueDpsMeter : state.redDpsMeter
      if (state.currentSimulationId === simulationId) {
        const index = dpsMeter.findIndex((e) => id == e.id)
        if (index >= 0) {
          dpsMeter[index][field] = value
        }
      }
    },

    removeDpsMeter: (
      state,
      action: PayloadAction<{ team: Team; simulationId: string }>
    ) => {
      const { team, simulationId } = action.payload
      if (state.currentSimulationId === simulationId) {
        if (team === Team.BLUE_TEAM) state.blueDpsMeter = new Array<IDps>()
        if (team === Team.RED_TEAM) state.redDpsMeter = new Array<IDps>()
      }
    },

    setEmotesUnlocked: (state, action: PayloadAction<string>) => {
      state.emotesUnlocked = action.payload.split(",") as Emotion[]
    },

    setPodium(state, action: PayloadAction<ILeaderboardInfo[]>) {
      state.podium = action.payload
    },

    leaveGame: () => initialState
  }
})

export const {
  setSimulation,
  setAdditionalPokemons,
  setPokemonProposition,
  setEmotesUnlocked,
  leaveGame,
  removeDpsMeter,
  changeDpsMeter,
  addDpsMeter,
  setLoadingProgress,
  setPlayer,
  setLife,
  setSynergies,
  setRoundTime,
  setAfterGameId,
  setPhase,
  setStageLevel,
  setWeather,
  setNoELO,
  setSpecialGameRule,
  addPlayer,
  removePlayer,
  updateExperienceManager,
  setStreak,
  setInterest,
  setMoney,
  setShopFreeRolls,
  setShopLocked,
  changePlayer,
  changeShop,
  refreshShopUI,
  setItemsProposition,
  setPodium
} = gameSlice.actions

export default gameSlice.reducer
