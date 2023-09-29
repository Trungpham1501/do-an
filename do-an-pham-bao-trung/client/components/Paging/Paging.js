import React, { useEffect, useState } from 'react'
import Combobox from '../Combobox/Combobox'
import { ComboboxLabelPositionEnum, ComboboxOptionPositionEnum } from '../../enums/ComboboxEnum'

const PAGE_SiZE_OPTIONS = [
  {
    _id: '20',
    name: '20 bản ghi',
  },
  {
    _id: '50',
    name: '50 bản ghi',
  },
  {
    _id: '100',
    name: '100 bản ghi',
  },
]

const Paging = ({
  totalRecords,
  pageSize = '30',
  pageIndex = 1,
  onChangePageSize = () => {},
  onChangePageIndex = () => {},
}) => {
  const [totalPageArr, setTotalPageArr] = useState([])
  const [renderedPages, setRenderedPages] = useState([])
  const [totalPage, setTotalPage] = useState(0)

  useEffect(() => {
    const totalPage = Math.ceil(totalRecords / parseInt(pageSize))
    setTotalPage(totalPage)
    const arr = []
    for (let index = 1; index <= totalPage; index++) {
      arr.push(index)
    }
    setTotalPageArr(arr)

    const resultArr = [pageIndex]
    for (let index = 1; index < 3; index++) {
      const nextPageIdx = pageIndex + index
      if (nextPageIdx <= totalPage) {
        resultArr.push(nextPageIdx)
      }
      const prevPageIdx = pageIndex - index
      if (prevPageIdx >= 1) {
        resultArr.unshift(prevPageIdx)
      }

      setRenderedPages(resultArr)
    }
  }, [pageSize, totalRecords, pageIndex])

  const moveToNextPage = () => {
    const nextPageIdx = pageIndex + 1
    if (nextPageIdx > totalPage) {
      return
    }
    onChangePageIndex(nextPageIdx)
  }

  const moveToPrevPage = () => {
    const prevPageIdx = pageIndex - 1
    if (prevPageIdx < 1) {
      return
    }
    onChangePageIndex(prevPageIdx)
  }

  const moveToPageIndex = (pageIdx) => {
    if (pageIdx === pageIndex) {
      return
    }
    onChangePageIndex(pageIdx)
  }

  return (
    <div className="flex items-center justify-between h-14">
      <div className="text-sm">
        Tổng: <span className="font-medium">{totalRecords}</span> bản ghi
      </div>
      <div className="flex items-center gap-x-5">
        <div className="w-80">
          <Combobox
            id="page-size"
            name="page-size"
            items={PAGE_SiZE_OPTIONS}
            label="Số lượng bản ghi 1 trang"
            labelPosition={ComboboxLabelPositionEnum.Left}
            optionPosition={ComboboxOptionPositionEnum.Top}
            value={pageSize}
            onChange={(e) => onChangePageSize(e)}
          />
        </div>
        <div className="flex items-center">
          <div
            className={`w-10 h-10 text-sm rounded-md bg-white border border-white ${
              pageIndex === 1
                ? 'text-gray-300 cursor-default'
                : 'text-black cursor-pointer hover:bg-primary/30'
            } transition-all flex items-center justify-center`}
            onClick={moveToPrevPage}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </div>
          {pageIndex >= 4 && (
            <div className="flex items-center">
              <div
                className={`w-10 h-10 text-sm rounded-md bg-white border border-white text-black cursor-pointer hover:bg-primary/30 transition-all flex items-center justify-center`}
                onClick={() => onChangePageIndex(1)}
              >
                1
              </div>
              {pageIndex >= 5 && (
                <div className="w-10 h-10 flex items-center justify-center">...</div>
              )}
            </div>
          )}
          {renderedPages.map((pageIdx) => {
            return (
              <div
                key={pageIdx}
                className={`w-10 h-10 text-sm rounded-md bg-white border ${
                  pageIdx === pageIndex ? 'border-gray-300 font-medium' : 'border-white'
                } text-black hover:bg-primary/30 transition-all flex items-center justify-center cursor-pointer`}
                onClick={() => moveToPageIndex(pageIdx)}
              >
                {pageIdx}
              </div>
            )
          })}
          {pageIndex <= totalPageArr[totalPageArr.length - 4] && (
            <div className="flex items-center">
              {pageIndex <= totalPageArr[totalPageArr.length - 5] && (
                <div className="w-10 h-10 flex items-center justify-center">...</div>
              )}
              <div
                className={`w-10 h-10 text-sm rounded-md bg-white border border-white text-black cursor-pointer hover:bg-primary/30 transition-all flex items-center justify-center`}
                onClick={() => onChangePageIndex(totalPage)}
              >
                {totalPage}
              </div>
            </div>
          )}
          <div
            className={`w-10 h-10 text-sm rounded-md bg-white border border-white ${
              pageIndex === totalPageArr[totalPageArr.length - 1]
                ? 'text-gray-300 cursor-default'
                : 'text-black cursor-pointer hover:bg-primary/30'
            } transition-all flex items-center justify-center`}
            onClick={moveToNextPage}
          >
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Paging
