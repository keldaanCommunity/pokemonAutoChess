import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { STATE } from "../../../models/enum";
import { IPlayer } from "../../../types";
import {MapSchema, ArraySchema, DataChange} from "@colyseus/schema";
import Player from "../../../models/colyseus-models/player";
import ExperienceManager from "../../../models/colyseus-models/experience-manager";
import Synergies from "../../../models/colyseus-models/synergies";

interface GameStateStore {
    afterGameId: string
    roundTime: number
    phase: string
    players: IPlayer[]
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
    currentPlayerSynergies: Synergies
    currentPlayerOpponentName: string
    currentPlayerOpponentAvatar: string
    currentPlayerBoardSize: number
    currentPlayerLife: number
    currentPlayerMoney: number
    currentPlayerExperienceManager:  ExperienceManager
    currentPlayerName: string
    currentPlayerAvatar: string
}

const initialState: GameStateStore = {
    afterGameId: '',
    roundTime: 30,
    phase: STATE.PICK,
    players: [],
    stageLevel: 0,
    mapName: '',
    currentPlayerId: '',
    money: 5,
    interest: 0,
    streak: 0,
    shopLocked: false,
    experienceManager: new ExperienceManager(),
    shop: new ArraySchema<string>(),
    itemsProposition: new ArraySchema<string>(),
    currentPlayerSynergies: new Synergies(),
    currentPlayerOpponentName: '',
    currentPlayerOpponentAvatar: 'rattata',
    currentPlayerBoardSize: 0,
    currentPlayerLife: 100,
    currentPlayerMoney: 5,
    currentPlayerExperienceManager: new ExperienceManager(),
    currentPlayerName: '',
    currentPlayerAvatar: 'rattata'
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
            state.players[index][action.payload.change.field] = action.payload.change.value;
        },
        setShop: (state, action: PayloadAction<ArraySchema<string>>) => {
            state.shop = action.payload;
        },
        setItemsProposition: (state, action: PayloadAction<ArraySchema<string>>) => {
            state.itemsProposition = JSON.parse(JSON.stringify(action.payload));
        },
        setSynergies: (state, action: PayloadAction<Synergies>) => {
            state.currentPlayerSynergies = JSON.parse(JSON.stringify(action.payload));
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
            state.currentPlayerMoney = action.payload.money;
            state.currentPlayerExperienceManager = action.payload.experienceManager;
            state.currentPlayerOpponentName = action.payload.opponentName;
            state.currentPlayerOpponentAvatar = action.payload.opponentAvatar;
            state.currentPlayerLife = action.payload.life;
            state.currentPlayerSynergies = JSON.parse(JSON.stringify(action.payload.synergies));
            state.currentPlayerAvatar = action.payload.avatar;
            state.currentPlayerName = action.payload.name;
            state.currentPlayerBoardSize = action.payload.boardSize;
        }
    }
});

export const {
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