import React, { useState, useEffect } from 'react'
import Logo from '../Logo/Logo'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAccount } from '../../hooks/accountHook'
import { useCart } from '../../hooks/cartHook'

export const NAV_LINKS = [
  {
    name: 'Trang chủ',
    url: '/home',
  },
  {
    name: 'Giới thiệu',
    url: '/intro',
  },
  {
    name: 'Sản phẩm',
    url: '/products',
  },
  {
    name: 'Liên hệ',
    url: '/contact',
  },
]

const Navbar = () => {
  const [isActive, setIsActive] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isVisibleMenu, setIsVisibleMenu] = useState(true)
  const { accountInfo, signOut } = useAccount()
  const { totalNumber, toggleCart } = useCart()

  const router = useRouter()

  useEffect(() => {
    if (router.pathname === '/sign-in' || router.pathname === '/register') {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }

    if (router.pathname.includes('admin') && accountInfo?.isAdmin) {
      setIsVisibleMenu(false)
    } else {
      setIsVisibleMenu(true)
    }
  }, [router.pathname, accountInfo])

  if (!isVisible) {
    return null
  }

  const openCart = () => {
    toggleCart(true)
  }

  return (
    <div className="relative h-14">
      <div className="w-full h-full flex items-center justify-between px-6 shadow-lg absolute z-20">
        <Logo />

        {isVisibleMenu && (
          <div
            className={`absolute top-0 w-full h-screen bg-white z-20 transition-all duration-300 ${
              isActive ? 'left-0' : '-left-full'
            }
            lg:relative lg:top-0 lg:left-0 lg:mx-auto lg:h-full lg:w-[calc(100%_-_400px)] xl:w-[calc(100%_-_800px)]`}
          >
            <div
              className="cursor-pointer text-xl leading-none hover:text-primary transition-colors absolute top-6 right-6 lg:hidden"
              onClick={() => setIsActive(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
            <ul className="w-full h-full flex flex-col justify-center lg:flex-row lg:items-center lg:gap-x-3 xl:gap-x-12">
              {NAV_LINKS.map((navLink, idx) => {
                let className =
                  'relative h-10 px-2 text-2xl text-center flex items-center justify-center font-medium hover:text-primary transition-colors lg:text-base lg:h-full before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:bg-primary before:scale-0 before:hidden lg:before:block hover:before:scale-100 before:transition-[transform] before:duration-300'
                if (router.pathname.includes(navLink.url)) {
                  className =
                    'relative h-10 px-2 text-2xl text-center flex items-center justify-center text-primary font-medium hover:text-primary transition-colors lg:text-base lg:h-full before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:bg-primary before:scale-100 before:hidden lg:before:block'
                }
                return (
                  <li className="flex justify-center my-4 lg:my-0 lg:h-full" key={idx}>
                    <Link className="block h-full" href={navLink.url}>
                      <a className={className}>{navLink.name}</a>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div className="flex items-center gap-x-4">
          {accountInfo ? (
            <div className="flex items-center gap-x-4">
              {isVisibleMenu && (
                <div
                  className="relative cursor-pointer text-xl leading-none hover:text-primary transition-colors"
                  onClick={openCart}
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                  {totalNumber > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center leading-none">
                      {totalNumber}
                    </span>
                  )}
                </div>
              )}
              <div className="group relative flex items-center gap-x-2 py-1 px-2 cursor-pointer rounded-md hover:bg-primary/80 hover:text-white font-medium transition-colors">
                <div>{accountInfo.fullName}</div>
                <div className="relative w-9 h-9 border border-black rounded-full overflow-hidden">
                  <Image
                    className="object-cover object-center"
                    src={accountInfo.avatar}
                    width={64}
                    height={64}
                    objectFit="cover"
                    objectPosition="center"
                  />
                </div>
                <div className="absolute z-20 overflow-hidden top-full right-0 w-max bg-white shadow-[0_0_15px_0_rgba(0,0,0,0.3)] rounded-md h-0 group-hover:h-20 transition-[height] duration-300">
                  <Link href="/info">
                    <a className="block text-black font-medium px-5 py-2 hover:bg-primary/80 hover:text-white transition-colors">
                      <span className="pr-2">
                        <i className="fa-solid fa-user"></i>
                      </span>
                      Thông tin tài khoản
                    </a>
                  </Link>
                  <div
                    className="font-medium text-black px-5 py-2 cursor-pointer hover:bg-primary/80 hover:text-white transition-colors"
                    onClick={signOut}
                  >
                    <span className="pr-2">
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    </span>
                    Đăng xuất
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <span className="hover:text-primary transition-colors">
                <Link href="/sign-in">Đăng nhập</Link>
              </span>
              <span className="text-primary font-bold transition-colors">/</span>
              <span className="hover:text-primary">
                <Link href="/register">Đăng ký</Link>
              </span>
            </div>
          )}

          {isVisibleMenu && (
            <div
              className="cursor-pointer text-xl leading-none hover:text-primary transition-colors lg:hidden"
              onClick={() => setIsActive(true)}
            >
              <i className="fa-solid fa-bars"></i>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
