import React, { useEffect, useRef, useState } from 'react'
import { numberWithCommas } from '../../js/commonFn'

const InputFieldNumber = ({
  id = '',
  name = '',
  label = '',
  placeholder = '',
  isAutoFocus = false,
  error = '',
  value = '',
  required = false,
  onInput = () => {},
}) => {
  const inputRef = useRef(null)
  const [valueInput, setValueInput] = useState(value ? numberWithCommas(value) : '')

  useEffect(() => {
    if (isAutoFocus) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (value) {
      setValueInput(numberWithCommas(value))
    } else {
      setValueInput('')
    }
  }, [value])

  let inputClass =
    'h-10 text-right w-full text-sm text-black outline-none border border-gray-300 rounded-md pl-3 pr-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors caret-primary'
  if (error) {
    inputClass =
      'h-10 text-right w-full text-sm text-black outline-none border border-red-600 rounded-md pl-3 pr-9 focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-colors caret-red-600'
  }

  const handleChange = (e) => {
    const number = Number(e.target.value.replaceAll('.', ''))
    onInput(number)
  }

  const handleKeyDown = (e) => {
    const { key } = e
    if (!/\d/.test(key) && key.length === 1) {
      e.preventDefault()
    }
  }

  return (
    <div className="w-full">
      <div className="w-full relative">
        <label className="block w-max text-sm pb-1" htmlFor={id}>
          <span className="mr-1">{label}</span>
          {required && <span className="text-red-600">*</span>}
        </label>
        <input
          ref={inputRef}
          autoComplete="off"
          className={inputClass}
          type="text"
          id={id}
          name={name}
          placeholder={placeholder}
          value={valueInput}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
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
      </div>
    </div>
  )
}

export default InputFieldNumber
