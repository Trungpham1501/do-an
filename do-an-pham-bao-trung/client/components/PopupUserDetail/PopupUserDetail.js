import React, { useEffect, useState } from 'react'
import Popup from '../Popup/Popup'
import Button from '../Button/Button'
import PopupMsg from '../Popup/PopupMsg'
import InputField from '../InputField/InputField'
import ImageUploader from '../ImageUploader/ImageUploader'
import LoadingItem from '../Loading/LoadingItem'

import baseApi from '../../api/BaseApi'
import { ButtonType } from '../../enums/ButtomEnum'
import { useValidate } from '../../hooks/validationHook'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'
import { TypeStyle } from '../../enums/InputFieldEnum'

const VALIDATE_INFO = {
  code: {
    name: 'Mã người dùng',
    rules: ['required'],
  },
  fullName: {
    name: 'Họ tên',
    rules: ['required'],
  },
  email: {
    name: 'Email',
    rules: ['required', 'email'],
  },
}

const PopupUserDetail = ({ isActive, userId = null, onClose = () => {} }) => {
  const [userInfo, setUserInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFirstValidate, setIsFirstisFirstValidate] = useState(false)
  const [isActiveConfirmPopup, setIsActiveConfirmPopup] = useState(false)
  const [isLoadingConfirmPopup, setIsLoadingConfirmPopup] = useState(false)

  const { errors, validate, clearErrors } = useValidate(VALIDATE_INFO)
  const dispatch = useDispatch()

  useEffect(() => {
    if (isActive) {
      getUserInfo()
    } else {
      setIsFirstisFirstValidate(true)
      clearErrors()
    }
  }, [isActive])

  const getUserInfo = async () => {
    setIsLoading(true)
    try {
      const res = await baseApi.get(`/users/${userId}`)
      setUserInfo(res.data.data)
      setIsLoading(false)
    } catch (error) {
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Error,
          msg: 'Có lỗi xảy ra',
        })
      )
      console.log(error)
    }
  }

  const openConfirmPopup = () => {
    setIsFirstisFirstValidate(false)
    if (validate(userInfo)) setIsActiveConfirmPopup(true)
  }

  const closeConfirmPopup = () => {
    setIsActiveConfirmPopup(false)
  }

  const saveUserData = async () => {
    setIsLoadingConfirmPopup(true)
    try {
      await baseApi.put(`/users/${userId}`, {
        code: userInfo.code,
        fullName: userInfo.fullName,
        email: userInfo.email,
        phoneNumber: userInfo.phoneNumber,
        avatar: userInfo.avatar,
        address: userInfo.address,
      })

      setIsLoadingConfirmPopup(false)
      setIsActiveConfirmPopup(false)
      onClose(true)
    } catch (error) {
      console.log(error)
      setIsActiveConfirmPopup(false)
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Error,
          msg: 'Có lỗi xảy ra',
        })
      )
    }
  }

  return (
    <Popup
      isActive={isActive}
      title="Thông tin người dùng"
      footer={
        <div className="py-4 flex items-center justify-end gap-x-2 px-6">
          {isLoading || userInfo === null ? (
            <>
              <LoadingItem className="w-[140px] h-11 rounded-md" />
              <LoadingItem className="w-[140px] h-11 rounded-md" />
            </>
          ) : (
            <>
              <Button
                style={{
                  height: 44,
                  borderRadius: 6,
                }}
                buttonType={ButtonType.Secondary}
                onClick={onClose}
              >
                Đóng
              </Button>
              <Button
                type="submit"
                style={{
                  height: 44,
                  borderRadius: 6,
                }}
                onClick={openConfirmPopup}
              >
                Lưu
              </Button>
            </>
          )}
        </div>
      }
      onClose={onClose}
    >
      <div>
        {isLoading || userInfo === null ? (
          <div>
            <div className="mb-2 grid grid-cols-2 gap-x-4">
              <div>
                <div className="w-96 mb-2">
                  <div>
                    <LoadingItem className="w-28 h-4 mb-1 rounded-md" />
                    <LoadingItem className="w-full h-10 rounded-md" />
                  </div>
                </div>
                <div className="w-96">
                  <div>
                    <LoadingItem className="w-36 h-4 mb-1 rounded-md" />
                    <LoadingItem className="w-full h-10 rounded-md" />
                  </div>
                </div>
              </div>
              <div className="relative w-36 h-36 justify-self-center">
                <LoadingItem className="w-full h-full rounded-full" />
              </div>
            </div>

            <div className="mb-2 flex items-center gap-x-4">
              <div className="w-96">
                <div>
                  <LoadingItem className="w-36 h-4 mb-1 rounded-md" />
                  <LoadingItem className="w-full h-10 rounded-md" />
                </div>
              </div>
              <div className="w-96">
                <div>
                  <LoadingItem className="w-28 h-4 mb-1 rounded-md" />
                  <LoadingItem className="w-full h-10 rounded-md" />
                </div>
              </div>
            </div>

            <div className="mb-2 flex items-center gap-x-4">
              <div className="w-96">
                <div>
                  <LoadingItem className="w-28 h-4 mb-1 rounded-md" />
                  <LoadingItem className="w-full h-10 rounded-md" />
                </div>
              </div>
              <div className="w-96">
                <div>
                  <LoadingItem className="w-36   h-4 mb-1 rounded-md" />
                  <LoadingItem className="w-full h-10 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-2 grid grid-cols-2 gap-x-4">
              <div>
                <div className="w-96 mb-2">
                  <InputField
                    name="code"
                    id="code"
                    label="Mã Người dùng"
                    required={true}
                    typeStyle={TypeStyle.Normal}
                    value={userInfo.code}
                    error={errors.code}
                    disabled={true}
                  />
                </div>
                <div className="w-96">
                  <InputField
                    name="fullName"
                    id="fullName"
                    label="Họ tên"
                    required={true}
                    typeStyle={TypeStyle.Normal}
                    value={userInfo.fullName}
                    error={errors.fullName}
                    isAutoFocus={true}
                    onInput={(e) =>
                      setUserInfo((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="relative w-36 h-36 justify-self-center">
                <ImageUploader
                  name="avatar"
                  id="avatar"
                  width={144}
                  height={144}
                  isAvatar
                  value={userInfo.avatar}
                  onChange={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      avatar: e,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mb-2 flex items-center gap-x-4">
              <div className="w-96">
                <InputField
                  name="email"
                  id="email"
                  label="Email"
                  required={true}
                  typeStyle={TypeStyle.Normal}
                  value={userInfo.email}
                  error={errors.email}
                  onInput={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="w-96">
                <InputField
                  name="city"
                  id="city"
                  label="Tỉnh/Thành phố"
                  typeStyle={TypeStyle.Normal}
                  value={userInfo.address?.city}
                  error={errors.name}
                  onInput={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      address: {
                        city: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="mb-2 flex items-center gap-x-4">
              <div className="w-96">
                <InputField
                  name="district"
                  id="district"
                  label="Quận/Huyện"
                  typeStyle={TypeStyle.Normal}
                  value={userInfo.address?.district}
                  error={errors.district}
                  onInput={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      address: {
                        district: e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div className="w-96">
                <InputField
                  name="detail"
                  id="detail"
                  label="Địa chỉ chi tiết"
                  typeStyle={TypeStyle.Normal}
                  value={userInfo.address?.detail}
                  error={errors.name}
                  onInput={(e) =>
                    setUserInfo((prev) => ({
                      ...prev,
                      address: {
                        detail: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <PopupMsg
              isActive={isActiveConfirmPopup}
              isLoading={isLoadingConfirmPopup}
              isActiveLoadingScreen={false}
              title="Xác nhận"
              msg={
                <div>
                  <span>Bạn có chắc chắn muốn lưu thông tin người dùng với mã </span>
                  <span className="font-medium">{userInfo.code}</span>?
                </div>
              }
              textAgreeBtn="Đồng ý"
              textCloseBtn="Hủy"
              onClose={closeConfirmPopup}
              onAgree={saveUserData}
            />
          </div>
        )}
      </div>
    </Popup>
  )
}

export default PopupUserDetail
