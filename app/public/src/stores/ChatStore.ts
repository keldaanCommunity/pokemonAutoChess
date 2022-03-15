import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IMessage} from '../../../types/index';

export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        messages: new Array<IMessage>()
    },
    reducers: {
        pushMessage: (state, action: PayloadAction<IMessage>) =>{
            state.messages.push(action.payload);
        }
    }
});

export const {
    pushMessage
} = chatSlice.actions;

export default chatSlice.reducer;