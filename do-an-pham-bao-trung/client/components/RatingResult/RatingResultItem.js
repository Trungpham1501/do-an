import React from 'react'

const RatingResultItem = ({ currentReviews, totalReviews, title }) => {
  let score = Math.round((currentReviews / totalReviews) * 100)
  if (isNaN(score)) {
    score = 0
  }
  return (
    <div className="flex items-center gap-x-2 py-3">
      <div className="text-primary">{title}</div>
      <div className="grow h-6 bg-gray-50 rounded-full relative">
        <div
          className={`absolute top-0 left-0 h-full bg-yellow-400 rounded-full shadow-[0_0_10px_3px_yellow-100] ${
            score > 0 ? 'shadow-yellow-200' : ''
          }`}
          style={{
            width: `${score}%`,
          }}
        ></div>
      </div>
      <div className="w-10">{score}%</div>
    </div>
  )
}

export default RatingResultItem
