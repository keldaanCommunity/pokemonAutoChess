import {enableMapSet} from 'immer';
import {configureStore} from '@reduxjs/toolkit';
import lobbyReducer from './LobbyStore';
import networkReducer from './NetworkStore';

enableMapSet();

const store = configureStore({
    reducer: {
        lobby: lobbyReducer,
        network: networkReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['network/logIn','network/logOut'],
        // Ignore these field paths in all actions
        ignoredActionPaths: [],
        // Ignore these paths in the state
        ignoredPaths: ['network.client', 'network.user'],
      },
    })
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;