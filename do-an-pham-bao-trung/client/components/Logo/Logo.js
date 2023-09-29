import React from 'react'
import Link from 'next/link'
import resource from '../../resource'

const Logo = ({ className }) => {
  return (
    <Link href="/home">
      <a className={`flex items-center ${className}`}>
        <div className="h-[30px] w-[30px] rounded-full bg-primary mr-3" />
        <div className="text-xl font-bold">{resource.ten_trang_web}</div>
      </a>
    </Link>
  )
}

export default Logo
