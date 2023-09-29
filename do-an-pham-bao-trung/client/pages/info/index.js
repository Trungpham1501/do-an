import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import InputField from '../../components/InputField/InputField'
import Button from '../../components/Button/Button'
import PopupMsg from '../../components/Popup/PopupMsg'
import ImageUploader from '../../components/ImageUploader/ImageUploader'
import OrderItem from '../../components/OrderItem/OrderItem'
import Image from 'next/image'
import Link from 'next/link'
import { useAccount } from '../../hooks/accountHook'
import { useValidate } from '../../hooks/validationHook'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'
import { TypeStyle } from '../../enums/InputFieldEnum'
import baseApi from '../../api/BaseApi'
import { convertPrice } from '../../js/commonFn'
import LoadingItem from '../../components/Loading/LoadingItem'
import PopupOrderDetail from '../../components/PopupOrderDetail/PopupOrderDetail'

import ImgOrdersEmpty from '../../assets/images/orders-empty.jpg'

const getUserInfo = (accountInfo) => {
  const userInfo = JSON.parse(JSON.stringify(accountInfo))
  if (!userInfo) {
    return {
      _id: '',
      fullName: '',
      avatar: '',
      email: '',
      phoneNumber: '',
      address: {
        city: '',
        district: '',
        detail: '',
      },
    }
  }
  if (!userInfo.address) {
    userInfo.address = {
      city: '',
      district: '',
      detail: '',
    }
  } else {
    if (!userInfo.address.city) {
      userInfo.address.city = ''
    }
    if (!userInfo.address.district) {
      userInfo.address.district = ''
    }
    if (!userInfo.address.detail) {
      userInfo.address.detail = ''
    }
  }

  if (!userInfo.phoneNumber) {
    userInfo.phoneNumber = ''
  }
  return userInfo
}

