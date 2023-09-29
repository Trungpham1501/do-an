import React from 'react'
import LoadingItem from '../Loading/LoadingItem'

const ProductCardLoading = () => {
  return (
    <div className="group w-full rounded-xl overflow-hidden shadow-[0_0_5px_0px_rgba(0,0,0,0.15)] cursor-pointer hover:shadow-[0_0_15px_3px_rgba(0,0,0,0.15)] transition-all">
      <div>
        <LoadingItem className="w-full h-64" />
        <div className="text-left px-2 flex items-center justify-between">
          <div className="w-[calc(100%_-_153px)]">
            <LoadingItem className="w-4/5 h-5 mt-2 rounded-md" />
            <LoadingItem className="w-3/5 h-4 mt-1 mb-2 rounded-md" />
          </div>
          <div className="pl-2 grow">
            <LoadingItem className="w-full h-10 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCardLoading
