import { createSlice } from '@reduxjs/toolkit'

import { ToastMsgStatus } from '../enums/ToastMsgEnum'

const initialState = {
  isActive: false,
  status: ToastMsgStatus.Info,
  msg: '',
}

const toastMsgSlice = createSlice({
  name: 'toastMsg',
  initialState,
  reducers: {
    openToastMsg: (state, action) => {
      const { msg, status } = action.payload
      state.msg = msg
      state.status = status
      state.isActive = true
    },

    closeToastMsg: (state) => {
      state.isActive = false
    },
  },
})

export const { openToastMsg, closeToastMsg } = toastMsgSlice.actions
export default toastMsgSlice.reducer
