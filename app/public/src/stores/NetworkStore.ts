import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room, Client } from "colyseus.js";
import {User} from '@firebase/auth-types';
import {Emotion, ICustomLobbyState} from '../../../types';
import {IBot} from '../../../models/mongo-models/bot-v2';
import PreparationState from "../../../rooms/states/preparation-state";
import GameState from "../../../rooms/states/game-state";
import AfterGameState from "../../../rooms/states/after-game-state";

interface INetwork {
    client: Client;
    lobby: Room<ICustomLobbyState>;
    preparation: Room<PreparationState>;
    game: Room<GameState>;
    after: Room<AfterGameState>;
    uid: string;
    displayName: string;
}

const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;

const initalState: INetwork = {
    client: new Client(endpoint),
    lobby: undefined,
    preparation: undefined,
    game: undefined,
    after: undefined,
    uid: undefined,
    displayName: undefined,
}

export const networkSlice = createSlice({
    name: 'network',
    initialState: initalState,
    reducers: {
        logIn: (state, action: PayloadAction<User>) => {
            if(action.payload){
                state.uid = action.payload.uid;
                state.displayName = action.payload.displayName; 
            }
        },
        logOut: (state, action: PayloadAction<string>) => {
            state.uid = undefined;
            state.displayName = undefined;
        },
        joinLobby: (state, action: PayloadAction<Room<ICustomLobbyState>>) => {
            state.lobby = action.payload;
            state.preparation = undefined;
            state.game = undefined;
            state.after = undefined;
        },
        joinPreparation: (state, action: PayloadAction<Room<PreparationState>>) => {
            state.preparation = action.payload;
            state.lobby = undefined;
            state.game = undefined;
            state.after = undefined;
        },
        joinGame: (state, action: PayloadAction<Room<GameState>>) => {
            state.game = action.payload;
            state.preparation = undefined;
            state.lobby = undefined;
            state.after = undefined;
        },
        joinAfter: (state, action: PayloadAction<Room<AfterGameState>>) => {
            state.after = action.payload;
            state.game = undefined;
            state.lobby = undefined;
            state.preparation = undefined;
        },
        sendMessage: (state, action: PayloadAction<string>) => {
            if(state.lobby){
                state.lobby.send('new-message', {payload: action.payload});
            }
            if(state.preparation){
                state.preparation.send('new-message', {payload: action.payload});
            }
        },
        searchName: (state, action: PayloadAction<string>) => {
            state.lobby.send('search', {'name':action.payload});
        },
        changeName: (state, action: PayloadAction<string>) => {
            state.lobby.send('name', {'name': action.payload});
        },
        changeAvatar: (state, action: PayloadAction<{index: string, emotion: Emotion, shiny: boolean}>) => {
            state.lobby.send('avatar', {'pokemon': action.payload});
        },
        requestMeta: (state, action: PayloadAction<boolean>) => {
            state.lobby.send('meta');
        },
        requestBotList: (state, action: PayloadAction<boolean>) => {
            state.lobby.send('bot-list-request');
        },
        createBot: (state, action: PayloadAction<IBot>) => {
            state.lobby.send('bot-creation',{'bot': action.payload});
        },
        requestBotData: (state, action:PayloadAction<string>) => {
            state.lobby.send('bot-data-request', action.payload);
        },
        addBot: (state, action:PayloadAction<string>) => {
            state.preparation.send('addBot', action.payload);
        },
        removeBot: (state,action: PayloadAction<string>) => {
            state.preparation.send('removeBot', action.payload);
        },
        toggleReady: (state, action: PayloadAction<boolean>) => {
            state.preparation.send('toggle-ready');
        },
        requestTilemap: (state) => {
            state.game.send('request-tilemap');
        },
        refreshClick: (state) => {
            state.game.send('refresh');
        },
        lockClick: (state) => {
            state.game.send('lock');
        },
        levelClick: (state) => {
            state.game.send('levelUp');
        },
        shopClick: (state, action: PayloadAction<number>) => {
            state.game.send('shop', {'id': action.payload});
        }, 
        itemClick: (state, action: PayloadAction<string>) => {
            state.game.send('item', {'id': action.payload});
        },
        gameStart: (state, action: PayloadAction<string>) => {
            state.preparation.send('game-start', {'id': action.payload});
        },
        changeRoomName: (state, action: PayloadAction<string>) => {
            state.preparation.send('room-name', action.payload);
        },
        changeSelectedEmotion:(state, action: PayloadAction<{index: string, emotion: Emotion, shiny: boolean}>) => {
            state.lobby.send('change-selected-emotion',action.payload);
        },
        buyEmotion: (state, action: PayloadAction<{index: string, emotion:Emotion, shiny: boolean}>) => {
            state.lobby.send('buy-emotion', action.payload);
        }
    }
});

export const {
    changeSelectedEmotion,
    buyEmotion,
    changeRoomName,
    gameStart,
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
    toggleReady,
    requestTilemap,
    itemClick,
    shopClick,
    levelClick,
    lockClick,
    refreshClick
} = networkSlice.actions;

export default networkSlice.reducer;