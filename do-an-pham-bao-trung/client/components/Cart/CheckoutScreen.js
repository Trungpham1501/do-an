import React from 'react'
import { useAccount } from '../../hooks/accountHook'
import InputField from '../InputField/InputField'
import { TypeStyle } from '../../enums/InputFieldEnum'

const CheckoutScreen = ({ note = '', onChangeNote = () => {} }) => {
  const { accountInfo } = useAccount()

  return (
    <div className="flex flex-col justify-between h-full pt-4 pb-3">
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
        <span className="font-medium">Họ tên:</span> {accountInfo.fullName}
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
        <span className="font-medium">Email:</span> {accountInfo.email}
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
        <span className="font-medium">Số điện thoại:</span>{' '}
        {accountInfo.phoneNumber ? accountInfo.phoneNumber : ''}
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
        <span className="font-medium">Tỉnh/Thành phố:</span>{' '}
        {accountInfo.address?.city ? accountInfo.address?.city : ''}
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
        <span className="font-medium">Quận/Huyện:</span>{' '}
        {accountInfo.address?.district ? accountInfo.address?.district : ''}
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
        <span className="font-medium">Địa chỉ chi tiết:</span>{' '}
        {accountInfo.address?.detail ? accountInfo.address?.detail : ''}
      </div>
      <div>
        <InputField
          id="note"
          name="note"
          label="Ghi chú:"
          placeholder="Nhập ghi chú ..."
          typeStyle={TypeStyle.TextArea}
          labelStyle={{
            fontSize: '16px',
            fontWeight: 500,
          }}
          value={note}
          onInput={(e) => onChangeNote(e.target.value)}
        />
      </div>
    </div>
  )
}

export default CheckoutScreen
