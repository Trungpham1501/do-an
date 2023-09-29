import React, { useState } from 'react'

const ColorPicker = ({ id, name, value, label = '', onChange = () => {}, required = false }) => {
  const [inputClass, setInputClass] = useState(
    'flex items-center h-10 border border-gray-300 rounded-md px-3 transition-colors'
  )
  const handleFocus = () => {
    setInputClass(
      'flex items-center h-10 border border-primary ring-2 ring-primary/20 rounded-md px-3 transition-colors'
    )
  }

  const handleBlur = () => {
    setInputClass('flex items-center h-10 border border-gray-300 rounded-md px-3 transition-colors')
  }

  return (
    <div className="w-full">
      <label className="block w-max text-sm pb-1" htmlFor={id}>
        <span className="mr-1">{label}</span>
        {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        <input
          className="w-1 h-1 absolute opacity-0"
          type="color"
          name={name}
          id={id}
          value={value}
          onChange={(e) => onChange(e)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <label htmlFor={id} className={inputClass}>
          <div
            className="w-6 h-6 rounded-full mr-1"
            style={{
              backgroundColor: value,
            }}
          ></div>
          <div className="text-sm leading-none">{value}</div>
        </label>
      </div>
    </div>
  )
}

export default ColorPicker
