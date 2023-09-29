import React, { useEffect, useRef } from 'react'
import { DataTypeEnum } from '../../enums/DataTypeEnum'
import TableRow from './TableRow'
import Checkbox from '../Checkbox/Checkbox'

const Table = ({
  headers = [],
  data = [],
  hasCheckbox = false,
  allowEdit = false,
  allowDelete = false,
  isLoading = false,
  height = '100%',
  rowHeight = '48px',
  checkedRows = [],
  onCheckRow = () => {},
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (isLoading && containerRef.current) {
      containerRef.current.scrollTo(0, 0)
    }
  }, [isLoading])

  const handleChangeCheckedRow = (rowId, checked) => {
    if (checked) {
      onCheckRow([...checkedRows, rowId])
    } else {
      onCheckRow(checkedRows.filter((id) => id !== rowId))
    }
  }

  return (
    <div
      ref={containerRef}
      style={{
        height,
        overflow: isLoading ? 'hidden' : null,
      }}
      className="relative w-full overflow-auto"
    >
      {isLoading && (
        <div>
          <div className="absolute flex items-center justify-center z-10 top-0 left-0 w-full h-full backdrop-blur-sm">
            <div className="h-24 w-24 border-4 border-y-transparent border-x-primary rounded-full animate-spin" />
          </div>
        </div>
      )}
      <table className="w-full border-collapse border-spacing-0 table-fixed">
        <thead className="sticky top-0 z-[2]">
          <tr>
            {hasCheckbox && (
              <th className="sticky left-0 h-12 px-0 bg-white text-base text-gray-800 font-medium">
                <div className="border-b border-gray-300 h-full w-full">
                  <div className="flex items-center justify-center w-full h-full">
                    <Checkbox id="check-all" name="check-all" />
                  </div>
                </div>
              </th>
            )}
            {headers.map((header, idx) => {
              let thClass =
                'whitespace-nowrap h-12 px-0 bg-white text-base text-gray-800 font-medium text-left'
              if (header.dataType === DataTypeEnum.Number) {
                thClass =
                  'whitespace-nowrap h-12 px-0 bg-white text-base text-gray-800 font-medium text-right'
              } else if (
                header.dataType === DataTypeEnum.Date ||
                header.dataType === DataTypeEnum.Code ||
                header.dataType === DataTypeEnum.PhoneNumber ||
                header.dataType === DataTypeEnum.Custom
              ) {
                thClass = 'h-12 px-0 bg-white text-base text-gray-800 font-medium text-center'
              }

              let thStyle = {
                height: rowHeight,
              }

              if (header.sticky !== undefined) {
                thStyle.position = 'sticky'
                thStyle = {
                  ...thStyle,
                  ...header.sticky,
                }
              }

              return (
                <th className={thClass} style={thStyle} key={idx}>
                  <div className="border-b border-gray-300 h-full w-full px-5 leading-[48px]">
                    {header.caption}
                  </div>
                </th>
              )
            })}
            {allowEdit && (
              <th className="sticky right-10 h-12 px-0 bg-white text-base text-gray-800 font-medium">
                <div className="border-b border-gray-300 h-full w-full"></div>
              </th>
            )}
            {allowDelete && (
              <th className="sticky right-0 h-12 px-0 bg-white text-base text-gray-800 font-medium">
                <div className="border-b border-gray-300 h-full w-full"></div>
              </th>
            )}
          </tr>
        </thead>

        <colgroup>
          {hasCheckbox && (
            <col
              style={{
                width: '48px',
              }}
            />
          )}
          {headers.map((header) => {
            let key = header.fieldName
            if (header.parent) {
              key = `${header.parent}.${header.fieldName}`
            }
            return (
              <col
                key={key}
                style={{
                  width: header.width ? header.width : null,
                  minWidth: header.minWidth ? header.minWidth : '80px',
                }}
              />
            )
          })}
          {allowEdit && (
            <col
              style={{
                width: '32px',
              }}
            />
          )}
          {allowDelete && (
            <col
              style={{
                width: '40px',
              }}
            />
          )}
        </colgroup>

        <tbody>
          {data.map((rowData) => {
            return (
              <TableRow
                key={rowData._id}
                headers={headers}
                rowData={rowData}
                rowHeight={rowHeight}
                allowEdit={allowEdit}
                allowDelete={allowDelete}
                checked={
                  checkedRows.findIndex((rowId) => rowId === rowData._id) >= 0 ? true : false
                }
                hasCheckbox={hasCheckbox}
                onChangeChecked={handleChangeCheckedRow}
                onEdit={(rowId) => onEdit(rowId)}
                onDelete={(rowId) => onDelete(rowId)}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Table
