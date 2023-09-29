import React from 'react'

const Checkbox = ({ id, name, checked, onChange = () => {} }) => {
  let labelClass =
    'relative flex items-center justify-center rounded-md w-6 h-6 border border-gray-300 bg-white hover:border-primary transition-colors'
  let labelIcon =
    'flex items-center justify-center text-white scale-0 origin-center transition-all duration-200'
  if (checked) {
    labelClass =
      'relative flex items-center justify-center rounded-md w-6 h-6 border border-primary bg-primary hover:border-primary transition-colors'
    labelIcon =
      'flex items-center justify-center text-white scale-100 origin-center transition-all duration-200'
  }

  return (
    <div className="relative w-6 h-6">
      <input
        className="absolute w-1 h-1 opacity-0"
        type="checkbox"
        name={name}
        id={id}
        checked={checked}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
      />
      <label className={labelClass} htmlFor={id}>
        <div className={labelIcon}>
          <i className="fa-solid fa-check"></i>
        </div>
      </label>
    </div>
  )
}

export default Checkbox
