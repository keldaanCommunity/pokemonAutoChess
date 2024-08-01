import { ArraySchema, MapSchema } from "@colyseus/schema"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import Simulation from "../../../core/simulation"
import ExperienceManager from "../../../models/colyseus-models/experience-manager"
import PokemonCollection from "../../../models/colyseus-models/pokemon-collection"
import Synergies from "../../../models/colyseus-models/synergies"
import { IPokemonConfig } from "../../../models/mongo-models/user-metadata"
import { IDps, IPlayer, ISimulation } from "../../../types"
import { StageDuration } from "../../../types/Config"
import { GamePhaseState, Team } from "../../../types/enum/Game"
import { Item } from "../../../types/enum/Item"
import { Pkm, PkmProposition } from "../../../types/enum/Pokemon"
import { Synergy } from "../../../types/enum/Synergy"
import { Weather } from "../../../types/enum/Weather"
import { getGameScene } from "../pages/game"

export interface GameStateStore {
  afterGameId: string
  phaseDuration: number
  roundTime: number
  phase: GamePhaseState
  players: IPlayer[]
  simulations: ISimulation[]
  stageLevel: number
  noElo: boolean
  currentPlayerId: string
  currentSimulationId: string
  currentSimulationTeamIndex: number
  money: number
  interest: number
  streak: number
  shopLocked: boolean
  experienceManager: ExperienceManager
  shop: Pkm[]
  itemsProposition: Item[]
  pokemonsProposition: PkmProposition[]
  currentPlayerSynergies: [string, number][]
  weather: Weather
  blueDpsMeter: IDps[]
  redDpsMeter: IDps[]
  pokemonCollection: MapSchema<IPokemonConfig>
  additionalPokemons: Pkm[]
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
  currentSimulationTeamIndex: 0,
  money: 5,
  interest: 0,
  streak: 0,
  shopLocked: false,
  experienceManager: new ExperienceManager(),
  shop: new Array<Pkm>(),
  itemsProposition: new Array<Item>(),
  pokemonsProposition: new Array<Pkm>(),
  currentPlayerSynergies: new Array<[Synergy, number]>(),
  blueDpsMeter: new Array<IDps>(),
  redDpsMeter: new Array<IDps>(),
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
    setNoELO: (state, action: PayloadAction<boolean>) => {
      state.noElo = action.payload
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
      state.shop = action.payload as unknown as Pkm []
    },
    setItemsProposition: (state, action: PayloadAction<ArraySchema<Item>>) => {
      state.itemsProposition = action.payload as unknown as Item []
    },
    setPokemonProposition: (state, action: PayloadAction<PkmProposition[]>) => {
      state.pokemonsProposition = action.payload.map(p=>p)
    },
    setAdditionalPokemons: (state, action: PayloadAction<Pkm[]>) => {
      state.additionalPokemons = action.payload.map(p=>p)
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
        state.players.at(playerToUpdate)!.synergies =
          action.payload.value.toJSON()
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
        state.currentSimulationTeamIndex =
          state.currentPlayerId === action.payload.bluePlayerId ? 0 : 1
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
      state.currentSimulationTeamIndex = action.payload.simulationTeamIndex
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

    setPokemonCollection: (state, action: PayloadAction<PokemonCollection>) => {
      state.pokemonCollection = action.payload
    },
    leaveGame: () => initialState
  }
})

export const {
  setSimulation,
  setAdditionalPokemons,
  setPokemonProposition,
  setPokemonCollection,
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
  addPlayer,
  removePlayer,
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
