import React, { useEffect, useState } from 'react'
import { useCart } from '../../hooks/cartHook'
import { convertPrice } from '../../js/commonFn'
import { ButtonType } from '../../enums/ButtomEnum'
import { useDispatch, useSelector } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import baseApi from '../../api/BaseApi'

import Popup from '../Popup/Popup'
import CartItem from './CartItem'
import LoadingItem from '../Loading/LoadingItem'
import Button from '../Button/Button'
import Image from 'next/image'
import CheckoutScreen from './CheckoutScreen'
import PopupMsg from '../Popup/PopupMsg'

import EmptyCartImage from '../../assets/images/cart-empty.jpg'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'
import { setProducts } from '../../slices/cartSlice'
import { useRouter } from 'next/router'

const Cart = ({ isActive }) => {
  const { products, totalNumber, totalMoney, isLoading, toggleCart, fetchCart } = useCart()
  const [storedProducts, setStoredProducts] = useState([0, 0, 0])
  const [isCheckOut, setIsCheckOut] = useState(false)
  const [isLoadingSave, setIsLoadingSave] = useState(false)
  const [isActivePopupWarning, setIsActivePopupWarning] = useState(false)
  const [isActivePopupSave, setIsActivePopupSave] = useState(false)
  const [note, setNote] = useState('')

  const dispatch = useDispatch()
  const router = useRouter()
  const userInfo = useSelector((state) => state.account.accountInfo)

  useEffect(() => {
    if (isActive) {
      const cart = localStorage.getItem('cart')
      if (cart) {
        const cartJSON = JSON.parse(cart)
        if (cartJSON.length) {
          setStoredProducts(cartJSON)
        }
        setStoredProducts[(0, 0, 0)]
      } else {
        setStoredProducts[(0, 0, 0)]
      }

      fetchCart()
    } else {
      setIsCheckOut(false)
      setNote('')
    }
  }, [isActive])

  const openPopupSave = () => {
    if (!userInfo.phoneNumber || !userInfo.address) {
      setIsActivePopupWarning(true)
      return
    }

    if (!userInfo.address.district || !userInfo.address.city || !userInfo.address.detail) {
      setIsActivePopupWarning(true)
      return
    }

    setIsActivePopupSave(true)
  }

  const handleSaveOrder = async () => {
    setIsLoadingSave(true)

    const formattedProducts = products.map((p) => ({
      _id: p._id,
      code: p.code,
      name: p.name,
      image: p.image,
      number: p.number,
      price: p.price,
    }))

    try {
      const res = await baseApi.post('orders', {
        cars: formattedProducts,
        user: {
          _id: userInfo._id,
          code: userInfo.code,
          fullName: userInfo.fullName,
          email: userInfo.email,
          phoneNumber: userInfo.phoneNumber,
          avatar: userInfo.avatar,
          address: userInfo.address,
        },
        note,
      })

      dispatch(setProducts([]))
      localStorage.setItem('cart', JSON.stringify([]))

      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Success,
          msg: `Lưu thông tin đơn hàng thành công với số đơn <${res.data.data.code}>`,
        })
      )
      setIsLoadingSave(false)
      setIsActivePopupSave(false)
      toggleCart(false)
    } catch (error) {
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Error,
          msg: 'Có lỗi xảy ra',
        })
      )
      setIsLoadingSave(false)
      setIsActivePopupSave(false)
    }
  }

  const goToInfoPage = () => {
    setIsActivePopupWarning(false)
    toggleCart(false)
    router.replace('/info')
  }

  return (
    <Popup
      isActive={isActive}
      title={
        isCheckOut ? (
          <div className="flex items-end">
            Thông tin thanh toán{' '}
            <span className="group text-sm text-primary cursor-pointer flex items-center ml-3 leading-none">
              <div className="group-hover:underline">Sửa thông tin cá nhân</div>
              <div className="text-sm pl-1 flex items-center -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200">
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </span>
          </div>
        ) : (
          'Giỏ hàng'
        )
      }
      onClose={() => toggleCart(false)}
    >
      {isLoading ? (
        <div className="w-[500px]">
          <div className="h-[414px] overflow-auto">
            {storedProducts.map((_, idx) => (
              <div
                key={idx}
                className="flex border-b first:border-t border-gray-300 h-[137px] py-3 pr-3"
              >
                <LoadingItem className="w-28 h-28 rounded-md mr-6" />
                <div className="py-3 flex flex-col justify-between grow">
                  <LoadingItem className="w-12 h-4 rounded-md" />
                  <LoadingItem className="w-full h-4 rounded-md" />
                  <LoadingItem className="w-24 h-4 rounded-md" />
                </div>
              </div>
            ))}
          </div>
          <LoadingItem className="h-4 w-full mt-6 mb-3 rounded-md" />
          <LoadingItem className="h-5 w-full mb-6 rounded-md" />
          <LoadingItem className="h-[52px] w-full rounded-md" />
        </div>
      ) : products.length === 0 ? (
        <div className="w-[500px]">
          <div className="relative">
            <Image
              src={EmptyCartImage}
              width={500}
              height={411}
              objectFit="cover"
              objectPosition="center"
            />
            <div className="absolute w-full text-center bottom-3 left-1/2 -translate-x-1/2">
              <div className="text-xl text-primary/80">Giỏ hảng của bạn đang trống!</div>
              <div className="text-sm text-gray-500 pt-1">Nhấn nút để khám phát thêm sản phẩm</div>
            </div>
          </div>
          <Button
            style={{
              width: '100%',
              borderRadius: '8px',
              marginTop: '24px',
            }}
            onClick={() => toggleCart(false)}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      ) : (
        <div>
          <div className="w-[500px] h-[412px] overflow-x-hidden flex border-t border-b border-gray-300">
            <div
              className={`w-[500px] max-h-[411px] overflow-auto shrink-0 transition-all duration-200 ${
                isCheckOut ? '-translate-x-full' : ''
              }`}
            >
              {products.map((product) => {
                return <CartItem key={`${product._id}`} {...product} />
              })}
            </div>
            <div
              className={`w-[500px] max-h-[411px] overflow-auto shrink-0 transition-all duration-200 ${
                isCheckOut ? '-translate-x-full' : ''
              }`}
            >
              <CheckoutScreen note={note} onChangeNote={(e) => setNote(e)} />
            </div>
          </div>
          <div className="pt-6 pb-6 text-left">
            <div className="leading-none flex justify-between">
              <span>Số lượng sản phẩm</span>
              <span>{totalNumber}</span>
            </div>
            <div className="text-lg font-medium mt-3 leading-none flex justify-between">
              <span>Tạm tính</span>
              <span>{convertPrice(totalMoney)}</span>
            </div>
          </div>
          <div className="flex w-[500px] overflow-hidden">
            <Button
              className={`shrink-0 transition-all duration-200 ${
                isCheckOut ? '-translate-x-full' : ''
              }`}
              style={{
                borderRadius: '8px',
                width: '100%',
              }}
              onClick={() => setIsCheckOut(true)}
            >
              Đặt hàng
            </Button>
            <div
              className={`w-full shrink-0 grid grid-cols-2 gap-x-4 transition-all duration-200 ${
                isCheckOut ? '-translate-x-full' : ''
              }`}
            >
              <Button
                style={{
                  borderRadius: '8px',
                  width: '100%',
                  height: '52px',
                }}
                buttonType={ButtonType.Secondary}
                onClick={() => setIsCheckOut(false)}
              >
                Trở về giỏ hàng
              </Button>
              <Button
                style={{
                  borderRadius: '8px',
                  width: '100%',
                }}
                onClick={openPopupSave}
              >
                Đặt hàng
              </Button>
            </div>
          </div>

          <PopupMsg
            isActive={isActivePopupSave}
            isLoading={isLoadingSave}
            isActiveLoadingScreen={false}
            title="Xác nhận"
            msg="Bạn có chắc chắn muốn đặt hàng? Bạn không thể hủy đơn hàng khi đơn đã được xác nhận."
            textCloseBtn="Hủy"
            textAgreeBtn="Đồng ý"
            onClose={() => setIsActivePopupSave(false)}
            onAgree={handleSaveOrder}
          />

          <PopupMsg
            isActive={isActivePopupWarning}
            title="Thông báo"
            msg="Bạn cần cung cấp đầy đủ thông tin trước khi đặt hàng."
            textCloseBtn="Đóng"
            textAgreeBtn="Bổ xung thông tin"
            onClose={() => setIsActivePopupWarning(false)}
            onAgree={goToInfoPage}
          />
        </div>
      )}
    </Popup>
  )
}

export default Cart
