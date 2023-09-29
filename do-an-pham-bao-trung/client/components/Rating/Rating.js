import React, { useEffect, useState } from 'react'
import RatingInput from './RatingInput'
import CommentItem from './CommentItem'
import RatingResult from '../RatingResult/RatingResult'
import LoadingItem from '../Loading/LoadingItem'
import Image from 'next/image'

import NoReviewImg from '../../assets/images/no-review.jpg'
import baseApi from '../../api/BaseApi'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'

const formatRatingResult = (ratingResult) => {
  const result = {
    one: 0,
    two: 0,
    three: 0,
    four: 0,
    five: 0,
  }
  ratingResult.forEach((rating) => {
    switch (rating._id) {
      case 1:
        result.one = rating.numberReviews
        break
      case 2:
        result.two = rating.numberReviews
        break
      case 3:
        result.three = rating.numberReviews
        break
      case 4:
        result.four = rating.numberReviews
        break
      case 5:
        result.five = rating.numberReviews
        break
      default:
        break
    }
  })
  return result
}

const Rating = ({ product }) => {
  const [comments, setComments] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [ratingResult, setRatingResult] = useState([])

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (router.query.id) {
      getReviews()
    }
  }, [router.asPath])

  const getReviews = async () => {
    setIsLoading(true)
    const productId = router.query.id
    try {
      const [res, res2] = await Promise.all([
        baseApi.get(`/reviews/getByProductId/${productId}`),
        baseApi.get(`/reviews/getRatingResult/${productId}`),
      ])
      setRatingResult(formatRatingResult(res2.data.data))
      setComments(res.data.data.pageData)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      dispatch(
        openToastMsg({
          msg: 'Có lỗi xảy ra',
          status: ToastMsgStatus.Error,
        })
      )
      console.log(error)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <RatingResult reviews={ratingResult} />
      <div className="bg-gray-50 rounded-md px-6 py-2 w-full">
        <RatingInput product={product} onSendReview={getReviews} />
        {isLoading ? (
          <div className="mt-6 h-[232px] overflow-y-auto w-full">
            {[1, 2, 3, 4].map((loadingItem) => (
              <div
                key={loadingItem}
                className="h-[51px] w-full flex items-center gap-x-3 mb-2 last:mb-0"
              >
                <LoadingItem className="w-10 h-10 rounded-full shrink-0" />
                <LoadingItem className="grow h-full rounded-md" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="mt-6 h-[232px] overflow-y-auto w-full">
            <div className="relative w-full h-full bg-white rounded-md">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white text-primary/80 text-sm z-[1]">
                Chưa có đánh giá về sản phẩm
              </div>
              <Image src={NoReviewImg} layout="fill" objectFit="contain" objectPosition="center" />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-500 w-full text-center">
                Hãy là người đầu tiên đánh giá sản phẩm
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 h-[232px] overflow-y-auto w-full">
            {comments.map((comment) => {
              return <CommentItem key={comment._id} {...comment} />
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Rating
