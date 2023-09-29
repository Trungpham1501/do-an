import React from 'react'
import CarColorItem from './CarColorItem'

const CarColorPicker = ({
  value,
  required = false,
  width = null,
  height = null,
  error = '',
  onChange = () => {},
}) => {
  const addColorItem = () => {
    onChange([
      ...value,
      {
        colorName: '',
        color: '#000000',
        images: [],
      },
    ])
  }

  const handleChange = (e, idx) => {
    const newVal = value.map((color, colorIdx) => {
      if (colorIdx === idx) {
        return {
          ...e,
        }
      }
      return color
    })
    onChange(newVal)
  }

  const handleRemoveItem = (idx) => {
    const newVal = JSON.parse(JSON.stringify(value))
    newVal.splice(idx, 1)
    onChange(newVal)
  }

  return (
    <div className="relative">
      {error && (
        <div
          className="group absolute top-0 right-3 text-red-600 flex items-center"
          onClick={addColorItem}
        >
          <i className="fa-solid fa-circle-exclamation"></i>
          <div className="opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible absolute top-1/2 right-[calc(100%_+_4px)] -translate-y-1/2 w-max text-sm text-white bg-red-600 px-2 py-[2px] rounded-md before:absolute before:top-1/2 before:left-full before:-translate-y-1/2 before:border-t-4 before:border-b-4 before:border-t-transparent before:border-b-transparent before:border-r-4 before:border-r-red-600 before:rotate-180">
            {error}
          </div>
        </div>
      )}
      <div className="block w-max text-sm pb-1 relative" onClick={addColorItem}>
        <span className="mr-1">Chọn màu xe</span>
        {required && <span className="text-red-600">*</span>}
        <span className="absolute text-lg -right-6 leading-none text-black hover:text-primary transition-all hover:scale-110 origin-center cursor-pointer">
          <i className="fa-solid fa-circle-plus"></i>
        </span>
      </div>
      <div
        style={{
          width,
          height,
        }}
      >
        <ul className="h-full px-2 pt-2 border border-gray-300 rounded-md overflow-y-auto">
          {value.map((colorItem, idx) => {
            return (
              <CarColorItem
                key={idx}
                idx={idx}
                value={colorItem}
                onChange={handleChange}
                onRemove={handleRemoveItem}
              />
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default CarColorPicker
