import { configureStore } from '@reduxjs/toolkit'
import userSlice from './userSlice'
import conversionRateSlice from './conversionRateSlice'; 

export const store = configureStore({
  reducer: {
    currentUser: userSlice,
    conversionRate: conversionRateSlice
  },
})

export type RootState = ReturnType<typeof store.getState>