import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Button from '../../components/Button/Button'
import Table from '../../components/Table/Table'
import InputField from '../../components/InputField/InputField'
import Combobox from '../../components/Combobox/Combobox'
import Paging from '../../components/Paging/Paging'
import PopupMsg from '../../components/Popup/PopupMsg'
import PopupOrderDetail from '../../components/PopupOrderDetail/PopupOrderDetail'

import { OrderStatus } from '../../enums/OrderEnum'
import { DataTypeEnum } from '../../enums/DataTypeEnum'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'
import { ComboboxLabelPositionEnum } from '../../enums/ComboboxEnum'
import { TypeStyle } from '../../enums/InputFieldEnum'
import { ButtonType } from '../../enums/ButtomEnum'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import baseApi from '../../api/BaseApi'

const SORT_OPTIONS = [
  {
    _id: 'code|1',
    name: 'Số đơn tăng dần',
  },
  {
    _id: 'code|-1',
    name: 'Số đơn giảm dần',
  },
  {
    _id: 'totalMoney|1',
    name: 'Tổng tiền tăng dần',
  },
  {
    _id: 'totalMoney|-1',
    name: 'Tổng tiền giảm dần',
  },
  {
    _id: 'createdAt|1',
    name: 'Ngày tạo tăng dần',
  },
  {
    _id: 'createdAt|-1',
    name: 'Ngày tạo giảm dần',
  },
]

const STATUS_OPTIONS = [
  {
    _id: '',
    name: 'Tất cả',
  },
  {
    _id: OrderStatus.Pending,
    name: 'Chờ xác nhận',
  },
  {
    _id: OrderStatus.Comfirmed,
    name: 'Đã xác nhận',
  },
  {
    _id: OrderStatus.Completed,
    name: 'Đã giao dịch',
  },
]

const HEADERS = [
  {
    caption: 'Số đơn',
    fieldName: 'code',
    dataType: DataTypeEnum.Text,
    width: '95px',
    minWidth: '95px',
    sticky: {
      left: '48px',
    },
  },
  {
    caption: 'Mã người dùng',
    fieldName: 'code',
    parent: 'user',
    dataType: DataTypeEnum.Text,
    width: '150px',
    minWidth: '150px',
  },
  {
    caption: 'Tên người dùng',
    fieldName: 'fullName',
    parent: 'user',
    dataType: DataTypeEnum.Text,
    width: '170px',
    minWidth: '170px',
  },
  {
    caption: 'Số điện thoại',
    fieldName: 'phoneNumber',
    parent: 'user',
    dataType: DataTypeEnum.PhoneNumber,
    width: '140px',
    minWidth: '140px',
  },
  {
    caption: 'Email',
    fieldName: 'email',
    parent: 'user',
    dataType: DataTypeEnum.Text,
    minWidth: '200px',
  },
  {
    caption: 'Số lượng SP',
    fieldName: 'number',
    dataType: DataTypeEnum.Number,
    width: '130px',
    minWidth: '130px',
    getData: (rowValue) => {
      return rowValue.cars.reduce((prev, cur) => {
        return (prev += cur.number)
      }, 0)
    },
  },
  {
    caption: 'Tổng tiền',
    fieldName: 'totalMoney',
    dataType: DataTypeEnum.Number,
    width: '150px',
    minWidth: '150px',
  },
  {
    caption: 'Ngày tạo',
    fieldName: 'createdAt',
    dataType: DataTypeEnum.Date,
    width: '130px',
    minWidth: '130px',
  },
  {
    caption: 'Trạng thái',
    fieldName: 'status',
    dataType: DataTypeEnum.Custom,
    width: '150px',
    minWidth: '150px',
    sticky: {
      right: '72px',
    },
    getData: (rowValue) => {
      return (
        <div
          className={`flex items-center justify-center font-medium border-2 rounded-md h-8 w-[110px] ${
            rowValue.status === OrderStatus.Pending
              ? 'border-orange-500 text-orange-500'
              : rowValue.status === OrderStatus.Comfirmed
              ? 'border-primary text-primary'
              : rowValue.status === OrderStatus.Completed
              ? 'border-green-500 text-green-500'
              : ''
          }`}
        >
          {rowValue.status === OrderStatus.Pending ? (
            <div>Chờ xác nhận</div>
          ) : rowValue.status === OrderStatus.Comfirmed ? (
            <div>Đã xác nhận</div>
          ) : rowValue.status === OrderStatus.Completed ? (
            <div>Đã giao dịch</div>
          ) : null}
        </div>
      )
    },
  },
]

