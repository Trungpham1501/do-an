import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import resource from '../resource'

import Img from '../assets/images/gioi_thieu/gioi_thieu.jpg'

const ITEMS = resource.gioi_thieu.tieu_chi_phat_trien

const IntroPage = () => {
  return (
    <div>
      <Head>
        <title>Giới thiệu</title>
        <link rel="icon" href="/icon.ico" />
      </Head>
      <main className="container mx-auto px-6 ms:px-0">
        <h1 className="mt-10 mb-8 text-justify text-xl font-medium lg:text-3xl lg:text-center">
          {resource.gioi_thieu.ten_cong_ty}
        </h1>
        <div className="relative w-full h-[300px] mb-8 lg:h-[500px] rounded-md overflow-hidden">
          <Image className="object-right object-cover" src={Img} layout="fill" />
          <Image className="object-left object-cover" src={Img} layout="fill" />
        </div>
        <h2 className="font-bold text-2xl text-center mb-8 relative before:absolute before:top-[calc(100%_+_4px)] before:left-1/2 before:-translate-x-1/2 before:w-36 before:h-1 before:bg-primary">
          Tiêu chí phát triển
        </h2>
        <ul className="mx-auto grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 lg:w-[800px]">
          {ITEMS.map((item, idx) => {
            return (
              <li
                className="w-full h-[200px] bg-white ring-primary ring-4 rounded-md shadow-lg flex flex-col justify-center px-6 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                key={idx}
              >
                <div className="text-lg font-bold mb-1 text-primary">{item.title}</div>
                {item.content.map((c, cIdx) => (
                  <div className="font-medium text-justify" key={cIdx}>
                    {c}
                  </div>
                ))}
              </li>
            )
          })}
        </ul>
      </main>
    </div>
  )
}

export default IntroPage
