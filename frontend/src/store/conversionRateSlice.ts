// conversionRateSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the state
interface ConversionRateState {
  rate: number;
}

const initialState: ConversionRateState = {
  rate: 1, // Default conversion rate is 1
};

const conversionRateSlice = createSlice({
  name: 'conversionRate',
  initialState,
  reducers: {
    setConversionRate: (state, action: PayloadAction<number>) => {
      state.rate = action.payload;
    },
  },
});

export const { setConversionRate } = conversionRateSlice.actions;
export default conversionRateSlice.reducer;
