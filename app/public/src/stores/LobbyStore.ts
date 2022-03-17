import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LobbyUser, {ILobbyUser} from "../../../models/colyseus-models/lobby-user";
import Message from "../../../models/colyseus-models/message";
import LeaderboardInfo, { ILeaderboardInfo } from "../../../models/colyseus-models/leaderboard-info";
import { RoomAvailable } from "colyseus.js";
import { IMessage } from "../../../types";

interface IUserLobbyState {
    messages: IMessage[];
    users: ILobbyUser[];
    leaderboard: ILeaderboardInfo[];
    botLeaderboard: ILeaderboardInfo[];
    user: ILobbyUser;
    searchedUser: ILobbyUser;
    tabIndex: number;
    allRooms: RoomAvailable[];
}

const initialState: IUserLobbyState = {
    messages : [],
    users : [],
    leaderboard : [],
    botLeaderboard : [],
    user: undefined,
    tabIndex: 0,
    allRooms: [],
    searchedUser: undefined
}

export const lobbySlice = createSlice({
    name: 'lobby',
    initialState: initialState,
    reducers: {
        pushMessage: (state, action: PayloadAction<Message>) => {
            let m: IMessage = JSON.parse(JSON.stringify(action.payload.toJSON()));
            state.messages.push(m);
        },
        pushLeaderboard: (state, action: PayloadAction<LeaderboardInfo>) => {
            let l: ILeaderboardInfo = JSON.parse(JSON.stringify(action.payload));
            state.leaderboard.push(l);
        },
        pushBotLeaderboard: (state, action: PayloadAction<LeaderboardInfo>) => {
            let l: ILeaderboardInfo = JSON.parse(JSON.stringify(action.payload));
            state.botLeaderboard.push(l);
        },
        addUser: (state, action: PayloadAction<LobbyUser>) => {
            let u: ILobbyUser = JSON.parse(JSON.stringify(action.payload));
            state.users.push(u);
        },
        changeUser: (state, action: PayloadAction<{id: string, field: string, value: any}>) => {
            if(action.payload.id == state.user.id){
                state.user[action.payload.field] = action.payload.value;
            }
            state.users[state.users.findIndex(u => u.id == action.payload.id)][action.payload.field] = action.payload.value;
        },
        removeUser: (state, action: PayloadAction<string>) => {
            state.users.splice(state.users.findIndex(u => u.id == action.payload), 1);
        },
        setUser: (state, action: PayloadAction<LobbyUser>) => {
            let u: ILobbyUser = JSON.parse(JSON.stringify(action.payload));
            state.user = u;
        },
        setTabIndex: (state, action: PayloadAction<number>) => {
            state.tabIndex = action.payload;
        },
        addRoom: (state, action: PayloadAction<RoomAvailable>) => {
            state.allRooms.push(action.payload);
        },
        removeRoom: (state, action: PayloadAction<string>) => {
            const index = state.allRooms.findIndex(r=>r.roomId == action.payload);
            if(index != -1){
                state.allRooms.splice(index, 1);
            }
        },
        setSearchedUser: (state, action: PayloadAction<LobbyUser>) => {
            let u: ILobbyUser = JSON.parse(JSON.stringify(action.payload));
            state.searchedUser = u;
        }
    }
});

export const {
    pushMessage,
    pushLeaderboard,
    pushBotLeaderboard,
    addUser,
    changeUser,
    removeUser,
    setUser,
    setTabIndex,
    addRoom,
    removeRoom,
    setSearchedUser
} = lobbySlice.actions;

export default lobbySlice.reducer;