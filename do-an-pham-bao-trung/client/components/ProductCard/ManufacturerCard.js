import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

const ManufacturerCard = ({ name, _id, numberProducts, image }) => {
  const url = `/products?m=${_id}`

  return (
    <div className="group w-full rounded-xl overflow-hidden shadow-[0_0_5px_0px_rgba(0,0,0,0.15)] cursor-pointer hover:shadow-[0_0_15px_3px_rgba(0,0,0,0.15)] transition-all">
      <Link href={url}>
        <div>
          {image ? (
            <div className="relative w-full h-64">
              <Image
                className="object-cover object-center group-hover:scale-125 transition-all duration-300"
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                src={image || Img}
              />
            </div>
          ) : (
            <div className="relative w-full h-64 text-8xl text-primary flex items-center justify-center">
              <i className="fa-solid fa-building"></i>
            </div>
          )}

          <div className="text-left px-2 flex items-center justify-between">
            <div className="w-[calc(100%_-_153px)]">
              <div
                className="mt-2 font-medium text-sm overflow-hidden w-full whitespace-nowrap text-ellipsis"
                title={name}
              >
                {name}
              </div>
              <div className="mb-2 text-sm">Số sản phẩm: {numberProducts}</div>
            </div>
            <div
              className="relative flex items-center px-2 py-2 bg-primary gap-x-2 rounded-lg overflow-hidden
                before:absolute before:w-[200%] before:h-[400%] before:bg-[rgba(255,255,255,0.2)] before:rotate-45 before:left-[45%] before:top-[-300%] before:transition-all before:duration-300
                hover:before:left-[-80%]"
            >
              <span className="text-white font-medium text-xs">Danh sách sản phẩm</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ManufacturerCard
