import React, { useEffect, useState } from 'react'
import { convertPrice } from '../../js/commonFn'
import { ButtonType } from '../../enums/ButtomEnum'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import baseApi from '../../api/BaseApi'

import Popup from '../Popup/Popup'
import CartItem from '../Cart/CartItem'
import LoadingItem from '../Loading/LoadingItem'
import Button from '../Button/Button'
import UserInfo from './UserInfo'
import PopupMsg from '../Popup/PopupMsg'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'
import { OrderStatus } from '../../enums/OrderEnum'

const PopupOrderDetail = ({ isActive, orderId, isAdminView = false, onClose = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isActivePopupCancelOrder, setIsActivePopupCancelOrder] = useState(false)
  const [isLoadingCancelOrder, setIsLoadingCancelOrder] = useState(false)
  const [orderDetail, setOrderDetail] = useState({})
  const [numberProducts, setNumberProducts] = useState(0)

  const dispatch = useDispatch()

  useEffect(() => {
    if (isActive) {
      getOrderDetail(orderId)
    }
  }, [isActive, orderId])

  const getOrderDetail = async (orderId) => {
    setIsLoading(true)
    try {
      const res = await baseApi.get(`/orders/${orderId}`)
      const numberProducts = res.data.data.cars.reduce((prev, cur) => {
        return (prev += cur.number)
      }, 0)
      setOrderDetail(res.data.data)
      setNumberProducts(numberProducts)
      setIsLoading(false)
    } catch (err) {
      console.log(err)
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Error,
          msg: 'Có lỗi xảy ra',
        })
      )
    }
  }

  const handleCancelOrder = async () => {
    setIsLoadingCancelOrder(true)
    try {
      let msg = ''
      if (isAdminView && orderDetail.status === OrderStatus.Pending) {
        await baseApi.put(`/orders/${orderDetail._id}`, {
          ...orderDetail,
          status: OrderStatus.Comfirmed,
        })
        msg = `Xác nhận thành công đơn hàng số <${orderDetail.code}>`
      } else if (isAdminView && orderDetail.status === OrderStatus.Comfirmed) {
        await baseApi.put(`/orders/${orderDetail._id}`, {
          ...orderDetail,
          status: OrderStatus.Completed,
        })
        msg = `Hoàn thành đơn hàng số <${orderDetail.code}>`
      } else {
        await baseApi.delete(`/orders/${orderDetail._id}`)
        msg = `Hủy thành công đơn hàng số <${orderDetail.code}>`
      }

      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Success,
          msg: msg,
        })
      )
      setIsLoadingCancelOrder(false)
      setIsActivePopupCancelOrder(false)
      onClose(true)
    } catch (error) {
      setIsLoadingCancelOrder(false)
      setIsActivePopupCancelOrder(false)
      if (error.response.status === 400) {
        const errors = error.response.data.errors
        if (errors.length) {
          if (errors[0].param === 'number') {
            dispatch(
              openToastMsg({
                status: ToastMsgStatus.Error,
                msg: errors[0].msg,
              })
            )
            return
          }
        }
      }
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Error,
          msg: 'Có lỗi xảy ra',
        })
      )
      setIsLoadingCancelOrder(false)
    }
  }

  return (
    <Popup
      isActive={isActive}
      title={
        <div className="flex items-end">
          <div>Thông tin đơn hàng</div>
          <div
            className={`ml-4 flex items-center justify-center font-medium border-2 rounded-md h-6 text-base px-4 ${
              orderDetail.status === OrderStatus.Pending
                ? 'border-orange-500 text-orange-500'
                : orderDetail.status === OrderStatus.Comfirmed
                ? 'border-primary text-primary'
                : orderDetail.status === OrderStatus.Completed
                ? 'border-green-500 text-green-500'
                : ''
            }`}
          >
            {orderDetail.status === OrderStatus.Pending ? (
              <div>Chờ xác nhận</div>
            ) : orderDetail.status === OrderStatus.Comfirmed ? (
              <div>Đã xác nhận</div>
            ) : orderDetail.status === OrderStatus.Completed ? (
              <div>Đã giao dịch</div>
            ) : null}
          </div>
        </div>
      }
      onClose={onClose}
    >
      {isLoading ? (
        <div>
          <div className="flex gap-x-6">
            <div className="h-[412px] w-[500px] overflow-auto">
              {[1, 2, 3].map((idx) => (
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
            <div className="h-[412px] w-[500px] overflow-auto flex flex-col justify-between pt-4 pb-3">
              <LoadingItem className="w-56 h-6 rounded-md" />
              <LoadingItem className="w-80 h-6 rounded-md" />
              <LoadingItem className="w-56 h-6 rounded-md" />
              <LoadingItem className="w-80 h-6 rounded-md" />
              <LoadingItem className="w-56 h-6 rounded-md" />
              <LoadingItem className="w-80 h-6 rounded-md" />
              <LoadingItem className="w-96 h-6 rounded-md" />
              <LoadingItem className="w-80 h-6 rounded-md" />
              <LoadingItem className="w-56 h-6 rounded-md" />
            </div>
          </div>
          <LoadingItem className="h-4 w-full mt-6 mb-3 rounded-md" />
          <LoadingItem className="h-5 w-full mb-6 rounded-md" />
          <LoadingItem className="h-[52px] w-full rounded-md" />
        </div>
      ) : (
        <div>
          <div className="h-[412px] overflow-x-hidden flex gap-x-6 border-t border-b border-gray-300">
            <div
              className={`w-[500px] max-h-[411px] overflow-auto shrink-0 transition-all duration-200`}
            >
              {orderDetail.cars?.map((product) => {
                return (
                  <CartItem key={`${product._id}`} {...product} isWatch isAdminView={isAdminView} />
                )
              })}
            </div>
            <div
              className={`w-[500px] max-h-[411px] overflow-auto shrink-0 transition-all duration-200`}
            >
              {orderDetail && (
                <UserInfo
                  {...orderDetail.user}
                  note={orderDetail.note}
                  createdAt={orderDetail.createdAt}
                  orderCode={orderDetail.code}
                  userCode={isAdminView ? orderDetail.user?.code : null}
                />
              )}
            </div>
          </div>
          <div className="flex items-end justify-between gap-x-6">
            <div className="pt-6 pb-1 text-left grow">
              <div className="leading-none flex justify-between">
                <span>Số lượng sản phẩm</span>
                <span>{numberProducts}</span>
              </div>
              <div className="text-lg font-medium mt-3 leading-none flex justify-between">
                <span>Tổng tiền</span>
                <span>{orderDetail ? convertPrice(orderDetail.totalMoney) : ''}</span>
              </div>
            </div>
            {isAdminView ? (
              <div className="flex w-[500px] overflow-hidden">
                {orderDetail.status === OrderStatus.Pending ? (
                  <div className="w-full shrink-0 grid grid-cols-2 gap-x-4 transition-all duration-200">
                    <Button
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                        height: '52px',
                      }}
                      buttonType={ButtonType.Secondary}
                      onClick={onClose}
                    >
                      Đóng
                    </Button>
                    <Button
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                      }}
                      onClick={() => setIsActivePopupCancelOrder(true)}
                    >
                      Xác nhận đơn hàng
                    </Button>
                  </div>
                ) : orderDetail.status === OrderStatus.Comfirmed ? (
                  <div className="w-full shrink-0 grid grid-cols-2 gap-x-4 transition-all duration-200">
                    <Button
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                        height: '52px',
                      }}
                      buttonType={ButtonType.Secondary}
                      onClick={onClose}
                    >
                      Đóng
                    </Button>
                    <Button
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                      }}
                      onClick={() => setIsActivePopupCancelOrder(true)}
                    >
                      Hoàn thành đơn hàng
                    </Button>
                  </div>
                ) : (
                  <Button
                    style={{
                      borderRadius: '8px',
                      width: '100%',
                    }}
                    onClick={onClose}
                  >
                    Đóng
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex w-[500px] overflow-hidden">
                {orderDetail.status === OrderStatus.Pending ? (
                  <div className="w-full shrink-0 grid grid-cols-2 gap-x-4 transition-all duration-200">
                    <Button
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                        height: '52px',
                      }}
                      buttonType={ButtonType.Secondary}
                      onClick={() => setIsActivePopupCancelOrder(true)}
                    >
                      Hủy đơn hàng
                    </Button>
                    <Button
                      style={{
                        borderRadius: '8px',
                        width: '100%',
                      }}
                      onClick={() => onClose()}
                    >
                      Đóng
                    </Button>
                  </div>
                ) : (
                  <Button
                    style={{
                      borderRadius: '8px',
                      width: '100%',
                    }}
                    onClick={() => onClose()}
                  >
                    Đóng
                  </Button>
                )}
              </div>
            )}
          </div>

          <PopupMsg
            isActive={isActivePopupCancelOrder}
            isLoading={isLoadingCancelOrder}
            isActiveLoadingScreen={false}
            title="Xác nhận"
            msg={`${
              isAdminView
                ? orderDetail.status === OrderStatus.Pending
                  ? 'Bạn có chắc chắn xác nhận đơn hàng?'
                  : 'Bạn có chắc chắn muôn hoàn thành đơn hàng?'
                : 'Bạn có chắc chắn muốn hủy đơn hàng?'
            }`}
            textCloseBtn="Hủy"
            textAgreeBtn="Đồng ý"
            onClose={() => setIsActivePopupCancelOrder(false)}
            onAgree={handleCancelOrder}
          />
        </div>
      )}
    </Popup>
  )
}

export default PopupOrderDetail
