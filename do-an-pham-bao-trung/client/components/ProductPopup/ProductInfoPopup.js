import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ButtonType } from '../../enums/ButtomEnum'
import { TypeStyle } from '../../enums/InputFieldEnum'
import { useValidate } from '../../hooks/validationHook'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'
import baseApi from '../../api/BaseApi'

import Popup from '../Popup/Popup'
import PopupMsg from '../Popup/PopupMsg'
import InputField from '../InputField/InputField'
import Button from '../Button/Button'
import Combobox from '../Combobox/Combobox'
import InputFieldNumber from '../InputField/InputFieldNumber'
import ImageUploader from '../ImageUploader/ImageUploader'
import CarColorPicker from '../CarColorPicker/CarColorPicker'
import RadioGroup from '../Radio/RadioGroup'

const INITIAL_PRODUCT_DATA = {
  code: '',
  name: '',
  number: 0,
  price: 0,
  image: '',
  gallery: [],
  desc: '',
}

const ProductInfoPopup = ({ isActive = false, edittingProductId = '', onClose = () => {} }) => {
  const [productData, setProductData] = useState(JSON.parse(JSON.stringify(INITIAL_PRODUCT_DATA)))

  const { errors, validate, clearErrors, setServerErrors } = useValidate({
    name: {
      name: 'Tên sản phẩm',
      rules: ['required'],
    },
    number: {
      name: 'Số lượng',
      rules: ['required'],
    },
    price: {
      name: 'Giá',
      rules: ['required'],
    },
    image: {
      name: 'Hình ảnh',
      rules: ['required'],
    },
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingConfirmPopup, setIsLoadingConfirmPopup] = useState(false)
  const [isActiveConfirmPopup, setIsActiveConfirmPopup] = useState(false)
  const [isFirstValidate, setIsFirstValidate] = useState(true)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!isActive) {
      setProductData(JSON.parse(JSON.stringify(INITIAL_PRODUCT_DATA)))
      setIsFirstValidate(true)
      clearErrors()
    } else {
      const getInitialData = async () => {
        setIsLoading(true)
        try {
          const resNewCode = await baseApi.get('/products/newCode')
          if (resNewCode.data.success) {
            setProductData((prev) => {
              return {
                ...prev,
                code: resNewCode.data.data,
              }
            })
          }
          setIsLoading(false)
        } catch (error) {
          console.log(error)
          setIsLoading(false)
        }
      }

      const getInitialDataWithId = async (id) => {
        setIsLoading(true)
        try {
          const resProduct = await baseApi.get(`/products/${id}`)
          if (resProduct.data.success) {
            setProductData({
              ...resProduct.data.data,
            })
          }
          setIsLoading(false)
        } catch (error) {
          console.log(error)
          setIsLoading(false)
        }
      }

      if (edittingProductId) {
        getInitialDataWithId(edittingProductId)
      } else {
        getInitialData()
      }
    }
  }, [isActive])

  useEffect(() => {
    if (!isFirstValidate) {
      validate(productData)
    }
  }, [productData])

  const handleSaveProduct = async (e) => {
    setIsLoadingConfirmPopup(true)
    try {
      let res = null
      if (edittingProductId) {
        res = await baseApi.put(`/products/${edittingProductId}`, productData)
      } else {
        res = await baseApi.post('products', productData)
      }
      if (res.data.success) {
        setIsLoadingConfirmPopup(false)
        dispatch(
          openToastMsg({
            status: ToastMsgStatus.Success,
            msg: `Lưu thành công thông tin sản phẩm với mã <${productData.code}>`,
          })
        )
        handleCloseConfirmPopup()
        onClose(true)
      }
    } catch (error) {
      setIsLoadingConfirmPopup(false)
      handleCloseConfirmPopup()
      if (error.response.status === 400) {
        setServerErrors(error.response.data.errors)
      } else {
        console.log(error)
        dispatch(
          openToastMsg({
            status: ToastMsgStatus.Error,
            msg: 'Có lỗi xảy ra',
          })
        )
      }
    }
  }

  const handleOpenConfirmPopup = () => {
    setIsFirstValidate(false)
    if (validate(productData)) {
      setIsActiveConfirmPopup(true)
    }
  }

  const handleCloseConfirmPopup = () => {
    setIsActiveConfirmPopup(false)
  }

  return (
    <Popup
      title={`${edittingProductId ? 'Thông tin sản phẩm' : 'Thêm sản phẩm'}`}
      isLoading={isLoading}
      isActive={isActive}
      onClose={onClose}
      footer={
        <div className="py-4 flex items-center justify-end gap-x-2 px-6">
          <Button
            style={{
              height: 44,
              borderRadius: 6,
            }}
            buttonType={ButtonType.Secondary}
            onClick={onClose}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            style={{
              height: 44,
              borderRadius: 6,
            }}
            onClick={handleOpenConfirmPopup}
          >
            Lưu
          </Button>
        </div>
      }
    >
      <div className="max-h-[calc(100vh_-_204px)]">
        <div>
          <h2 className="text-lg font-medium leading-none mb-4">Thông tin chung</h2>
          <div className="mb-2 flex items-center gap-x-4">
            <div className="w-96">
              <InputField
                name="code"
                id="code"
                label="Mã sản phẩm"
                required={true}
                typeStyle={TypeStyle.Normal}
                value={productData.code}
                error={errors.code}
                disabled={true}
              />
            </div>
            <div className="w-96">
              <InputField
                name="productName"
                id="productName"
                label="Tên sản phẩm"
                required={true}
                typeStyle={TypeStyle.Normal}
                value={productData.name}
                error={errors.name}
                onInput={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                isAutoFocus={true}
              />
            </div>
          </div>

          <div className="mb-2 flex items-center gap-x-4">
            <div className="w-96">
              <InputFieldNumber
                name="price"
                id="price"
                label="Giá cơ bản"
                required={true}
                value={productData.price}
                error={errors.price}
                onInput={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    price: e,
                  }))
                }
              />
            </div>
            <div className="w-96">
              <InputFieldNumber
                name="number"
                id="number"
                label="Số lượng"
                required={true}
                value={productData.number}
                error={errors.number}
                onInput={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    number: e,
                  }))
                }
              />
            </div>
          </div>

          <div className="mb-2 flex items-center gap-x-4">
            <div className="w-96">
              <ImageUploader
                id="image"
                name="image"
                label="Hình đại diện sản phẩm"
                width={384}
                height={384}
                required
                value={productData.image}
                error={errors.image}
                onChange={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    image: e,
                  }))
                }
              />
            </div>
            <div className="w-96">
              <InputField
                name="desc"
                id="desc"
                label="Mô tả"
                typeStyle={TypeStyle.TextArea}
                value={productData.desc}
                height="384px"
                onInput={(e) =>
                  setProductData((prev) => ({
                    ...prev,
                    desc: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="mb-2">
            <ImageUploader
              name="gallery"
              id="gallery"
              label="Thư viện hình ảnh"
              value={productData.gallery}
              isMultiple
              onChange={(e) =>
                setProductData((prev) => ({
                  ...prev,
                  gallery: e,
                }))
              }
            />
          </div>

          <PopupMsg
            isActive={isActiveConfirmPopup}
            isLoading={isLoadingConfirmPopup}
            isActiveLoadingScreen={false}
            title="Xác nhận"
            msg={
              <div>
                <span>Bạn có chắc chắn muốn lưu thông tin sản phẩn với mã </span>
                <span className="font-medium">{productData.code}</span>?
              </div>
            }
            textAgreeBtn="Đồng ý"
            textCloseBtn="Hủy"
            onClose={handleCloseConfirmPopup}
            onAgree={handleSaveProduct}
          />
        </div>
      </div>
    </Popup>
  )
}

export default ProductInfoPopup
