import { useDispatch, useSelector } from 'react-redux'

export const useToastMsg = () => {
  const msg = useSelector((state) => state.toastMsg.msg)
  const status = useSelector((state) => state.toastMsg.status)
  const isActive = useSelector((state) => state.toastMsg.isActive)
  const dispatch = useDispatch()

  const openToastMsg = (status, msg) => {
    if (!msg && status === 'error') {
      dispatch(openToastMsg('Có lỗi xảy ra', status))
    } else {
      dispatch(openToastMsg(msg, status))
    }
  }

  const closeToastMsg = () => {
    dispatch(closeToastMsg())
  }

  return { msg, status, isActive, openToastMsg, closeToastMsg }
}
