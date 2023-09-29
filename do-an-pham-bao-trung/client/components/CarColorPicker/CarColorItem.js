import React from 'react'

import ImageUploader from '../ImageUploader/ImageUploader'
import InputField from '../InputField/InputField'
import ColorPicker from '../ColorPicker/ColorPicker'

import { TypeStyle } from '../../enums/InputFieldEnum'

const CarColorItem = ({ idx, value, onChange = () => {}, onRemove = () => {} }) => {
  const idColorCode = `car-color-picker-color-code-${idx}`
  const idColorName = `car-color-picker-color-name-${idx}`
  const idColorImages = `car-color-picker-color-images-${idx}`

  return (
    <li className="mb-2 pt-2 relative">
      <div
        className="absolute top-1 right-1 flex items-center text-sm text-gray-500 cursor-pointer hover:text-red-600 transition-colors"
        onClick={() => onRemove(idx)}
      >
        <i className="fa-solid fa-xmark"></i>
      </div>
      <div className="grid grid-cols-3 gap-1 mb-1">
        <div className="col-start-1 col-end-3">
          <InputField
            name={idColorName}
            id={idColorName}
            label="Tên màu"
            required={true}
            typeStyle={TypeStyle.Normal}
            value={value.colorName}
            onInput={(e) =>
              onChange(
                {
                  ...value,
                  colorName: e.target.value,
                },
                idx
              )
            }
          />
        </div>
        <div>
          <ColorPicker
            id={idColorCode}
            name={idColorCode}
            value={value.color}
            label="Mã màu"
            required
            onChange={(e) =>
              onChange(
                {
                  ...value,
                  color: e.target.value,
                },
                idx
              )
            }
          />
        </div>
      </div>
      <div>
        <ImageUploader
          id={idColorImages}
          name={idColorImages}
          label="Hình ảnh"
          required
          isMultiple
          value={value.images}
          onChange={(e) =>
            onChange(
              {
                ...value,
                images: e,
              },
              idx
            )
          }
        />
      </div>
    </li>
  )
}

export default CarColorItem
