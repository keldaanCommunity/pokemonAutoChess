import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room, Client } from "colyseus.js";
import {User} from '@firebase/auth-types';

interface INetwork {
    client: Client;
    lobby: Room;
    user: User;
}

const endpoint = `${window.location.protocol.replace('http', 'ws')}//${window.location.host}`;

const initalState: INetwork = {
    client: new Client(endpoint),
    lobby: undefined,
    user: undefined
}

export const networkSlice = createSlice({
    name: 'network',
    initialState: initalState,
    reducers: {
        logIn: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        logOut: (state, action: PayloadAction<User>) => {
            state.user = undefined;
        }
    }
});

export const {
    logIn,
    logOut
} = networkSlice.actions;

export default networkSlice.reducer;