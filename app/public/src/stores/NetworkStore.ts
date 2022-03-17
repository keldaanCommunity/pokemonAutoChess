import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room, Client } from "colyseus.js";
import {User} from '@firebase/auth-types';
import LobbyUser, { ILobbyUser } from "../../../models/colyseus-models/lobby-user";
import {ICustomLobbyState} from '../../../types';

interface INetwork {
    client: Client;
    lobby: Room<ICustomLobbyState>;
    uid: string;
    displayName: string;
}

const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;

const initalState: INetwork = {
    client: new Client(endpoint),
    lobby: undefined,
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
        createRoom: (state, action: PayloadAction<boolean>) => {

        },
        joinRoom: (state, action: PayloadAction<string>) => {

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
        }
    }
});

export const {
    logIn,
    logOut,
    joinLobby,
    sendMessage,
    searchName,
    createRoom,
    joinRoom,
    changeName,
    changeAvatar,
    requestMeta,
    requestBotList
} = networkSlice.actions;

export default networkSlice.reducer;