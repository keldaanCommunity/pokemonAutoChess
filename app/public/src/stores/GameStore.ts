import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GamePhaseState } from "../../../types/enum/Game";
import { IDps, IDpsHeal, IPlayer } from "../../../types";
import {ArraySchema, DataChange, MapSchema} from "@colyseus/schema";
import ExperienceManager from "../../../models/colyseus-models/experience-manager";
import Synergies from "../../../models/colyseus-models/synergies";
import { IPokemonConfig } from "../../../models/mongo-models/user-metadata";
import PokemonCollection from "../../../models/colyseus-models/pokemon-collection";
import {Synergy} from '../../../types/enum/Synergy';
import { Pkm } from "../../../types/enum/Pokemon";
import { Item } from "../../../types/enum/Item";
import { toast } from "react-toastify";


interface GameStateStore {
    afterGameId: string
    roundTime: number
    phase: GamePhaseState
    players: IPlayer[]
    stageLevel: number
    mapName: string
    currentPlayerId: string
    money: number
    interest: number
    streak: number
    shopLocked: boolean
    experienceManager: ExperienceManager
    shop: Pkm[]
    itemsProposition: string[]
    currentPlayerSynergies: [string, number][]
    currentPlayerOpponentName: string
    currentPlayerOpponentAvatar: string
    currentPlayerBoardSize: number
    currentPlayerLife: number
    currentPlayerMoney: number
    currentPlayerExperienceManager: ExperienceManager
    currentPlayerName: string
    currentPlayerAvatar: string,
    blueDpsMeter: IDps[],
    redDpsMeter: IDps[],
    blueHealDpsMeter: IDpsHeal[],
    redHealDpsMeter: IDpsHeal[],
    pokemonCollection: MapSchema<IPokemonConfig>
}

