import React from 'react'
import { DataTypeEnum } from '../../enums/DataTypeEnum'
import Checkbox from '../Checkbox/Checkbox'
import { numberWithCommas, convertDate } from '../../js/commonFn'

const TableRow = ({
  rowData = {},
  headers = [],
  hasCheckbox = false,
  checked = false,
  allowEdit = false,
  allowDelete = false,
  rowHeight = '48px',
  onChangeChecked = () => {},
  onDelete = () => {},
  onEdit = () => {},
}) => {
  const handleChangeChecked = (e) => {
    onChangeChecked(rowData._id, e)
  }

  return (
    <tr className="group">
      {hasCheckbox && (
        <td
          style={{
            height: rowHeight,
          }}
          className="sticky left-0 z-[1] bg-white w-12 h-12 border-b border-gray-300 group-hover:bg-row-hover transition-colors"
        >
          <div className="flex items-center justify-center w-12">
            <Checkbox
              id={rowData._id}
              name={rowData._id}
              checked={checked}
              onChange={handleChangeChecked}
            />
          </div>
        </td>
      )}
      {headers.map((header) => {
        let tdClass =
          'bg-white text-base h-12 border-b border-gray-300 px-5 group-hover:bg-row-hover transition-colors whitespace-nowrap text-ellipsis overflow-hidden'
        let rowValue = ''
        let key = header.fieldName
        if (header.getData !== undefined && typeof header.getData === 'function') {
          rowValue = header.getData(rowData)
        } else if (header.parent) {
          rowValue = rowData[header.parent]
          if (rowValue) {
            rowValue = rowValue[header.fieldName]
          }
          key = `${header.parent}.${header.fieldName}`
        } else {
          rowValue = rowData[header.fieldName]
        }

        if (header.dataType === DataTypeEnum.Number) {
          rowValue = numberWithCommas(rowValue)
          tdClass += ' text-right'
        } else if (
          header.dataType === DataTypeEnum.Date ||
          header.dataType === DataTypeEnum.Code ||
          header.dataType === DataTypeEnum.PhoneNumber ||
          header.dataType === DataTypeEnum.Custom
        ) {
          if (header.dataType === DataTypeEnum.Date) {
            rowValue = convertDate(rowValue)
          }
          tdClass += ' text-center'
        } else {
          tdClass += ' text-left'
        }

        if (!rowValue) {
          rowValue = '-'
        }

        let tdStyle = {
          height: rowHeight,
        }

        if (header.sticky !== undefined) {
          tdStyle.position = 'sticky'
          tdStyle = {
            ...tdStyle,
            ...header.sticky,
          }
        }

        let cellTitle = ''
        if (typeof rowValue === 'number' || typeof rowValue === 'string') {
          cellTitle = rowValue
        }

        return (
          <td style={tdStyle} className={tdClass} key={key} title={cellTitle}>
            {rowValue}
          </td>
        )
      })}

      {allowEdit && (
        <td
          style={{
            height: rowHeight,
          }}
          className="sticky right-10 w-12 h-12 border-b border-gray-300 bg-white group-hover:bg-row-hover transition-colors"
        >
          <div
            className="flex items-center justify-end text-gray-500 cursor-pointer hover:text-primary transition-colors"
            onClick={() => onEdit(rowData._id)}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </div>
        </td>
      )}
      {allowDelete && (
        <td
          style={{
            height: rowHeight,
          }}
          className="sticky right-0 w-12 h-12 border-b border-gray-300 bg-white group-hover:bg-row-hover transition-colors"
        >
          <div
            className="flex items-center justify-center text-gray-500 cursor-pointer hover:text-red-600 transition-colors"
            onClick={() => onDelete(rowData._id)}
          >
            <i className="fa-solid fa-trash"></i>
          </div>
        </td>
      )}
    </tr>
  )
}

export default TableRow
