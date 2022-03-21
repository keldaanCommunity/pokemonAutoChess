import {configureStore} from '@reduxjs/toolkit';
import lobbyReducer from './LobbyStore';
import networkReducer from './NetworkStore';
import preparationReducer from './PreparationStore';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = configureStore({
    reducer: {
        lobby: lobbyReducer,
        network: networkReducer,
        preparation: preparationReducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
    enhancers: composeWithDevTools({})
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;