import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room, Client } from "colyseus.js";
import {User} from '@firebase/auth-types';

interface INetwork {
    client: Client;
    lobby: Room;
    uid: string;
    displayName: string;
}

const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;

const initalState: INetwork = {
    client: new Client(endpoint),
    lobby: undefined,
    uid: undefined,
    displayName: undefined
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
        joinLobby: (state, action: PayloadAction<Room>) => {
            state.lobby = action.payload;
        }
    }
});

export const {
    logIn,
    logOut,
    joinLobby
} = networkSlice.actions;

export default networkSlice.reducer;