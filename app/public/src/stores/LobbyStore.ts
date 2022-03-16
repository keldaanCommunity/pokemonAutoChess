import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LobbyUser from "../../../models/colyseus-models/lobby-user";
import Message from "../../../models/colyseus-models/message";
import LeaderboardInfo from "../../../models/colyseus-models/leaderboard-info";

interface IUserLobbyState {
    messages: Message[];
    users: Map<string,LobbyUser>;
    leaderboard: LeaderboardInfo[];
    botLeaderboard: LeaderboardInfo[];
    user: LobbyUser;
}

const initialState: IUserLobbyState = {
    messages : [],
    users : new Map<string,LobbyUser>(),
    leaderboard : [],
    botLeaderboard : [],
    user: undefined
}

export const lobbySlice = createSlice({
    name: 'lobby',
    initialState: initialState,
    reducers: {
        pushMessage: (state, action: PayloadAction<Message>) =>{
            state.messages.push(action.payload);
        },
        pushLeaderboard: (state, action: PayloadAction<LeaderboardInfo>) => {
            state.leaderboard.push(action.payload);
        },
        pushBotLeaderboard: (state, action: PayloadAction<LeaderboardInfo>) => {
            state.botLeaderboard.push(action.payload);
        },
        addUser: (state, action: PayloadAction<LobbyUser>) => {
            state.users.set(action.payload.id, action.payload);
        },
        changeUser: (state, action: PayloadAction<{id: string, field: string, value: any}>) => {
            state.users.get(action.payload.id)[action.payload.field] = action.payload.value;
        },
        removeUser: (state, action: PayloadAction<string>) => {
            state.users.delete(action.payload);
        },
        setUser: (state, action: PayloadAction<LobbyUser>) => {
            state.user = action.payload;
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
    setUser
} = lobbySlice.actions;

export default lobbySlice.reducer;