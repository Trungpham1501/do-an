import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { convertPrice } from '../../js/commonFn'
import { useCart } from '../../hooks/cartHook'
import Img from '../../assets/images/dang_nhap/background.jpg'
import { useAccount } from '../../hooks/accountHook'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'

const ProductCard = ({ name, image, price, _id, colors }) => {
  const formattedPrice = convertPrice(price)
  const url = `/products/${_id}`

  const { accountInfo } = useAccount()
  const { addProduct } = useCart()
  const dispatch = useDispatch()

  const addToCart = (e) => {
    e.preventDefault()
    if (!accountInfo?._id) {
      dispatch(
        openToastMsg({
          msg: 'Bạn cần đăng nhập để có thể mua hàng',
          status: ToastMsgStatus.Info,
        })
      )
      return
    }
    addProduct(_id)
    dispatch(
      openToastMsg({
        msg: 'Thêm thành công sản phẩm vào giỏ hàng',
        status: ToastMsgStatus.Success,
      })
    )
  }

  return (
    <div className="group w-full rounded-xl overflow-hidden shadow-[0_0_5px_0px_rgba(0,0,0,0.15)] cursor-pointer hover:shadow-[0_0_15px_3px_rgba(0,0,0,0.15)] transition-all">
      <Link href={url}>
        <div>
          <div className="relative w-full h-64">
            <Image
              className="object-contain object-center group-hover:scale-125 transition-all duration-300"
              layout="fill"
              src={image || Img}
              placeholder="blur"
              blurDataURL="https://firebasestorage.googleapis.com/v0/b/open-source-project-2f57f.appspot.com/o/images%2Fa1505a6c-9664-489e-8f74-e481943d7242.jpg?alt=media&token=7c1c8eb5-b146-46ae-90d9-45e7ecdbc480"
            />
          </div>
          <div className="text-left px-2 flex items-center justify-between">
            <div className="w-[calc(100%_-_153px)]">
              <div
                className="mt-2 font-medium text-sm overflow-hidden w-full whitespace-nowrap text-ellipsis"
                title={name}
              >
                {name}
              </div>
              <div className="mb-2 text-sm">Giá từ: {formattedPrice}</div>
            </div>
            <div
              className="relative flex items-center px-2 py-2 bg-primary gap-x-2 rounded-lg overflow-hidden
                before:absolute before:w-[200%] before:h-[400%] before:bg-[rgba(255,255,255,0.2)] before:rotate-45 before:left-[45%] before:top-[-300%] before:transition-all before:duration-300
                hover:before:left-[-80%]"
              onClick={addToCart}
            >
              <span className="text-white font-medium text-xs">Thêm vào giỏ hàng</span>
              <div className="text-white text-base leading-none">
                <i className="fa-solid fa-cart-plus"></i>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
