import React, { useEffect } from 'react'
import { useToastMsg } from '../../hooks/toastMsgHook'

import { ToastMsgStatus } from '../../enums/ToastMsgEnum'
import { useDispatch } from 'react-redux'
import { closeToastMsg } from '../../slices/toastMsgSlice'

const ToastMsg = () => {
  const { msg, status, isActive } = useToastMsg()
  const dispatch = useDispatch()

  useEffect(() => {
    let timeoutFunc = null
    if (isActive) {
      timeoutFunc = setTimeout(() => {
        dispatch(closeToastMsg())
      }, 5000)
    }

    return () => {
      clearTimeout(timeoutFunc)
    }
  }, [isActive])

  let className =
    'fixed z-50 top-12 right-[-500px] rounded-md flex items-center h-9 bg-white px-4 shadow-[0_0_5px_2px_rgba(0,0,0,0.15)] transition-all duration-300'
  if (isActive) {
    className =
      'fixed z-[51] top-12 right-8 rounded-md flex items-center h-9 bg-white px-4 shadow-[0_0_5px_2px_rgba(0,0,0,0.15)] transition-all duration-300'
  }

  return (
    <div className={className}>
      <div className="flex items-center mr-2 text-xl">
        {status === ToastMsgStatus.Success ? (
          <span className="text-green-400 leading-none">
            <i className="fa-solid fa-circle-check"></i>
          </span>
        ) : status === ToastMsgStatus.Error ? (
          <span className="text-red-600 leading-none">
            <i className="fa-solid fa-circle-exclamation"></i>
          </span>
        ) : (
          <span className="text-primary leading-none">
            <i className="fa-solid fa-circle-info"></i>
          </span>
        )}
      </div>
      <div
        title={msg}
        className="min-w-[200px] max-w-[500px] text-ellipsis whitespace-nowrap overflow-hidden"
      >
        {msg}
      </div>
      <div
        className="ml-2 flex items-center cursor-pointer hover:text-primary"
        onClick={() => dispatch(closeToastMsg())}
      >
        <i className="fa-solid fa-xmark"></i>
      </div>
    </div>
  )
}

export default ToastMsg
