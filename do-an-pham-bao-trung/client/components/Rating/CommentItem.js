import React from 'react'
import Image from 'next/image'
import { convertDate } from '../../js/commonFn'

const CommentItem = ({ user, score, comment, createdAt }) => {
  return (
    <div className="flex items-center gap-x-3 mb-2 last:mb-0 w-full">
      <div className="relative shrink-0 w-10 h-10 border border-black rounded-full overflow-hidden">
        {user.avatar && (
          <Image
            className="object-cover object-center"
            src={user.avatar}
            width={64}
            height={64}
            objectFit="cover"
            objectPosition="center"
          />
        )}
      </div>
      <div className="bg-white rounded-md px-4 py-1 grow w-[calc(100%_-_52px)]">
        <div className="font-medium">
          <span>{user.fullName}</span>
          <span className="inline-block pl-1 text-xs font-normal text-gray-500">
            {convertDate(createdAt)}
          </span>
        </div>
        <div className="text-sm flex items-center">
          <span className="leading-none pr-1">{score} </span>{' '}
          <span className="text-yellow-400 text-lg leading-none pr-2">
            <i className="fa-solid fa-star"></i>
          </span>
          <span
            className="leading-none block text-ellipsis overflow-hidden whitespace-nowrap"
            title={comment}
          >
            {comment}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CommentItem