const OrdersAdmin = () => {
  const [isActivePopupAdd, setIsActivePopupAdd] = useState(false)
  const [entities, setEntities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [searchText, setSearchText] = useState('')
  const [selectedSortOption, setSelectedSortOption] = useState('code|1')
  const [selectedStatusOption, setSelectedStatusOption] = useState('')
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState('20')
  const [totalRecords, setTotalRecords] = useState(0)
  const [selectedId, setSelectedId] = useState('')
  const [searchFunc, setSearchFunc] = useState(null)
  const [isActivePopupDelete, setIsActivePopupDelete] = useState(false)
  const [isLoadingPopupDelete, setIsLoadingPopupDelete] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    getPaging(generateQuery({ PageIndex: 1 }))

    return () => {
      clearTimeout(searchFunc)
    }
  }, [])

  const handleEditRow = (id) => {
    setSelectedId(id)
    setIsActivePopupAdd(true)
  }

  const handleDeleteRow = (id) => {
    setSelectedId(id)
    setIsActivePopupDelete(true)
  }

  const handleChangeSearchText = (e) => {
    setSearchText(e.target.value)
    clearTimeout(searchFunc)
    setSearchFunc(
      setTimeout(() => {
        getPaging(generateQuery({ SearchText: e.target.value }))
      }, 500)
    )
  }

  const handleChangeSort = (e) => {
    getPaging(generateQuery({ Sort: e, PageIndex: 1 }))
    setPageIndex(1)
    setSelectedSortOption(e)
  }

  const handleChangeStatusOption = (e) => {
    getPaging(generateQuery({ Status: e, PageIndex: 1 }))
    setPageIndex(1)
    setSelectedStatusOption(e)
  }

  const handleChangePageIndex = (newPageIdx) => {
    setPageIndex(newPageIdx)
    getPaging(generateQuery({ PageIndex: newPageIdx }))
  }

  const handleChangePageSize = (newPageSize) => {
    setPageSize(newPageSize)
    setPageIndex(1)
    getPaging(generateQuery({ PageSize: newPageSize, PageIndex: 1 }))
  }

  const handleClosePopupAdd = (isReload = false) => {
    setIsActivePopupAdd(false)
    setSelectedId('')
    if (isReload === true) {
      getPaging(generateQuery({ PageIndex: 1 }))
    }
  }

  const handleClosePopupDelete = () => {
    setSelectedId('')
    setIsActivePopupDelete(false)
  }

  const handleClickDeleteMultiple = () => {
    if (selectedRows.length === 0) {
      return
    }
    if (selectedRows.length === 1) {
      setSelectedId(selectedRows[0])
    }
    setIsActivePopupDelete(true)
  }

  const handleDelete = async () => {
    setIsLoadingPopupDelete(true)
    try {
      let res = null
      let msg = ''
      if (selectedId !== '') {
        res = await baseApi.delete(`/orders/${selectedId}`)
        msg = 'Xóa thành công 1 đơn hàng'
        const deletedEntity = entities.find((e) => e._id === selectedId)
        if (deletedEntity) {
          msg = `Xóa thành công đơn hàng có số đơn <${deletedEntity.code}>`
        }
      } else {
        const idList = selectedRows.join(';')
        res = await baseApi.delete(`/orders/${idList}`)
        msg = `Xóa thành công ${selectedRows.length} đơn hàng`
      }
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Success,
          msg,
        })
      )
      setIsLoadingPopupDelete(false)
      setIsActivePopupDelete(false)
      getPaging(generateQuery({ PageIndex: null }))
    } catch (error) {
      setIsLoadingPopupDelete(false)
      setIsActivePopupDelete(false)
      if (error.response.status === 404) {
        dispatch(
          openToastMsg({
            status: ToastMsgStatus.Error,
            msg: 'Dữ liệu đã bị thay đổi hãy tải lại trang',
          })
        )
        return
      }
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Error,
          msg: 'Có lỗi xảy ra',
        })
      )
      console.log(error)
    }
  }

  const getPaging = async (query = '') => {
    setIsLoading(true)
    try {
      const res = await baseApi.get(`/orders/query?${query}`)
      setEntities([...res.data.data.pageData])
      setTotalRecords(res.data.data.totalRecords)
      setSelectedRows([])
      setSelectedId('')

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const generateQuery = ({
    SearchText = null,
    PageSize = null,
    PageIndex = null,
    Sort = null,
    Status = null,
  }) => {
    const query = `pageSize=${PageSize || pageSize}&pageIndex=${PageIndex || pageIndex}&status=${
      Status !== null ? Status : selectedStatusOption
    }&searchText=${SearchText !== null ? SearchText : searchText}&sort=${
      Sort || selectedSortOption
    }`
    return query
  }

  return (
    <div className="container mx-auto px-6 mt-6">
      <Head>
        <title>Đơn hàng</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <main className="w-full">
        <div className="flex items-center justify-between">
          <div className="w-96">
            <InputField
              id="search-text"
              name="search-text"
              placeholder="Tìm kiếm số đơn, tên, mã người dùng..."
              typeStyle={TypeStyle.Normal}
              startIcon={
                <div>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
              }
              value={searchText}
              onInput={handleChangeSearchText}
            />
          </div>
          <div className="flex items-center gap-x-3">
            <div className="w-72">
              <Combobox
                id="status-option"
                name="status-option"
                items={STATUS_OPTIONS}
                value={selectedStatusOption}
                label="Trạng thái"
                labelPosition={ComboboxLabelPositionEnum.Left}
                onChange={handleChangeStatusOption}
              />
            </div>
            <div className="w-72">
              <Combobox
                id="sort-option"
                name="sort-option"
                items={SORT_OPTIONS}
                value={selectedSortOption}
                label="Sắp xếp theo"
                labelPosition={ComboboxLabelPositionEnum.Left}
                onChange={handleChangeSort}
              />
            </div>
            <Button
              style={{
                height: '40px',
                width: '40px',
                minWidth: 'unset',
              }}
              className="hover:text-red-600 group"
              buttonType={ButtonType.Secondary}
              onClick={handleClickDeleteMultiple}
            >
              <div className="flex items-center justify-center group-hover:text-red-600">
                <i className="fa-solid fa-trash"></i>
              </div>
            </Button>
          </div>
        </div>
        <div className="mt-6">
          <Table
            headers={HEADERS}
            data={entities}
            hasCheckbox={true}
            allowEdit={true}
            allowDelete={true}
            checkedRows={selectedRows}
            isLoading={isLoading}
            height="calc(100vh - 200px)"
            onCheckRow={(e) => setSelectedRows(e)}
            onEdit={handleEditRow}
            onDelete={handleDeleteRow}
          />
        </div>
        <div>
          <Paging
            totalRecords={totalRecords}
            pageSize={pageSize}
            pageIndex={pageIndex}
            onChangePageIndex={handleChangePageIndex}
            onChangePageSize={handleChangePageSize}
          />
        </div>
      </main>

      <PopupOrderDetail
        isActive={isActivePopupAdd}
        orderId={selectedId}
        isAdminView={true}
        onClose={handleClosePopupAdd}
      />

      <PopupMsg
        isActive={isActivePopupDelete}
        isLoading={isLoadingPopupDelete}
        isActiveLoadingScreen={false}
        title="Xác nhận"
        textCloseBtn="Hủy"
        textAgreeBtn="Đồng ý"
        msg={
          <div>
            {selectedRows.length > 1 ? (
              <div>
                <span>Bạn có chắc muốn xóa </span>
                <span className="font-medium">{selectedRows.length} </span>
                <span>đơn hàng?</span>
              </div>
            ) : selectedId !== '' ? (
              <div>
                <span>Bạn có chắc muốn xóa đơn hàng có số đơn </span>
                <span className="font-medium">
                  {entities.find((e) => e._id === selectedId)?.code}
                </span>
              </div>
            ) : null}
          </div>
        }
        onClose={handleClosePopupDelete}
        onAgree={handleDelete}
      />
    </div>
  )
}

export default OrdersAdmin
