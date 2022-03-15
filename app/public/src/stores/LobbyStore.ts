import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IClientLobbyState, IMessage} from '../../../types/index';

const initalState: IClientLobbyState = {
    messages: [],
    users: {},
    user:{},
    searchedUser:{},
    leaderboard: [],
    botLeaderboard: [],
    currentText: '',
    allRooms: [],
    isSignedIn: false,
    preparationRoomId: '',
    tabIndex: 0,
    showWiki: false,
    showBuilder: false,
    pasteBinUrl: '',
    botData: {},
    meta: [],
    metaItems: [],
    showMeta: false,
    botList: [],
    roomCreated: false
} 

export const lobbySlice = createSlice({
    name: 'lobby',
    initialState: initalState,
    reducers: {
        pushMessage: (state, action: PayloadAction<IMessage>) =>{
            state.messages.push(action.payload);
        }
    }
});

export const {
    pushMessage
} = lobbySlice.actions;

export default lobbySlice.reducer;