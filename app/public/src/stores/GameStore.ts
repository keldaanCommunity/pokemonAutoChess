import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { STATE } from "../../../models/enum";
import { IPlayer } from "../../../types";
import {MapSchema, ArraySchema} from "@colyseus/schema";
import Player from "../../../models/colyseus-models/player";
import ExperienceManager from "../../../models/colyseus-models/experience-manager";

interface GameStateStore {
    afterGameId: string
    roundTime: number
    phase: string
    players: MapSchema<IPlayer>
    player: Player
    stageLevel: number
    mapName: string
    currentPlayerId: string
    money: number
    interest: number
    streak: number
    shopLocked: boolean
    experienceManager: ExperienceManager
    shop: ArraySchema<string>
    itemsProposition: ArraySchema<string>
}

const initialState: GameStateStore = {
    afterGameId: '',
    roundTime: 30,
    phase: STATE.PICK,
    players: new MapSchema<IPlayer>(),
    player: new Player('Loading', 'Loading...', 1000, 'rattata', false, 8),
    stageLevel: 0,
    mapName: '',
    currentPlayerId: '',
    money: 5,
    interest: 0,
    streak: 0,
    shopLocked: false,
    experienceManager: new ExperienceManager(),
    shop: new ArraySchema<string>(),
    itemsProposition: new ArraySchema<string>()
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
        setPhase: (state, action: PayloadAction<string>) => {
            state.phase = action.payload;
        },
        setStageLevel: (state, action: PayloadAction<number>) => {
            state.stageLevel = action.payload;
        },
        setMapName: (state, action: PayloadAction<string>) => {
            state.mapName = action.payload;
        },
        addPlayer: (state, action: PayloadAction<IPlayer>) => {
            state.players.set(action.payload.id, action.payload);
        },
        setCurrentPlayerId: (state, action: PayloadAction<string>) => {
            state.currentPlayerId = action.payload;
        },
        setPlayer: (state, action: PayloadAction<Player>) => {
            state.player = action.payload;
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
        changePlayer: (state, action: PayloadAction<Player>) => {
            if(action.payload.id == state.currentPlayerId){
                state.player = action.payload;
            }
            state.players.set(action.payload.id, action.payload);
        },
        setShop: (state, action: PayloadAction<ArraySchema<string>>) => {
            state.shop = action.payload;
        },
        setItemsProposition: (state, action: PayloadAction<ArraySchema<string>>) => {
            state.itemsProposition = action.payload;
        }
    }
});

export const {
    setRoundTime,
    setAfterGameId,
    setPhase,
    setStageLevel,
    setMapName,
    addPlayer,
    setCurrentPlayerId,
    setPlayer,
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