const Info = () => {
  const { accountInfo, update } = useAccount()
  const [info, setInfo] = useState(() => {
    return getUserInfo(accountInfo)
  })
  const [isFirstValidate, setIsFirstValidate] = useState(false)
  const [isLoadingPopupSave, setIsLoadingPopupSave] = useState(false)
  const [isActivePopupSave, setIsActivePopupSave] = useState(false)
  const [isActivePopupOrderDetail, setIsActivePopupOrderDetail] = useState(false)
  const [orders, setOrders] = useState([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalMoney, setTotalMoney] = useState(0)
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState('')

  const dispatch = useDispatch()

  const { errors, validate, setServerErrors } = useValidate({
    fullName: {
      name: 'Họ tên',
      rules: ['required'],
    },
    email: {
      name: 'Email',
      rules: ['required', 'email'],
    },
    phoneNumber: {
      name: 'Số điện thoại',
      rules: ['phoneNumber'],
    },
  })

  useEffect(() => {
    setInfo(getUserInfo(accountInfo))
    if (accountInfo) {
      getOrders(accountInfo._id)
    }
  }, [accountInfo])

  useEffect(() => {
    if (!isFirstValidate) {
      validate(info)
    }
  }, [info.fullName, info.email, info.phoneNumber])

  const getOrders = async (userId) => {
    setIsLoadingOrders(true)
    try {
      const res = await baseApi.get(`/orders/query?userId=${userId}`)
      const orders = res.data.data.pageData
      const totalOrders = res.data.data.totalRecords
      const totalMoney = orders.reduce((prev, cur) => {
        return (prev += cur.totalMoney)
      }, 0)

      setOrders(orders)
      setTotalOrders(totalOrders)
      setTotalMoney(totalMoney)
      setIsLoadingOrders(false)
    } catch (error) {
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Error,
          msg: 'Có lỗi xảy ra',
        })
      )
      setIsLoadingOrders(false)
    }
  }

  const saveUserInfo = async () => {
    setIsLoadingPopupSave(true)
    try {
      await update(info)
      setIsLoadingPopupSave(false)
      setIsActivePopupSave(false)
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Success,
          msg: 'Lưu thông tin thành công',
        })
      )
    } catch (error) {
      setIsLoadingPopupSave(false)
      setIsActivePopupSave(false)
      if (error.response.status === 400) {
        setServerErrors(error.response.data.errors)
        return
      }
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Error,
          msg: 'Có lỗi xảy ra',
        })
      )
    }
  }

  const saveUserAvatar = async (e) => {
    try {
      await update({
        ...accountInfo,
        avatar: e,
      })
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Success,
          msg: 'Lưu ảnh đại diện thành công',
        })
      )
    } catch (error) {
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Error,
          msg: 'Có lỗi xảy ra',
        })
      )
    }
  }

  const openPopupSave = () => {
    setIsFirstValidate(false)
    if (validate(info)) {
      setIsActivePopupSave(true)
    }
  }

  const handleWatchDetail = (e) => {
    setSelectedOrder(e)
    setIsActivePopupOrderDetail(true)
  }

  const handleClosePopupWatchDetail = (isReload = false) => {
    setSelectedOrder('')
    setIsActivePopupOrderDetail(false)
    if (isReload) {
      getOrders(accountInfo._id)
    }
  }

  return (
    <div>
      <Head>
        <title>{info?.fullName || 'Thông tin tài khoản'}</title>
        <link rel="icon" href="/icon.ico" />
      </Head>
      <main className="w-full">
        <div className="container mx-auto mt-10">
          <div className="flex items-center">
            <div className="relative">
              <ImageUploader
                name="avatar"
                id="avatar"
                width={144}
                height={144}
                isAvatar
                value={info.avatar}
                onChange={saveUserAvatar}
              />
            </div>
            <div className="ml-6 grow flex items-center justify-between">
              <div>
                <div className="text-2xl font-medium">{info.fullName}</div>
                <div className="text-gray-500">{info.email}</div>
              </div>
              <div className="text-lg text-right">
                {isLoadingOrders ? (
                  <div className="flex flex-col items-end gap-y-2">
                    <LoadingItem className="h-6 w-32 rounded-md" />
                    <LoadingItem className="h-6 w-56 rounded-md" />
                  </div>
                ) : (
                  <>
                    <div>Tổng đơn hàng: {totalOrders}</div>
                    <div>Số tiền đã chi: {convertPrice(totalMoney)}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-2 gap-x-6">
              <InputField
                id="fullName"
                name="fullName"
                label="Họ tên"
                typeStyle={TypeStyle.Normal}
                labelStyle={{
                  fontSize: '16px',
                  fontWeight: '500',
                  paddingLeft: '2px',
                }}
                value={info.fullName}
                error={errors.fullName}
                onInput={(e) => setInfo((prev) => ({ ...prev, fullName: e.target.value }))}
              />
              <InputField
                id="email"
                name="email"
                label="Email"
                typeStyle={TypeStyle.Normal}
                labelStyle={{
                  fontSize: '16px',
                  fontWeight: '500',
                  paddingLeft: '2px',
                }}
                value={info.email}
                error={errors.email}
                onInput={(e) => setInfo((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-x-6 mt-6">
              <InputField
                id="phoneNumber"
                name="phoneNumber"
                label="Số điện thoại"
                typeStyle={TypeStyle.Normal}
                labelStyle={{
                  fontSize: '16px',
                  fontWeight: '500',
                  paddingLeft: '2px',
                }}
                value={info.phoneNumber}
                error={errors.phoneNumber}
                onInput={(e) => setInfo((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              />
              <InputField
                id="city"
                name="city"
                label="Tỉnh/Thành phố"
                typeStyle={TypeStyle.Normal}
                labelStyle={{
                  fontSize: '16px',
                  fontWeight: '500',
                  paddingLeft: '2px',
                }}
                value={info.address.city}
                onInput={(e) =>
                  setInfo((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      city: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-x-6 mt-6">
              <InputField
                id="district"
                name="district"
                label="Quận/Huyện"
                typeStyle={TypeStyle.Normal}
                labelStyle={{
                  fontSize: '16px',
                  fontWeight: '500',
                  paddingLeft: '2px',
                }}
                value={info.address.district}
                onInput={(e) =>
                  setInfo((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      district: e.target.value,
                    },
                  }))
                }
              />
              <InputField
                id="detail"
                name="detail"
                label="Địa chỉ chi tiết"
                typeStyle={TypeStyle.Normal}
                labelStyle={{
                  fontSize: '16px',
                  fontWeight: '500',
                  paddingLeft: '2px',
                }}
                value={info.address.detail}
                onInput={(e) =>
                  setInfo((prev) => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      detail: e.target.value,
                    },
                  }))
                }
              />
            </div>

            <Button
              className="mx-auto mt-6"
              style={{
                borderRadius: '6px',
              }}
              onClick={openPopupSave}
            >
              Lưu thông tin
            </Button>
          </div>

          <div>
            <div className="text-2xl font-medium mt-10">Danh sách đơn hàng</div>
            {isLoadingOrders ? (
              [0, 1, 2].map((item) => (
                <div key={item} className="grid grid-cols-1 gap-y-6 mt-6">
                  <div className="h-32 px-6 py-4 shadow-[0_0_8px_0_rgba(0,0,0,0.15)] rounded-md grid grid-cols-3 border-l-8 border-[#DDDBDD] hover:shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-shadow duration-200">
                    <div className="flex flex-col justify-between">
                      <LoadingItem className="h-5 w-32 rounded-md" />
                      <LoadingItem className="h-5 w-24 rounded-md" />
                      <LoadingItem className="h-5 w-48 rounded-md" />
                    </div>
                    <div className="self-center justify-self-center">
                      <LoadingItem className="h-5 w-24 rounded-md" />
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <LoadingItem className="rounded-md h-10 w-[150px]" />
                      <LoadingItem className="rounded-md h-10 w-[150px]" />
                    </div>
                  </div>
                </div>
              ))
            ) : orders.length === 0 ? (
              <div className="relative w-full h-[432px]">
                <Image
                  src={ImgOrdersEmpty}
                  layout="fill"
                  objectFit="contain"
                  objectPosition="center"
                />
                <div className="absolute left-1/2 top-4 -translate-x-1/2 text-gray-500 text-xl">
                  Bạn chưa có đơn hàng nào
                </div>
                <Link href="/home">
                  <a className="group flex items-center leading-none absolute left-1/2 bottom-4 -translate-x-1/2 text-primary text-lg">
                    <div className="group-hover:underline">Bắt đầu mua sắm</div>
                    <div className="text-sm pl-1 flex items-center -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200">
                      <i className="fa-solid fa-chevron-right"></i>
                    </div>
                  </a>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-y-6 mt-6">
                {orders.map((order) => {
                  return <OrderItem key={order._id} {...order} onWatchDetail={handleWatchDetail} />
                })}
              </div>
            )}
          </div>
        </div>

        <PopupMsg
          title="Xác nhận"
          msg="Bạn có chắc chắn muốn lưu thông tin các nhân?"
          textCloseBtn="Hủy"
          textAgreeBtn="Đồng ý"
          isActive={isActivePopupSave}
          isLoading={isLoadingPopupSave}
          onClose={() => setIsActivePopupSave(false)}
          onAgree={saveUserInfo}
        />

        <PopupOrderDetail
          isActive={isActivePopupOrderDetail}
          orderId={selectedOrder}
          onClose={handleClosePopupWatchDetail}
        />
      </main>
    </div>
  )
}

export default Info
