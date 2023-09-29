import React from 'react'
import Radio from './Radio'

const RadioGroup = ({
  items,
  id,
  name,
  value = '',
  required = false,
  label = '',
  onChange = () => {},
}) => {
  const handleChange = (checked, itemValue) => {
    if (checked) {
      onChange(itemValue)
    }
  }

  return (
    <div>
      <label className="block w-max text-sm pb-1" htmlFor={id}>
        <span className="mr-1">{label}</span>
        {required && <span className="text-red-600">*</span>}
      </label>
      <ul className="h-10 flex items-center gap-4">
        {items.map((item) => {
          const itemId = `radio-item-${id}-${item._id}`
          return (
            <li key={item._id}>
              <Radio
                id={itemId}
                name={name}
                label={item.name}
                value={item._id}
                checked={item._id === value}
                onChange={handleChange}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default RadioGroup
