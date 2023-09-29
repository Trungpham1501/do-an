import { useState } from 'react'
import baseApi from '../api/BaseApi'

export const useFetch = (url) => {
  const [isLoading, setIsLoading] = useState(false)

  const post = async (data, customUrl = null) => {
    setIsLoading(true)
    try {
      const res = await baseApi.post(customUrl || url, data)
      setIsLoading(false)
      return res.data
    } catch (error) {
      setIsLoading(false)
      console.log(error.response)
      return error.response
    }
  }

  const get = async (customUrl = null) => {
    setIsLoading(true)
    try {
      const res = await baseApi.get(customUrl || url)
      setIsLoading(false)
      return res.data
    } catch (error) {
      setIsLoading(false)
      console.log(error.response)
      return error.response
    }
  }

  return {
    isLoading,
    post,
    get,
  }
}
