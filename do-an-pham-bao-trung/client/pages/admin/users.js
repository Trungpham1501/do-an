import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Button from '../../components/Button/Button'
import Table from '../../components/Table/Table'
import InputField from '../../components/InputField/InputField'
import Combobox from '../../components/Combobox/Combobox'
import Paging from '../../components/Paging/Paging'
import PopupMsg from '../../components/Popup/PopupMsg'
import PopupUserDetail from '../../components/PopupUserDetail/PopupUserDetail'

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
    name: 'Mã tăng dần',
  },
  {
    _id: 'code|-1',
    name: 'Mã giảm dần',
  },
  {
    _id: 'fullName|1',
    name: 'Họ tên tăng dần',
  },
  {
    _id: 'fullName|-1',
    name: 'Họ tên giảm dần',
  },
  {
    _id: 'totalOrders|1',
    name: 'Số đơn hàng tăng dần',
  },
  {
    _id: 'totalOrders|-1',
    name: 'Số đơn hàng giảm dần',
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

const HEADERS = [
  {
    caption: 'Mã người dùng',
    fieldName: 'code',
    dataType: DataTypeEnum.Text,
    width: '150px',
    minWidth: '150px',
    sticky: {
      left: '48px',
    },
  },
  {
    caption: 'Tên người dùng',
    fieldName: 'fullName',
    dataType: DataTypeEnum.Text,
    minWidth: '170px',
  },
  {
    caption: 'Số điện thoại',
    fieldName: 'phoneNumber',
    dataType: DataTypeEnum.PhoneNumber,
    width: '140px',
    minWidth: '140px',
  },
  {
    caption: 'Email',
    fieldName: 'email',
    dataType: DataTypeEnum.Text,
    minWidth: '200px',
  },
  {
    caption: 'Thành phố',
    fieldName: 'city',
    parent: 'address',
    dataType: DataTypeEnum.Text,
    width: '150px',
    minWidth: '150px',
  },
  {
    caption: 'Số đơn hàng',
    fieldName: 'totalOrders',
    dataType: DataTypeEnum.Number,
    width: '130px',
    minWidth: '130px',
  },
  {
    caption: 'Tổng tiền đã chi',
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
]

const UsersAdmin = () => {
  const [isActivePopupDetail, setIsActivePopupDetail] = useState(false)
  const [entities, setEntities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [searchText, setSearchText] = useState('')
  const [selectedSortOption, setSelectedSortOption] = useState('code|1')
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
    setIsActivePopupDetail(true)
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

  const handleChangePageIndex = (newPageIdx) => {
    setPageIndex(newPageIdx)
    getPaging(generateQuery({ PageIndex: newPageIdx }))
  }

  const handleChangePageSize = (newPageSize) => {
    setPageSize(newPageSize)
    setPageIndex(1)
    getPaging(generateQuery({ PageSize: newPageSize, PageIndex: 1 }))
  }

  const handleClosePopupDetail = (isReload = false) => {
    setIsActivePopupDetail(false)
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
        res = await baseApi.delete(`/users/${selectedId}`)
        msg = 'Xóa thành công 1 người dùng'
        const deletedEntity = entities.find((e) => e._id === selectedId)
        if (deletedEntity) {
          msg = `Xóa thành công người dùng có mã <${deletedEntity.code}>`
        }
      } else {
        const idList = selectedRows.join(';')
        res = await baseApi.delete(`/users/${idList}`)
        msg = `Xóa thành công ${selectedRows.length} người dùng`
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
      const res = await baseApi.get(`/users/query?${query}`)
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

  const generateQuery = ({ SearchText = null, PageSize = null, PageIndex = null, Sort = null }) => {
    const query = `pageSize=${PageSize || pageSize}&pageIndex=${
      PageIndex || pageIndex
    }&searchText=${SearchText !== null ? SearchText : searchText}&sort=${
      Sort || selectedSortOption
    }`
    return query
  }

  return (
    <div className="container mx-auto px-6 mt-6">
      <Head>
        <title>Người dùng</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <main className="w-full">
        <div className="flex items-center justify-between">
          <div className="w-96">
            <InputField
              id="search-text"
              name="search-text"
              placeholder="Tìm kiếm tên, mã, email, số điện thoại người dùng,..."
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

      <PopupUserDetail
        isActive={isActivePopupDetail}
        userId={selectedId}
        onClose={handleClosePopupDetail}
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
                <span>người dùng?</span>
              </div>
            ) : selectedId !== '' ? (
              <div>
                <span>Bạn có chắc muốn xóa người dùng có mã </span>
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

export default UsersAdmin
