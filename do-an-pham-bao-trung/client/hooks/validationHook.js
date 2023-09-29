import { useState } from 'react'
import { validateEmpty, validateEmail, validatePhoneNumber } from '../js/commonFn'

export const useValidate = (fields) => {
  const [errors, setErrors] = useState(() => {
    const result = {}
    for (const key in fields) {
      result[key] = ''
    }
    return result
  })

  const validate = (data) => {
    const validationResult = { ...errors }
    let isValid = true

    for (const key in fields) {
      const field = fields[key]
      const rules = field.rules
      const name = field.name
      let value = data[key]
      const parent = field.parent

      if (parent) {
        value = data[parent][key]
      }

      validationResult[key] = ''

      if (value === undefined && rules.includes('required')) {
        validationResult[key] = `${name} không được để trống`
        isValid = false
        continue
      }

      if (rules.includes('required') && !validateEmpty(value)) {
        validationResult[key] = `${name} không được để trống`
        isValid = false
        continue
      }

      if (rules.includes('email') && value !== '' && !validateEmail(value)) {
        validationResult[key] = `${name} không đúng định dạng`
        isValid = false
        continue
      }

      if (rules.includes('phoneNumber') && value !== '' && !validatePhoneNumber(value)) {
        validationResult[key] = `${name} không đúng định dạng`
        isValid = false
        continue
      }

      if (rules.includes('isColors')) {
        if (!Array.isArray(value)) {
          validationResult[key] = `${name} không đúng định dạng màu xe`
          isValid = false
          continue
        }
        if (value.length === 0) {
          validationResult[key] = `${name} không được để trống`
          isValid = false
          continue
        }

        if (
          value.some((colorItem) => {
            return colorItem.colorName.trim() === '' || colorItem.images.length === 0
          })
        ) {
          validationResult[key] = `${name} cần được điền đủ thông tin`
          isValid = false
          continue
        }

        const isSameColor = false
        const colorsCount = value.length
        for (let index = 0; index < colorsCount; index++) {
          const color = value[index]
          const foundedColor = value.findIndex((c, idx) => c.color === color.color && idx !== index)
          if (foundedColor >= 0) {
            isSameColor = true
            break
          }
        }

        if (isSameColor) {
          validationResult[key] = `${name} không được trùng các mã màu`
          isValid = false
          continue
        }
      }
    }

    setErrors(validationResult)
    return isValid
  }

  const clearErrors = () => {
    const result = {}
    for (const key in fields) {
      result[key] = ''
    }
    setErrors(result)
  }

  const setServerErrors = (serverErrors) => {
    const errors = {}
    serverErrors.forEach((err) => {
      errors[err.param] = err.msg
    })
    setErrors(errors)
  }

  return {
    errors,
    validate,
    clearErrors,
    setServerErrors,
  }
}
