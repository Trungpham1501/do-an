import React from 'react'
import Button from '../Button/Button'
import { convertPrice, convertDate } from '../../js/commonFn'
import { OrderStatus } from '../../enums/OrderEnum'

const OrderItem = ({
  code,
  cars,
  totalMoney,
  createdAt,
  status,
  _id,
  onWatchDetail = () => {},
}) => {
  const totalProducts = cars?.reduce((prev, cur) => {
    return (prev += cur.number)
  }, 0)

  return (
    <div
      className={`h-32 px-6 py-4 shadow-[0_0_8px_0_rgba(0,0,0,0.15)] rounded-md grid grid-cols-3 border-l-8 ${
        status === OrderStatus.Pending
          ? 'border-orange-500'
          : status === OrderStatus.Comfirmed
          ? 'border-primary'
          : status === OrderStatus.Completed
          ? 'border-green-500'
          : ''
      } hover:shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-shadow duration-200`}
    >
      <div className="flex flex-col justify-between">
        <div>
          Số đơn: <span className="font-medium">{code}</span>
        </div>
        <div>
          Số lượng sản phẩm: <span className="font-medium">{totalProducts}</span>
        </div>
        <div>
          Tổng tiền: <span className="font-medium">{convertPrice(totalMoney)}</span>
        </div>
      </div>
      <div className="self-center justify-self-center">
        Ngày lập: <span className="font-medium">{convertDate(createdAt)}</span>
      </div>
      <div className="flex flex-col justify-between items-end">
        <div
          className={`flex items-center justify-center font-medium border-2 rounded-md h-10 w-[150px] ${
            status === OrderStatus.Pending
              ? 'border-orange-500 text-orange-500'
              : status === OrderStatus.Comfirmed
              ? 'border-primary text-primary'
              : status === OrderStatus.Completed
              ? 'border-green-500 text-green-500'
              : ''
          }`}
        >
          {status === OrderStatus.Pending ? (
            <div>Chờ xác nhận</div>
          ) : status === OrderStatus.Comfirmed ? (
            <div>Đã xác nhận</div>
          ) : status === OrderStatus.Completed ? (
            <div>Đã giao dịch</div>
          ) : null}
        </div>
        <Button
          style={{
            borderRadius: '6px',
            height: '40px',
            width: '150px',
            padding: '0',
          }}
          onClick={() => onWatchDetail(_id)}
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  )
}

export default OrderItem
