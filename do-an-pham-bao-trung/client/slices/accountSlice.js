import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  accountInfo: null,
  isLoading: false,
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount: (state, action) => {
      if (action.payload) {
        state.accountInfo = {
          _id: action.payload._id,
          code: action.payload.code,
          fullName: action.payload.fullName,
          email: action.payload.email,
          phoneNumber: action.payload.phoneNumber,
          avatar: action.payload.avatar,
          address: action.payload.address,
          isAdmin: action.payload.isAdmin,
        }
      } else {
        state.accountInfo = null
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const { setLoading, setAccount } = accountSlice.actions
export default accountSlice.reducer
