import React, { useEffect, useRef, useState } from 'react'

import { TypeStyle } from '../../enums/InputFieldEnum'

const InputField = ({
  id = '',
  name = '',
  label = '',
  placeholder = '',
  icon = null,
  isAutoFocus = false,
  error = '',
  value = '',
  type = 'text',
  required = false,
  disabled = false,
  typeStyle = TypeStyle.Vip,
  startIcon = null,
  width = '100%',
  height = '110px',
  labelStyle = {},
  onInput = () => {},
  onClickIcon = () => {},
  onKeyDown = () => {},
}) => {
  const [isFocus, setIsFocus] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (isAutoFocus) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [])

  if (typeStyle === TypeStyle.TextArea) {
    let inputClass =
      'h-10 resize-none w-full text-sm text-black outline-none border border-gray-300 rounded-md pl-3 pr-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors caret-primary'
    if (error) {
      inputClass =
        'h-10 resize-none w-full text-sm text-black outline-none border border-red-600 rounded-md pl-3 pr-9 py-2 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-colors caret-red-600'
    }

    if (startIcon) {
      inputClass += ' pl-9'
    }

    if (icon) {
      inputClass += ' pr-9'
    }

    return (
      <div className="w-full">
        <div className="w-full relative">
          {label && (
            <label style={labelStyle} className="block w-max text-sm pb-1" htmlFor={id}>
              <span className="mr-1">{label}</span>
              {required && <span className="text-red-600">*</span>}
            </label>
          )}
          <textarea
            ref={inputRef}
            autoComplete="off"
            className={inputClass}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            style={{
              width,
              height,
            }}
            name={name}
            id={id}
            onChange={(e) => {
              onInput(e)
            }}
          ></textarea>
          {error && (
            <label
              className="group absolute top-9 right-3 text-red-600 flex items-center"
              htmlFor={id}
            >
              <i className="fa-solid fa-circle-exclamation"></i>
              <div className="opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible absolute top-1/2 right-[calc(100%_+_4px)] -translate-y-1/2 w-max text-sm text-white bg-red-600 px-2 py-[2px] rounded-md before:absolute before:top-1/2 before:left-full before:-translate-y-1/2 before:border-t-4 before:border-b-4 before:border-t-transparent before:border-b-transparent before:border-r-4 before:border-r-red-600 before:rotate-180">
                {error}
              </div>
            </label>
          )}
          {startIcon && (
            <label
              className="group absolute top-8 left-3 flex items-center text-gray-500"
              style={{
                top: label ? '' : '9px',
              }}
              htmlFor={id}
            >
              {startIcon}
            </label>
          )}
          {icon && (
            <label
              className="group absolute right-3 flex items-center text-gray-500"
              style={{
                top: label ? '' : '9px',
              }}
              htmlFor={id}
            >
              {icon}
            </label>
          )}
        </div>
      </div>
    )
  }

  if (typeStyle === TypeStyle.Normal) {
    let inputClass =
      'h-10 w-full text-sm text-black outline-none border border-gray-300 rounded-md pl-3 pr-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors caret-primary'
    if (error) {
      inputClass =
        'h-10 w-full text-sm text-black outline-none border border-red-600 rounded-md pl-3 pr-9 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-colors caret-red-600'
    }

    if (startIcon) {
      inputClass += ' pl-9'
    }

    if (icon) {
      inputClass += ' pr-9'
    }

    return (
      <div className="w-full">
        <div className="w-full relative">
          {label && (
            <label style={labelStyle} className="block w-max text-sm pb-1" htmlFor={id}>
              <span className="mr-1">{label}</span>
              {required && <span className="text-red-600">*</span>}
            </label>
          )}
          <input
            ref={inputRef}
            autoComplete="off"
            className={inputClass}
            type={type}
            id={id}
            name={name}
            placeholder={placeholder}
            value={value}
            disabled={disabled}
            onChange={(e) => {
              onInput(e)
            }}
            onKeyDown={(e) => onKeyDown(e)}
          />
          {error && (
            <label
              className="group absolute top-9 right-3 text-red-600 flex items-center"
              htmlFor={id}
            >
              <i className="fa-solid fa-circle-exclamation"></i>
              <div className="opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible absolute top-1/2 right-[calc(100%_+_4px)] -translate-y-1/2 w-max text-sm text-white bg-red-600 px-2 py-[2px] rounded-md before:absolute before:top-1/2 before:left-full before:-translate-y-1/2 before:border-t-4 before:border-b-4 before:border-t-transparent before:border-b-transparent before:border-r-4 before:border-r-red-600 before:rotate-180">
                {error}
              </div>
            </label>
          )}
          {startIcon && (
            <label
              className="group absolute top-8 left-3 flex items-center text-gray-500"
              style={{
                top: label ? '' : '9px',
              }}
              htmlFor={id}
            >
              {startIcon}
            </label>
          )}
          {icon && (
            <label
              className="group absolute right-3 flex items-center text-gray-500"
              style={{
                top: label ? '' : '9px',
              }}
              htmlFor={id}
              onClick={onClickIcon}
            >
              {icon}
            </label>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#f3f6fb] h-[62px] mb-[30px] p-[3px] rounded-[16px]">
      <div className="h-full w-full flex flex-col relative overflow-hidden">
        <input
          ref={inputRef}
          className={`h-full w-full outline-none border-2 pl-4 pt-5 text-base font-bold bg-transparent rounded-2xl transition-colors duration-200 ease-in-out ${
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-transparent focus:border-primary'
          } focus:bg-white`}
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onInput={(e) => onInput(e)}
          onBlur={() => setIsFocus(false)}
          onFocus={() => setIsFocus(true)}
        />
        <label
          className={`absolute left-[18px] ${
            isFocus || value !== '' ? 'top-[10px] text-xs' : 'top-4 text-lg'
          } text-[#7a818a] transition-all duration-300 ease-in-out`}
          htmlFor={id}
        >
          {label}
        </label>
        {icon && (
          <label
            className="absolute top-1/2 right-5 -translate-y-1/2 flex items-center fill-[#8d9aaf]"
            htmlFor={id}
          >
            {icon}
          </label>
        )}
      </div>
      {error && <div className="text-sm text-red-500 pt-2">{error}</div>}
    </div>
  )
}

export default InputField
