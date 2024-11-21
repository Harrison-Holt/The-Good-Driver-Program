import { createSlice, PayloadAction } from '@reduxjs/toolkit'
//import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from './store'

// Define a type for the slice state
interface UserState {
  loggedIn: boolean
  userName: string | null
  firstName: string | null
  lastName: string | null
  email: string | null
  userType: string
  
}
type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};
// Define the initial state using that type
const initialState: UserState = {
  loggedIn: false,
  userName: null,
  firstName: null,
  lastName: null,
  email: null,
  userType: "driver"
}

export const userSlice = createSlice({
  name: 'currentUser',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string | null>) => {
      state.userName = action.payload
      state.loggedIn = true;
    },
    logout: (state) => {
      state.loggedIn = false;
    },
    setUserType: (state, action: PayloadAction<string>) => {
      state.userType = action.payload
    },
    setFirstName: (state, action: PayloadAction<string>) => {
      state.firstName = action.payload
    },
    setLastName: (state, action: PayloadAction<string>) => {
      state.lastName = action.payload
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    // Leaving this line for now as an example of proper typing of action payloads
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
})

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
      items: [] as CartItem[],
  },
  reducers: {
      addToCart: (state, action: PayloadAction<CartItem>) => {
          state.items.push(action.payload);
      },
      resetCart: (state) => {
          state.items = [];
      },
  },
});
export const {login, logout, setUserType, setFirstName, setLastName, setEmail} = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLogin = (state: RootState) => state.currentUser.loggedIn
export const selectUserType = (state: RootState) => state.currentUser.userType
export const selectUserName = (state: RootState) => state.currentUser.userName
export const selectEmail = (state: RootState) => state.currentUser.email
export const selectFirstName = (state: RootState) => state.currentUser.firstName
export const selectLastName = (state: RootState) => state.currentUser.lastName
export const { addToCart, resetCart } = cartSlice.actions;

export default userSlice.reducer