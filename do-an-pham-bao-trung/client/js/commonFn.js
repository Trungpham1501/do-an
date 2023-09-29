/**
 * Convert Price
 * @param {number} price
 * @returns formatted price
 */
export const convertPrice = (price) => {
  if (price) {
    const priceStr = price.toString()
    let priceArr = priceStr.split('')
    const newPriceArr = []
    const priceArrLength = priceArr.length - 1
    let i = 0
    for (let index = priceArrLength; index >= 0; index--) {
      const character = priceArr[index]
      newPriceArr.unshift(character)
      i += 1
      if (i === 3 && index !== 0) {
        newPriceArr.unshift('.')
        i = 0
      }
    }
    return `${newPriceArr.join('')}đ`
  }
  return ''
}

export const convertDate = (value, formas = 'dd/MM/yyyy') => {
  if (!value) {
    return ''
  }

  let date = value
  if (typeof value === 'string') {
    date = new Date(value)
  }
  if (!(date instanceof Date)) {
    return ''
  }

  const d = date.getDate()
  const m = date.getMonth() + 1
  const y = date.getFullYear()

  formas = formas.replace('dd', d < 10 ? `0${d}` : d)
  formas = formas.replace('MM', m < 10 ? `0${m}` : m)
  formas = formas.replace('yyyy', y)
  return formas
}

export const numberWithCommas = (number) => {
  if (!number) {
    return ''
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const validateEmail = (email) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

export const validateEmpty = (value) => {
  if (typeof value === 'string') {
    return value.trim() !== ''
  }
  if (typeof value === 'number') {
    return value.toString().trim() !== '' && value > 0
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  return true
}

export const validatePhoneNumber = (value) => {
  if (typeof value !== 'string') {
    return false
  }
  return /^\d*\d$/.test(value) && value.length === 10
}

export const validatePassword = (password) => {
  return /^[a-zA-Z](?=.*?[0-9])/i.test(password.trim())
}
