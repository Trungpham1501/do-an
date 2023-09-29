import React from 'react'
import { convertDate } from '../../js/commonFn'

const UserInfo = ({
  fullName,
  email,
  phoneNumber,
  address,
  note,
  orderCode,
  createdAt,
  userCode = null,
}) => {
  return (
    <div className="flex flex-col justify-between h-full pt-4 pb-3">
      <div className="flex items-center justify-between">
        <span>
          <span className="font-medium">Mã đơn hàng:</span> {orderCode}
        </span>
        {userCode !== null && (
          <span>
            <span className="font-medium">Mã Người dùng:</span> {userCode}
          </span>
        )}
      </div>
      <div
        style={{
          WebkitLineClamp: 2,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
          width: '100%',
        }}
      >
        <span className="font-medium">Họ tên:</span> {fullName}
      </div>
      <div
        style={{
          WebkitLineClamp: 2,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
          width: '100%',
        }}
      >
        <span className="font-medium">Email:</span> {email}
      </div>
      <div
        style={{
          WebkitLineClamp: 2,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
          width: '100%',
        }}
      >
        <span className="font-medium">Số điện thoại:</span> {phoneNumber}
      </div>
      <div
        style={{
          WebkitLineClamp: 2,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
          width: '100%',
        }}
      >
        <span className="font-medium">Tỉnh/Thành phố:</span> {address?.city}
      </div>
      <div
        style={{
          WebkitLineClamp: 2,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
          width: '100%',
        }}
      >
        <span className="font-medium">Quận/Huyện:</span> {address?.district}
      </div>
      <div
        style={{
          WebkitLineClamp: 2,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
          width: '100%',
        }}
      >
        <span className="font-medium">Địa chỉ chi tiết:</span> {address?.detail}
      </div>
      <div
        style={{
          WebkitLineClamp: 2,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          textOverflow: 'ellipsis',
          wordBreak: 'break-word',
          width: '100%',
        }}
      >
        <span className="font-medium">Ghi chú:</span> {note}
      </div>
      <div>
        <span className="font-medium">Ngày tạo:</span> {convertDate(createdAt)}
      </div>
    </div>
  )
}

export default UserInfo
