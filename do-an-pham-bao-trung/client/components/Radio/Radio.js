import React from 'react'

const Radio = ({ name, id, value, checked, label = '', onChange = () => {} }) => {
  let labelClass =
    'relative block w-6 h-6 border border-gray-400 rounded-full bg-white transition-colors'
  if (checked) {
    labelClass =
      'relative block w-6 h-6 border border-gray-400 rounded-full bg-primary border-primary transition-colors'
  }

  return (
    <div className="relative flex items-center">
      <label className={labelClass} htmlFor={id}>
        <div
          style={{
            transform: 'translate(-50%, -50%)',
          }}
          className="absolute top-1/2 left-1/2 h-2 w-2 bg-white rounded-full"
        ></div>
      </label>
      <label className="text-sm pl-2 leading-none" htmlFor={id}>
        {label}
      </label>
      <input
        className="absolute w-1 h-1 opacity-0"
        type="radio"
        name={name}
        id={id}
        onChange={(e) => onChange(e.target.checked, value)}
      />
    </div>
  )
}

export default Radio
