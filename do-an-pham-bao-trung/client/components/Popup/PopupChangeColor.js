import React, { useEffect, useState } from 'react'
import Popup from './Popup'
import Button from '../Button/Button'
import Slide from '../Slide/Slide'
import { ButtonType } from '../../enums/ButtomEnum'

const convertColorList = (color, productId, colors, products) => {
  const selectedColors = []
  const productsCount = products.length
  for (let index = 0; index < productsCount; index++) {
    const product = products[index]
    if (product._id === productId) {
      selectedColors.push(product.color.color)
    }
  }
  const colorList = colors.filter(
    (c) => !selectedColors.includes(c.color) || c.color === color.color
  )

  return colorList.map((color) => {
    const formattedImages = color.images.map((image) => ({ src: image }))
    return {
      ...color,
      formattedImages,
    }
  })
}

const PopupChangeColor = ({
  colors,
  value,
  productId,
  products,
  isActive = false,
  onClose = () => {},
  onChange = () => {},
}) => {
  const [selectedColorIdx, setSelectedColorIdx] = useState(() => {
    const formattedColorList = convertColorList(value, productId, colors, products)
    return formattedColorList.findIndex((c) => c.color === value.color)
  })
  const [formattedColorList, setFormattedColorList] = useState(() => {
    return convertColorList(value, productId, colors, products)
  })

  const handleSelectColor = (idx) => {
    setSelectedColorIdx(idx)
  }

  const handleSave = () => {
    const newColor = colors[selectedColorIdx]
    const newVal = {
      color: newColor.color,
      colorName: newColor.colorName,
      image: newColor.images[0],
    }
    onChange(newVal)
  }

  useEffect(() => {
    const formattedColorList = convertColorList(value, productId, colors, products)
    const idx = formattedColorList.findIndex((c) => c.color === value.color)
    setSelectedColorIdx(idx)
    setFormattedColorList(formattedColorList)
  }, [isActive, value.color])

  return (
    <Popup
      title="Đổi màu"
      isActive={isActive}
      footer={
        <div className="py-4 flex items-center justify-end gap-x-2 px-6">
          <Button
            style={{
              height: 44,
              borderRadius: 6,
            }}
            buttonType={ButtonType.Secondary}
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            style={{
              height: 44,
              borderRadius: 6,
            }}
            onClick={handleSave}
          >
            Đổi
          </Button>
        </div>
      }
      onClose={onClose}
    >
      <div className="text-lg text-center mb-2">
        {formattedColorList[selectedColorIdx].colorName}
      </div>
      <div className="relative shadow-[0_0_10px_0_rgba(0,0,0,0.15)] rounded-lg col-start-1 col-end-3 w-[600px] mb-4">
        <Slide
          items={
            formattedColorList.length ? formattedColorList[selectedColorIdx].formattedImages : []
          }
          height={400}
          objectFit="contain"
        />
      </div>
      <ul className="flex pl-[2px] gap-x-3 mb-1 h-10 items-center justify-center transition-all">
        {formattedColorList.map((color, idx) => {
          let className =
            'h-8 w-8 shadow-lg border border-white ring-2 ring-black cursor-pointer hover:ring-primary transition-all'
          if (idx === selectedColorIdx) {
            className =
              'shadow-lg border border-white ring-2 cursor-pointer ring-primary w-10 h-10 transition-all'
          }
          return (
            <li
              className={className}
              key={idx}
              style={{
                backgroundColor: color.color,
              }}
              onClick={() => handleSelectColor(idx)}
            />
          )
        })}
      </ul>
    </Popup>
  )
}

export default PopupChangeColor
