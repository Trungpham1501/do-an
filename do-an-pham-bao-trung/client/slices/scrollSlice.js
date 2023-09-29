import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  scrollVal: 0,
  isTriggerScrollTop: false,
}

const scrollSlice = createSlice({
  name: 'scroll',
  initialState,
  reducers: {
    setScrollVal(state, action) {
      state.scrollVal = action.payload
    },
    triggerScrollTop(state) {
      state.isTriggerScrollTop = !state.isTriggerScrollTop
    },
  },
})

export const { setScrollVal, triggerScrollTop } = scrollSlice.actions
export default scrollSlice.reducer
