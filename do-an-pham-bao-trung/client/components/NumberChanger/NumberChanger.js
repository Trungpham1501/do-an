import React from 'react'

const NumberChanger = ({ value, onChange = () => {} }) => {
  return (
    <div className="flex gap-x-2 h-7 rounded-lg overflow-hidden border border-gray-300 w-min">
      <div
        className="text-sm w-7 h-full bg-white text-gray-500 flex items-center justify-center hover:bg-primary/80 hover:text-white cursor-pointer transition-colors"
        onClick={() => onChange(value - 1)}
      >
        <i className="fa-solid fa-minus"></i>
      </div>
      <div className="w-5 flex items-center justify-center text-sm text-center">{value}</div>
      <div
        className="text-sm w-7 h-full bg-white text-gray-500 flex items-center justify-center hover:bg-primary/80 hover:text-white cursor-pointer transition-colors"
        onClick={() => onChange(value + 1)}
      >
        <i className="fa-solid fa-plus"></i>
      </div>
    </div>
  )
}

export default NumberChanger
