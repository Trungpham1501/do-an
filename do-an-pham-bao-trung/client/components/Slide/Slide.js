import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const Slide = ({
  items = [],
  height = 500,
  delay = 0,
  isPagination = true,
  objectFit = 'cover',
}) => {
  const [value, setValue] = useState(1)
  const [timeoutFunc, setTimeoutFunc] = useState(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const containerRef = useRef(null)
  const sliderRef = useRef(null)

  useEffect(() => {
    let width = containerWidth
    if (!containerWidth && containerRef.current) {
      width = parseInt(containerRef.current.getBoundingClientRect().width)
      sliderRef.current.style.transform = `translateX(-${value * width}px)`
      setContainerWidth(width)
    }
    if (delay) {
      clearTimeout(timeoutFunc)
      const timeout = setTimeout(() => {
        const newVal = value + 1
        goToSlide(newVal, width)
      }, delay)
      setTimeoutFunc(timeout)
    }
  }, [value])

  useEffect(() => {
    clearTimeout(timeoutFunc)

    return () => {
      clearTimeout(timeoutFunc)
    }
  })

  const formattedItems = [...items]
  if (items.length) {
    formattedItems.push(items[0])
    formattedItems.unshift(items[items.length - 1])
  }

  const goToSlide = (newVal, containerWidthProp = 0) => {
    let currentContainerWidth = containerWidth
    if (containerWidthProp) {
      currentContainerWidth = containerWidthProp
    }
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${newVal * currentContainerWidth}px)`
      sliderRef.current.style.transition = 'transform 0.3s linear'
      setValue(newVal)
    }
  }

  const nextItem = () => {
    const newVal = value + 1
    goToSlide(newVal)
  }

  const prevItem = () => {
    const newVal = value - 1
    goToSlide(newVal)
  }

  const handleTransitionEnd = () => {
    if (value >= formattedItems.length - 1) {
      const newVal = 1
      sliderRef.current.style.transform = `translateX(-${newVal * containerWidth}px)`
      sliderRef.current.style.transition = 'none'
      setValue(newVal)
    } else if (value <= 0) {
      const newVal = formattedItems.length - 2
      sliderRef.current.style.transform = `translateX(-${newVal * containerWidth}px)`
      sliderRef.current.style.transition = 'none'
      setValue(newVal)
    }
  }

  const handleClickPaging = (idx) => {
    const newVal = idx + 1
    goToSlide(newVal)
  }

  return (
    <div
      ref={containerRef}
      className="w-full relative overflow-hidden"
      style={{
        height: height,
      }}
    >
      {items.length > 1 && (
        <div
          className="group absolute top-1/2 left-4 -translate-y-1/2 z-10 fill-white h-8 w-8 rounded-full flex justify-center items-center bg-blue-200 overflow-hidden cursor-pointer hover:bg-blue-500 transition-colors shadow-md border border-white border-solid"
          onClick={prevItem}
        >
          <svg
            className="relative left-[4px] scale-75 group-hover:scale-90 transition-all"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
          >
            <path d="M10 21.65.35 12 10 2.35l1.425 1.425L3.175 12l8.25 8.225Z" />
          </svg>
        </div>
      )}

      {items.length > 1 && (
        <div
          className="group absolute top-1/2 right-4 -translate-y-1/2 z-10 fill-white h-8 w-8 rounded-full flex justify-center items-center bg-blue-200 overflow-hidden cursor-pointer hover:bg-blue-500 transition-colors shadow-md border border-white border-solid"
          onClick={nextItem}
        >
          <svg
            className="relative left-[1px] scale-75 group-hover:scale-90 transition-all"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
          >
            <path d="M8.025 21.65 6.6 20.225 14.825 12 6.6 3.775 8.025 2.35l9.65 9.65Z" />
          </svg>
        </div>
      )}

      {isPagination && items.length > 1 && (
        <div className="absolute z-10 bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-4">
          {items.map((_, idx) => {
            let className =
              'w-3 h-3 flex items-center justify-center bg-blue-200 hover:bg-blue-500 hover:scale-125 transition-all cursor-pointer rounded-full shadow-md border border-white border-solid'
            if (value === idx + 1) {
              className += ' bg-blue-500 scale-125'
            }
            return <div className={className} key={idx} onClick={() => handleClickPaging(idx)} />
          })}
        </div>
      )}

      <ul
        ref={sliderRef}
        className={`p-0 m-0 list-none h-full flex`}
        style={{
          width: `${containerWidth * formattedItems.length}px`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {formattedItems.map((item, idx) => {
          const className = `relative h-full`
          return (
            <li
              key={idx}
              style={{
                width: `${containerWidth}px`,
              }}
              className={className}
            >
              <Image
                layout="fill"
                src={item.src}
                objectFit={objectFit}
                objectPosition="center"
                placeholder="blur"
                blurDataURL="https://firebasestorage.googleapis.com/v0/b/open-source-project-2f57f.appspot.com/o/images%2Fa1505a6c-9664-489e-8f74-e481943d7242.jpg?alt=media&token=7c1c8eb5-b146-46ae-90d9-45e7ecdbc480"
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Slide
