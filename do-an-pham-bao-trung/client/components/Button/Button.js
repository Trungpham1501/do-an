import React from 'react'
import { ButtonType } from '../../enums/ButtomEnum'

const Button = ({
  children,
  type,
  style,
  buttonType = ButtonType.Primary,
  className = '',
  disabled = false,
  isLoading = false,
  onClick = () => {},
}) => {
  if (buttonType === ButtonType.Secondary) {
    let btnClassName = `h-11 min-w-[140px] rounded-md font-bold outline-none flex items-center justify-center border text-gray-500 border-gray-300 cursor-pointer disabled:bg-gray-200 disabled:hover:text-gray-500 disabled: hover:bg-gray-300 hover:text-black focus:bg-gray-300 focus:text-black transition-colors duration-300 disabled:cursor-not-allowed ${className}`
    return (
      <button
        type={type}
        style={style}
        className={btnClassName}
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      style={style}
      type={type}
      disabled={disabled || isLoading}
      className={`h-[52px] flex items-center justify-center border-none outline-none rounded-[26px] bg-primary text-base font-bold text-white px-[34px] min-w-[140px] cursor-pointer relative overflow-hidden before:absolute before:top-0 before:left-full before:w-full before:h-full before:bg-white/10 before:transition-[left] before:duration-300 before:ease-in-out hover:before:left-0 focus:before:left-0 disabled:before:left-0 disabled:before:bg-white/30 ${
        disabled ? 'cursor-not-allowed' : ''
      } ${isLoading ? 'cursor-wait' : ''} ${className}`}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute flex items-center justify-center z-10 top-0 left-0 w-full h-full bg-primary">
          <div className="h-6 w-6 border-4 border-y-transparent border-x-white rounded-full animate-spin" />
        </div>
      )}
      {children}
    </button>
  )
}

export default Button
