import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room, Client } from "colyseus.js";
import {User} from '@firebase/auth-types';
import { ILobbyUser } from "../../../models/colyseus-models/lobby-user";
import {ICustomLobbyState} from '../../../types';
import {IBot} from '../../../models/mongo-models/bot-v2';
import PreparationState from "../../../rooms/states/preparation-state";
import GameState from "../../../rooms/states/game-state";

interface INetwork {
    client: Client;
    lobby: Room<ICustomLobbyState>;
    preparation: Room<PreparationState>;
    game: Room<GameState>;
    uid: string;
    displayName: string;
}

const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;

const initalState: INetwork = {
    client: new Client(endpoint),
    lobby: undefined,
    preparation: undefined,
    game: undefined,
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
        },
        joinPreparation: (state, action: PayloadAction<Room<PreparationState>>) => {
            state.preparation = action.payload;
            state.lobby = undefined;
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
        joinGame: (state, action: PayloadAction<Room<GameState>>) => {
            state.game = action.payload;
            state.preparation = undefined;
        },
        changeName: (state, action: PayloadAction<string>) => {
            state.lobby.send('name', {'name': action.payload});
        },
        changeAvatar: (state, action: PayloadAction<string>) => {
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
        }
    }
});

export const {
    logIn,
    logOut,
    joinLobby,
    sendMessage,
    searchName,
    joinPreparation,
    joinGame,
    changeName,
    changeAvatar,
    requestMeta,
    requestBotList,
    createBot,
    requestBotData,
    addBot,
    removeBot,
    toggleReady
} = networkSlice.actions;

export default networkSlice.reducer;