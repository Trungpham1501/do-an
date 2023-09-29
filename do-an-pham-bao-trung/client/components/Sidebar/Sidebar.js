import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useAccount } from '../../hooks/accountHook'
import Link from 'next/link'

const SIDEBAR_ITEMS = [
  {
    title: 'Trang chủ',
    icon: <i className="fa-solid fa-house-chimney"></i>,
    href: '/admin/dashboard',
  },
  {
    title: 'Sản phẩm',
    icon: <i className="fa-solid fa-bag-shopping"></i>,
    href: '/admin/products',
  },
  {
    title: 'Đơn hàng',
    icon: <i className="fa-solid fa-receipt"></i>,
    href: '/admin/orders',
  },
  {
    title: 'Người dùng',
    icon: <i className="fa-solid fa-users"></i>,
    href: '/admin/users',
  },
  {
    title: 'Đánh giá',
    icon: <i className="fa-solid fa-comments"></i>,
    href: '/admin/reviews',
  },
]

const Sidebar = () => {
  const [isVisible, setIsVisible] = useState(false)
  const { accountInfo } = useAccount()
  const router = useRouter()

  useEffect(() => {
    if (router.pathname.includes('admin') && accountInfo?.isAdmin) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [router.pathname, accountInfo])

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-white w-full border-r border-gray-300">
      <ul className="pt-6 px-2">
        {SIDEBAR_ITEMS.map((item, idx) => {
          let className =
            'flex w-full first:mt-0 bg-white rounded-md items-center px-4 text-xl py-2 my-3 hover:text-primary transition-all'
          if (router.pathname === item.href) {
            className += ' bg-primary text-white font-medium hover:text-white'
          }
          return (
            <Link key={idx} href={item.href}>
              <a className={className}>
                <div className="mr-4 w-6">{item.icon}</div>
                <span className="text-base">{item.title}</span>
              </a>
            </Link>
          )
        })}
      </ul>
    </div>
  )
}

export default Sidebar
