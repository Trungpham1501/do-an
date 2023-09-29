import React, { useEffect, useState } from 'react'

const Popup = ({
  children,
  title = '',
  isActive = false,
  isLoading = false,
  isActiveLoadingScreen = true,
  onClose = () => {},
  footer = null,
}) => {
  const [isShow, setIsShow] = useState(isActive)

  useEffect(() => {
    if (isActive) {
      setIsShow(true)
    }
  }, [isActive])

  let className =
    'fixed top-0 left-0 w-full h-screen z-40 backdrop-blur-md flex items-center justify-center p-6 opacity-0 invisible transition-all duration-200'
  if (isActive) {
    className =
      'fixed top-0 left-0 w-full h-screen z-40 backdrop-blur-md flex items-center justify-center p-6 opacity-100 visible transition-all duration-200'
  }

  const handleRemoveChildren = () => {
    if (!isActive) {
      setTimeout(() => {
        setIsShow(false)
      }, 200)
    }
  }

  const handleClose = () => {
    if (isLoading) {
      return
    }
    onClose()
  }

  return (
    <div className={className} onTransitionEnd={handleRemoveChildren}>
      <div
        style={{
          paddingTop: '24px',
          paddingBottom: footer ? null : '24px',
        }}
        className="relative bg-white min-w-[300px] h-min rounded-xl shadow-[0_0_10px_0_rgba(0,0,0,0.15)]"
      >
        {isLoading && isActiveLoadingScreen && (
          <div className="absolute flex items-center justify-center z-10 top-0 left-0 w-full h-full backdrop-blur-sm">
            <div className="h-24 w-24 border-4 border-y-transparent border-x-primary rounded-full animate-spin" />
          </div>
        )}
        <div
          className="absolute z-20 w-6 h-6 flex items-center justify-center top-4 right-4 text-lg cursor-pointer hover:text-primary/80 transition-colors"
          onClick={handleClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </div>
        {title && <div className="text-2xl font-bold mb-6 leading-none px-6">{title}</div>}
        <div className="px-6 overflow-auto">{isShow && <div>{children}</div>}</div>
        {footer && <div>{footer}</div>}
      </div>
    </div>
  )
}

export default Popup
