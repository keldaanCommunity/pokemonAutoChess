import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { STATE } from "../../../models/enum";
import { IPlayer } from "../../../types";


const initialState = {
    afterGameId: '',
    roundTime: 30,
    phase: STATE.PICK,
    players: new Map<string,IPlayer>(),
    stageLevel: 0,
    mapName: ''
}

export const gameSlice = createSlice({
    name: 'game',
    initialState: initialState,
    reducers: {
        setRoundTime: (state, action: PayloadAction<number>) => {
            state.roundTime = action.payload;
        },
        setAfterGameId: (state, action: PayloadAction<string>) => {
            state.afterGameId = action.payload;
        },
        setPhase: (state, action: PayloadAction<string>) => {
            state.phase = action.payload;
        },
        setStageLevel: (state, action: PayloadAction<number>) => {
            state.stageLevel = action.payload;
        },
        setMapName: (state, action: PayloadAction<string>) => {
            state.mapName = action.payload;
        },
        addPlayer: (state, action: PayloadAction<IPlayer>) => {
            state.players.set(action.payload.id, JSON.parse(JSON.stringify(action.payload)));
        }
    }
});

export const {
    setRoundTime,
    setAfterGameId,
    setPhase,
    setStageLevel,
    setMapName,
    addPlayer
} = gameSlice.actions;

export default gameSlice.reducer;