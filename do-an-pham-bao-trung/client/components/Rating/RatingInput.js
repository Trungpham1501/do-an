import React, { useState } from 'react'
import Image from 'next/image'
import InputField from '../InputField/InputField'
import PopupMsg from '../Popup/PopupMsg'
import Link from 'next/link'

import baseApi from '../../api/BaseApi'
import { useAccount } from '../../hooks/accountHook'
import { TypeStyle } from '../../enums/InputFieldEnum'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'
import { useRouter } from 'next/router'

const RatingInput = ({ product, onSendReview = () => {} }) => {
  const [score, setScore] = useState(0)
  const [comment, setComment] = useState('')
  const [hoverScoreIdx, setHoverScoreIdx] = useState(0)
  const [isLoadingSend, setIsLoadingSend] = useState(false)
  const [isActivePopupMsg, setIsActivePopupMsg] = useState(false)
  const [msg, setMsg] = useState('')

  const dispatch = useDispatch()
  const router = useRouter()

  const handleSendReview = (e) => {
    if (isLoadingSend) {
      return
    }

    if (e.key === 'Enter') {
      sendRating()
    }
  }

  const handleInput = (e) => {
    if (!isLoadingSend) {
      setComment(e.target.value)
    }
  }

  const handleClickScore = (currentScore) => {
    if (!isLoadingSend) {
      setScore(currentScore)
    }
  }

  const sendRating = async () => {
    if (!comment.trim()) {
      setIsActivePopupMsg(true)
      setMsg('Bạn cần điền đánh giá của bạn về sản phẩm')
      return
    }
    if (score === 0) {
      setIsActivePopupMsg(true)
      setMsg('Bạn cần đánh giá số điểm cho sản phẩm')
      return
    }
    setIsLoadingSend(true)
    const productId = router.query.id
    try {
      await baseApi.post('reviews', {
        product: productId,
        productCode: product.code,
        productName: product.name,
        user: accountInfo._id,
        userCode: accountInfo.code,
        userFullname: accountInfo.fullName,
        userEmail: accountInfo.email,
        comment,
        score,
      })
      dispatch(
        openToastMsg({
          msg: 'Gửi đánh giá thành công',
          status: ToastMsgStatus.Success,
        })
      )
      setIsLoadingSend(false)
      setScore(0)
      setComment('')
      onSendReview()
    } catch (error) {
      console.log(error)
      dispatch(
        openToastMsg({
          msg: 'Có lỗi xảy ra',
          status: ToastMsgStatus.Error,
        })
      )
      setIsLoadingSend(false)
    }
  }

  const { accountInfo } = useAccount()

  if (!accountInfo?._id) {
    return (
      <div className="bg-gray-50 rounded-md text-center">
        Hãy{' '}
        <Link href="/sign-in">
          <a className="text-primary">đăng nhập</a>
        </Link>{' '}
        đề đánh giá sản phẩm
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-md">
      <div className="flex items-center justify-center gap-x-2">
        <div>Điểm đánh giá của bạn đối với sản phẩm</div>
        <div className="flex items-center text-2xl">
          {[1, 2, 3, 4, 5].map((currentScore) => {
            return (
              <div
                key={currentScore}
                className="group text-yellow-400 px-1 py-1 cursor-pointer"
                onClick={() => handleClickScore(currentScore)}
                onMouseEnter={() => setHoverScoreIdx(currentScore)}
                onMouseLeave={() => setHoverScoreIdx(0)}
              >
                {currentScore <= hoverScoreIdx || currentScore <= score ? (
                  <i className="fa-solid fa-star"></i>
                ) : (
                  <i className="fa-regular fa-star"></i>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="flex items-center gap-x-3 mt-2">
        <div className="relative shrink-0 w-10 h-10 border border-black rounded-full overflow-hidden">
          {accountInfo?.avatar && (
            <Image
              className="object-cover object-center"
              src={accountInfo.avatar}
              width={64}
              height={64}
              objectFit="cover"
              objectPosition="center"
            />
          )}
        </div>
        <div className="grow">
          <InputField
            id="comment"
            name="comment"
            placeholder="Đánh giá của bạn về sản phẩm ..."
            typeStyle={TypeStyle.Normal}
            height={60}
            disabled={isLoadingSend}
            value={comment}
            icon={
              <>
                {isLoadingSend ? (
                  <div className="flex items-center justify-center w-6 h-6 bg-transparent">
                    <div className="h-4 w-4 border-2 border-y-transparent border-x-primary rounded-full animate-spin" />
                  </div>
                ) : (
                  <div className="text-primary cursor-pointer flex items-center text-xl">
                    <i className="fa-solid fa-paper-plane"></i>
                  </div>
                )}
              </>
            }
            onInput={handleInput}
            onKeyDown={handleSendReview}
            onClickIcon={() => handleSendReview({ key: 'Enter' })}
          />
        </div>
      </div>

      <PopupMsg
        isActive={isActivePopupMsg}
        title="Thông báo"
        msg={msg}
        textAgreeBtn="Đóng"
        onClose={() => setIsActivePopupMsg(false)}
        onAgree={() => setIsActivePopupMsg(false)}
      />
    </div>
  )
}

export default RatingInput
