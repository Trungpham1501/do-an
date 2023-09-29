import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import baseApi from '../../api/BaseApi'
import { useDispatch, useSelector } from 'react-redux'
import { setAccount } from '../../slices/accountSlice'
import { useAccount } from '../../hooks/accountHook'

import Cart from '../Cart/Cart'
import { useCart } from '../../hooks/cartHook'
import { setScrollVal } from '../../slices/scrollSlice'

const Container = ({ children }) => {
  const [className, setClassName] = useState('w-full h-[calc(100vh_-_56px)] overflow-auto')
  const containerRef = useRef(null)
  const isTriggerScrollTop = useSelector((state) => state.scroll.isTriggerScrollTop)
  const router = useRouter()

  const dispatch = useDispatch()
  const { accountInfo, initCart } = useAccount()
  const { isActivePopup: isActiveCart } = useCart()

  useEffect(() => {
    const getAccountInfo = async () => {
      try {
        const res = await baseApi.get('/users/currentUser')
        if (res.data.success) {
          dispatch(setAccount(res.data.data))
          initCart(res.data.data)
        }
      } catch (error) {
        console.log(error)
        if (error.response?.status !== 401) {
          console.log(error)
        }
      }
    }

    const scrollHandler = (e) => {
      const { scrollTop } = e.target
      dispatch(setScrollVal(scrollTop))
    }

    containerRef.current?.addEventListener('scroll', scrollHandler)

    getAccountInfo()

    return () => {
      containerRef.current?.removeEventListener('scroll', scrollHandler)
    }
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      if (router.pathname === '/sign-in' || router.pathname === '/register') {
        setClassName('w-full h-screen overflow-hidden')
      } else if (router.pathname.includes('admin') && accountInfo?.isAdmin) {
        setClassName('w-full h-[calc(100vh_-_56px)] overflow-auto grid grid-cols-[200px_1fr]')
      } else {
        setClassName('w-full h-[calc(100vh_-_56px)] overflow-auto')
      }
      containerRef.current.scrollTo(0, 0)
    }
  }, [router, accountInfo])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0)
    }
  }, [isTriggerScrollTop])

  return (
    <div ref={containerRef} className={className}>
      <Cart isActive={isActiveCart} />
      {children}
    </div>
  )
}

export default Container
