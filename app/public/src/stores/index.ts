import { configureStore } from "@reduxjs/toolkit"
import { enableMapSet } from "immer"
import afterReducer from "./AfterGameStore"
import gameReducer from "./GameStore"
import lobbyReducer from "./LobbyStore"
import networkReducer from "./NetworkStore"
import preparationReducer from "./PreparationStore"

enableMapSet()

const store = configureStore({
  reducer: {
    lobby: lobbyReducer,
    network: networkReducer,
    preparation: preparationReducer,
    game: gameReducer,
    after: afterReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
  devTools: true
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store
