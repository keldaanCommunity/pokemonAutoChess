import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import SimplePlayer from "../../../models/colyseus-models/simple-player";

interface IUserAfterState {
    players: SimplePlayer[]
}

const initialState: IUserAfterState = {
    players: new Array<SimplePlayer>()
}

export const afterSlice = createSlice({
    name: 'after',
    initialState: initialState,
    reducers: {
        addPlayer: (state, action: PayloadAction<SimplePlayer>) => {
            state.players.push(JSON.parse(JSON.stringify(action.payload)));
        },
        leaveAfter: () => initialState
    }
});

export const {
    addPlayer,
    leaveAfter
} = afterSlice.actions;

export default afterSlice.reducer;