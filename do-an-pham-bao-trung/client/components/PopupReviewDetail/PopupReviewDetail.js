import React, { useEffect, useState } from 'react'
import Popup from '../Popup/Popup'
import Button from '../Button/Button'
import Image from 'next/image'
import LoadingItem from '../Loading/LoadingItem'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'
import baseApi from '../../api/BaseApi'

const PopupReviewDetail = ({ reviewId, isActive = false, onClose = () => {} }) => {
  const [reviewDetail, setReviewDetail] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (isActive) {
      getReviewDetail()
    }
  }, [isActive])

  const getReviewDetail = async () => {
    setIsLoading(true)
    try {
      const res = await baseApi.get(`/reviews/${reviewId}`)

      setReviewDetail(res.data.data)

      setIsLoading(false)
    } catch (error) {
      console.log(error)
      dispatch(
        openToastMsg({
          msg: 'Có lỗi xảy ra',
          status: ToastMsgStatus.Error,
        })
      )
    }
  }

  return (
    <Popup
      isActive={isActive}
      title="Chi tiết đánh giá"
      onClose={onClose}
      footer={
        <div className="py-4 flex items-center justify-end gap-x-2 px-6">
          <Button
            style={{
              height: 44,
              borderRadius: 6,
            }}
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      }
    >
      <div>
        {isLoading ? (
          <div>
            <div className="flex gap-x-4 items-center">
              <div className="flex items-center w-[400px]">
                <LoadingItem className="w-32 h-32 rounded-full" />
                <div className="ml-4">
                  <LoadingItem className="w-40 h-7 rounded-md mb-1" />
                  <LoadingItem className="w-48 h-5 rounded-md mb-1" />
                  <LoadingItem className="w-32 h-5 rounded-md" />
                </div>
              </div>
              <div className="w-60">
                <LoadingItem className="w-40 h-5 rounded-md mb-1" />
                <LoadingItem className="w-48 h-5 rounded-md" />
              </div>
            </div>
            <LoadingItem className="w-full h-32 rounded-md mt-4" />
          </div>
        ) : (
          <>
            <div className="flex gap-x-4 items-center">
              <div className="flex items-center w-[400px]">
                <div className="relative w-32 h-32 border border-black rounded-full overflow-hidden">
                  {reviewDetail && (
                    <Image
                      src={reviewDetail.user.avatar}
                      width={128}
                      height={128}
                      objectFit="cover"
                      objectPosition="center"
                    />
                  )}
                </div>
                <div className="ml-4">
                  <div className="text-lg font-medium">{reviewDetail?.userFullname}</div>
                  <div className="text-gray-500">{reviewDetail?.userEmail}</div>
                  <div className="text-gray-500">{reviewDetail?.user?.phoneNumber}</div>
                </div>
              </div>
              <div className="w-60">
                <div>
                  <span>Mã sản phẩm: </span>{' '}
                  <span className="font-medium">{reviewDetail?.productCode}</span>
                </div>
                <div>
                  <span>Tên sản phẩm: </span>{' '}
                  <span className="font-medium">{reviewDetail?.productName}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md py-2 mt-4 px-4">
              <div className="flex items-center justify-center gap-x-2">
                <div>Điểm đánh giá</div>
                <div className="flex items-center text-2xl">
                  {[1, 2, 3, 4, 5].map((currentScore) => {
                    return (
                      <div key={currentScore} className="group text-yellow-400 px-1 py-1">
                        {currentScore <= reviewDetail?.score ? (
                          <i className="fa-solid fa-star"></i>
                        ) : (
                          <i className="fa-regular fa-star"></i>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="mt-2">
                <div className="font-medium">Nội dung đánh giá:</div>
                <div>{reviewDetail?.comment}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </Popup>
  )
}

export default PopupReviewDetail