const initialState: GameStateStore = {
    afterGameId: '',
    roundTime: 30,
    phase: GamePhaseState.PICK,
    players: new Array<IPlayer>(),
    stageLevel: 0,
    mapName: '',
    currentPlayerId: '',
    money: 5,
    interest: 0,
    streak: 0,
    shopLocked: false,
    experienceManager: new ExperienceManager(),
    shop: new Array<Pkm>(),
    itemsProposition: new Array<Item>(),
    currentPlayerSynergies: new Array<[Synergy, number]>(),
    currentPlayerOpponentName: '',
    currentPlayerOpponentAvatar: '0019/Normal',
    currentPlayerBoardSize: 0,
    currentPlayerLife: 100,
    currentPlayerMoney: 5,
    currentPlayerExperienceManager: new ExperienceManager(),
    currentPlayerName: '',
    currentPlayerAvatar: '0019/Normal',
    blueDpsMeter: new Array<IDps>(),
    redDpsMeter: new Array<IDps>(),
    blueHealDpsMeter: new Array<IDpsHeal>(),
    redHealDpsMeter: new Array<IDpsHeal>(),
    pokemonCollection: new MapSchema<IPokemonConfig>()
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialState,
    reducers: {
        setRoundTime: (state, action: PayloadAction<number>) => {
            state.roundTime = action.payload;
        },
        setAfterGameId: (state, action: PayloadAction<string>) => {
            state.afterGameId = action.payload;
        },
        setPhase: (state, action: PayloadAction<GamePhaseState>) => {
            state.phase = action.payload;
        },
        setStageLevel: (state, action: PayloadAction<number>) => {
            state.stageLevel = action.payload;
        },
        setMapName: (state, action: PayloadAction<string>) => {
            state.mapName = action.payload;
        },
        addPlayer: (state, action: PayloadAction<IPlayer>) => {
            state.players.push(JSON.parse(JSON.stringify(action.payload)));
        },
        setCurrentPlayerId: (state, action: PayloadAction<string>) => {
            state.currentPlayerId = action.payload;
        },
        setMoney: (state, action: PayloadAction<number>) => {
            state.money = action.payload;
        },
        setInterest: (state, action: PayloadAction<number>) => {
            state.interest = action.payload;
        },
        setStreak: (state, action: PayloadAction<number>) => {
            state.streak = action.payload;
        },
        setShopLocked: (state, action: PayloadAction<boolean>) => {
            state.shopLocked = action.payload;
        },
        setExperienceManager: (state, action: PayloadAction<ExperienceManager>) => {
            state.experienceManager = action.payload;
        },
        changePlayer: (state, action: PayloadAction<{id: string, change: DataChange<any>}>) => {
            const index = state.players.findIndex((e)=>action.payload.id == e.id);
            if(['money','history','life','rank'].includes(action.payload.change.field)){
                state.players[index][action.payload.change.field] = action.payload.change.value;
            }
        },
        setShop: (state, action: PayloadAction<ArraySchema<Pkm>>) => {
            state.shop = action.payload;
        },
        setItemsProposition: (state, action: PayloadAction<ArraySchema<Item>>) => {
            state.itemsProposition = JSON.parse(JSON.stringify(action.payload));
        },
        setSynergies: (state, action: PayloadAction<Synergies>) => {
            state.currentPlayerSynergies = Array.from(action.payload);
        },
        setOpponentName: (state, action: PayloadAction<string>) => {
            state.currentPlayerOpponentName = action.payload;
        },
        setOpponentAvatar: (state, action: PayloadAction<string>) => {
            state.currentPlayerOpponentAvatar = action.payload;
        },
        setBoardSize: (state, action: PayloadAction<number>) => {
            state.currentPlayerBoardSize = action.payload;
        },
        setLife: (state, action: PayloadAction<number>) => {
            state.currentPlayerLife = action.payload;
        },
        setCurrentPlayerExperienceManager: (state, action: PayloadAction<ExperienceManager>) => {
            state.currentPlayerExperienceManager = action.payload;
        },
        setCurrentPlayerMoney: (state, action: PayloadAction<number>) => {
            state.currentPlayerMoney = action.payload;
        },
        setCurrentPlayerName: (state, action: PayloadAction<string>) => {
            state.currentPlayerName = action.payload;
        },
        setCurrentPlayerAvatar: (state, action: PayloadAction<string>) => {
            state.currentPlayerAvatar = action.payload;
        },
        setPlayer: (state, action: PayloadAction<IPlayer>) => {
            state.currentPlayerId = action.payload.id;
            state.currentPlayerMoney = action.payload.money;
            state.currentPlayerExperienceManager = action.payload.experienceManager;
            state.currentPlayerOpponentName = action.payload.opponentName;
            state.currentPlayerOpponentAvatar = action.payload.opponentAvatar;
            state.currentPlayerLife = action.payload.life;
            state.currentPlayerSynergies = Array.from(action.payload.synergies);
            state.currentPlayerAvatar = action.payload.avatar;
            state.currentPlayerName = action.payload.name;
            state.currentPlayerBoardSize = action.payload.boardSize;
            state.blueDpsMeter = new Array<IDps>();
            state.redDpsMeter = new Array<IDps>();
            state.blueHealDpsMeter = new Array<IDpsHeal>();
            state.redHealDpsMeter = new Array<IDpsHeal>();
            action.payload.simulation.blueDpsMeter.forEach(dps=>{state.blueDpsMeter.push(JSON.parse(JSON.stringify(dps)))});
            action.payload.simulation.redDpsMeter.forEach(dps=>{state.redDpsMeter.push(JSON.parse(JSON.stringify(dps)))});
            action.payload.simulation.redHealDpsMeter.forEach(dps=>{state.redHealDpsMeter.push(JSON.parse(JSON.stringify(dps)))});
            action.payload.simulation.blueHealDpsMeter.forEach(dps=>{state.blueHealDpsMeter.push(JSON.parse(JSON.stringify(dps)))});
        },
        addRedDpsMeter: (state, action: PayloadAction<IDps>) => {
            if(state.redDpsMeter.find(d=> d.id == action.payload.id) === undefined){
                state.redDpsMeter.push(JSON.parse(JSON.stringify(action.payload)));
            }
        },
        addBlueDpsMeter: (state, action: PayloadAction<IDps>) => {
            if(state.blueDpsMeter.find(d=> d.id == action.payload.id) === undefined){
                state.blueDpsMeter.push(JSON.parse(JSON.stringify(action.payload)));
            }
        },
        addRedHealDpsMeter: (state, action: PayloadAction<IDpsHeal>) => {
            if(state.redHealDpsMeter.find(d=> d.id == action.payload.id) === undefined){
                state.redHealDpsMeter.push(JSON.parse(JSON.stringify(action.payload)));
            }
        },
        addBlueHealDpsMeter: (state, action: PayloadAction<IDpsHeal>) => {
            if(state.blueHealDpsMeter.find(d=> d.id == action.payload.id) === undefined){
                state.blueHealDpsMeter.push(JSON.parse(JSON.stringify(action.payload)));
            }
        },
        changeRedDpsMeter: (state, action: PayloadAction<{id: string, change: DataChange<any>}>) => {
            const index = state.redDpsMeter.findIndex(e=>action.payload.id == e.id);
            if(index >= 0){
                state.redDpsMeter[index][action.payload.change.field] = action.payload.change.value;
            }
        },
        changeBlueDpsMeter: (state, action: PayloadAction<{id: string, change: DataChange<any>}>) => {
            const index = state.blueDpsMeter.findIndex(e=>action.payload.id == e.id);
            if(index >= 0){
                state.blueDpsMeter[state.blueDpsMeter.findIndex(e=>action.payload.id == e.id)][action.payload.change.field] = action.payload.change.value;
            }
        },
        changeRedHealDpsMeter: (state, action: PayloadAction<{id: string, change: DataChange<any>}>) => {
            const index = state.redHealDpsMeter.findIndex(e=>action.payload.id == e.id);
            if(index >= 0){
                state.redHealDpsMeter[state.redHealDpsMeter.findIndex(e=>action.payload.id == e.id)][action.payload.change.field] = action.payload.change.value;
            }
        },
        changeBlueHealDpsMeter: (state, action: PayloadAction<{id: string, change: DataChange<any>}>) => {
            const index = state.blueHealDpsMeter.findIndex(e=>action.payload.id == e.id);
            if(index >= 0){
                state.blueHealDpsMeter[state.blueHealDpsMeter.findIndex(e=>action.payload.id == e.id)][action.payload.change.field] = action.payload.change.value;
            }
        },
        removeRedDpsMeter: (state, action: PayloadAction<string>) => {
            state.redDpsMeter = new Array<IDps>();
        },
        removeBlueDpsMeter: (state, action: PayloadAction<string>) => {
            state.blueDpsMeter = new Array<IDps>();
        },
        removeRedHealDpsMeter: (state, action: PayloadAction<string>) => {
            state.redHealDpsMeter = new Array<IDpsHeal>();
        },
        removeBlueHealDpsMeter: (state, action: PayloadAction<string>) => {
            state.blueHealDpsMeter = new Array<IDpsHeal>();
        },
        setPokemonCollection: (state, action: PayloadAction<PokemonCollection>) => {
            state.pokemonCollection = action.payload;
        },
        leaveGame: () => initialState
    }
});

export const {
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
    setPlayer,
    setCurrentPlayerAvatar,
    setCurrentPlayerExperienceManager,
    setCurrentPlayerMoney,
    setLife,
    setBoardSize,
    setOpponentName,
    setOpponentAvatar,
    setSynergies,
    setRoundTime,
    setAfterGameId,
    setPhase,
    setStageLevel,
    setMapName,
    addPlayer,
    setCurrentPlayerId,
    setExperienceManager,
    setStreak,
    setInterest,
    setMoney,
    setShopLocked,
    changePlayer,
    setShop,
    setItemsProposition
} = gameSlice.actions;

export default gameSlice.reducer;