import React from 'react'
import RatingResultItem from './RatingResultItem'

const INITIAL_REVIEWS = {
  five: 0,
  four: 0,
  three: 0,
  two: 0,
  one: 0,
}

const RatingResult = ({ reviews = INITIAL_REVIEWS }) => {
  const numReviews = reviews.five + reviews.four + reviews.three + reviews.two + reviews.one
  let score = (
    (reviews.five * 5 + reviews.four * 4 + reviews.three * 3 + reviews.two * 2 + reviews.one * 1) /
    numReviews
  ).toFixed(1)

  if (isNaN(score)) {
    score = 0
  }

  return (
    <div>
      <div>
        <div className="flex items-center gap-4 text-2xl bg-gray-100 py-4 px-8 rounded-3xl w-fit mx-auto">
          {[1, 2, 3, 4, 5].map((star) => {
            return (
              <div key={star} className="text-yellow-400 flex items-center">
                {star <= score ? (
                  <i className="fa-solid fa-star"></i>
                ) : star > score && star - score < 1 ? (
                  <i className="fa-regular fa-star-half-stroke"></i>
                ) : (
                  <i className="fa-regular fa-star"></i>
                )}
              </div>
            )
          })}
          <div className="text-base">{score}/5</div>
        </div>
        <div className="text-center text-gray-500 mt-2">{numReviews} lượt đánh giá về sản phẩm</div>
      </div>

      <div className="mt-10">
        <RatingResultItem title="5 Sao" currentReviews={reviews.five} totalReviews={numReviews} />
        <RatingResultItem title="4 Sao" currentReviews={reviews.four} totalReviews={numReviews} />
        <RatingResultItem title="3 Sao" currentReviews={reviews.three} totalReviews={numReviews} />
        <RatingResultItem title="2 Sao" currentReviews={reviews.two} totalReviews={numReviews} />
        <RatingResultItem title="1 Sao" currentReviews={reviews.one} totalReviews={numReviews} />
      </div>
    </div>
  )
}

export default RatingResult
