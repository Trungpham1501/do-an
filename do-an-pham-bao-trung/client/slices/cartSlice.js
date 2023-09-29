import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
  totalNumber: 0,
  totalMoney: 0,
  isActivePopup: false,
  isLoading: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      let totalNumber = 0
      let totalMoney = 0
      action.payload.forEach((product) => {
        totalNumber += product.number
        totalMoney += product.number * product.price
      })
      state.products = [...action.payload]
      state.totalNumber = totalNumber
      state.totalMoney = totalMoney
    },

    setTotalNumber: (state, action) => {
      state.totalNumber = action.payload
    },

    togglePopup: (state, action) => {
      state.isActivePopup = action.payload
    },

    toggleLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
})

export const { setProducts, setTotalNumber, togglePopup, toggleLoading } = cartSlice.actions
export default cartSlice.reducer
