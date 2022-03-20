import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room, Client } from "colyseus.js";
import {User} from '@firebase/auth-types';
import { ILobbyUser } from "../../../models/colyseus-models/lobby-user";
import {ICustomLobbyState} from '../../../types';
import {IBot} from '../../../models/mongo-models/bot-v2';
import { IPreparationState } from "../../../rooms/states/preparation-state";

interface INetwork {
    client: Client;
    lobby: Room<ICustomLobbyState>;
    preparation: Room<IPreparationState>;
    uid: string;
    displayName: string;
}

const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;

const initalState: INetwork = {
    client: new Client(endpoint),
    lobby: undefined,
    preparation: undefined,
    uid: undefined,
    displayName: undefined,
}

export const networkSlice = createSlice({
    name: 'network',
    initialState: initalState,
    reducers: {
        logIn: (state, action: PayloadAction<User>) => {
            state.uid = action.payload.uid;
            state.displayName = action.payload.displayName;
        },
        logOut: (state, action: PayloadAction<string>) => {
            state.uid = undefined;
            state.displayName = undefined;
        },
        joinLobby: (state, action: PayloadAction<Room<ICustomLobbyState>>) => {
            state.lobby = action.payload;
        },
        sendMessage: (state, action: PayloadAction<{text: string, user: ILobbyUser}>) => {
            state.lobby.send('new-message', {'name': action.payload.user.name, 'payload': action.payload.text, 'avatar':action.payload.user.avatar });
        },
        searchName: (state, action: PayloadAction<string>) => {
            state.lobby.send('search', {'name':action.payload});
        },
        joinRoom: (state, action: PayloadAction<Room<IPreparationState>>) => {
            state.preparation = action.payload;
            localStorage.setItem('lastRoomId', action.payload.id);
            localStorage.setItem('lastSessionId', action.payload.sessionId);
            state.lobby = undefined;
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
        }
    }
});

export const {
    logIn,
    logOut,
    joinLobby,
    sendMessage,
    searchName,
    joinRoom,
    changeName,
    changeAvatar,
    requestMeta,
    requestBotList,
    createBot,
    requestBotData
} = networkSlice.actions;

export default networkSlice.reducer;