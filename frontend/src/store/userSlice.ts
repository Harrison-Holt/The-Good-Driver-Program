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

// Define the initial state using that type
const initialState: UserState = {
  loggedIn: false,
  userName: null,
  firstName: null,
  lastName: null,
  email: null,
  userType: "sponsor"
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
    // Leaving this line for now as an example of proper typing of action payloads
    // // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload
    // },
  },
})

export const {login, logout } = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLogin = (state: RootState) => state.currentUser.loggedIn
export const selectUserType = (state: RootState) => state.currentUser.userType
export const selectUserName = (state: RootState) => state.currentUser.userName

export default userSlice.reducer