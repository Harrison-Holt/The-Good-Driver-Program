import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './counterSlice'
/**
 * A template for the store, most of this code will stay, although the slice currently
 * included in the reducer will likely not.
 */

export const store = configureStore({
  reducer: {
    counter: counterSlice
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch