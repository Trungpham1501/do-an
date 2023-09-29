import React, { useEffect, useState } from 'react'
import baseApi from '../../api/BaseApi'
import { DataTypeEnum } from '../../enums/DataTypeEnum'
import { ComboboxLabelPositionEnum } from '../../enums/ComboboxEnum'
import { ButtonType } from '../../enums/ButtomEnum'
import { TypeStyle } from '../../enums/InputFieldEnum'

import Head from 'next/head'
import Image from 'next/image'
import Button from '../../components/Button/Button'
import ProductInfoPopup from '../../components/ProductPopup/ProductInfoPopup'
import Table from '../../components/Table/Table'
import InputField from '../../components/InputField/InputField'
import Combobox from '../../components/Combobox/Combobox'
import Paging from '../../components/Paging/Paging'
import PopupMsg from '../../components/Popup/PopupMsg'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'

const HEADERS = [
  {
    caption: 'Mã sản phẩm',
    fieldName: 'code',
    dataType: DataTypeEnum.Text,
    width: '140px',
    minWidth: '140px',
    sticky: {
      left: '48px',
    },
  },
  {
    caption: 'Hình ảnh',
    fieldName: 'image',
    dataType: DataTypeEnum.Custom,
    width: '150px',
    minWidth: '150px',
    getData: (rowValue) => {
      return (
        <div className="flex items-center">
          <Image
            src={rowValue.image}
            alt={rowValue.name}
            width={100}
            height={100}
            objectFit="contain"
            objectPosition="center"
          />
        </div>
      )
    },
  },
  {
    caption: 'Tên sản phẩm',
    fieldName: 'name',
    dataType: DataTypeEnum.Text,
    width: 'unset',
    minWidth: '200px',
  },
  {
    caption: 'Giá',
    fieldName: 'price',
    dataType: DataTypeEnum.Number,
    width: '200px',
    minWidth: '200px',
  },
  {
    caption: 'Số lượng',
    fieldName: 'number',
    dataType: DataTypeEnum.Number,
    width: '150px',
    minWidth: '150px',
  },
]

const SORT_OPTIONS = [
  {
    _id: 'code|1',
    name: 'Mã sản phẩm tăng dần',
  },
  {
    _id: 'code|-1',
    name: 'Mã sản phẩm giảm dần',
  },
  {
    _id: 'name|1',
    name: 'Tên sản phẩm tăng dần',
  },
  {
    _id: 'name|-1',
    name: 'Tên sản phẩm giảm dần',
  },
  {
    _id: 'price|1',
    name: 'Giá tăng dần',
  },
  {
    _id: 'price|-1',
    name: 'Giá giảm dần',
  },
  {
    _id: 'number|1',
    name: 'Số lượng tăng dần',
  },
  {
    _id: 'number|-1',
    name: 'Số lượng giảm dần',
  },
]

const ProductsAdmin = () => {
  const [isActivePopupAdd, setIsActivePopupAdd] = useState(false)
  const [isActivePopupDelete, setIsActivePopupDelete] = useState(false)
  const [isLoadingPopupDelete, setIsLoadingPopupDelete] = useState(false)
  const [deletedProductId, setDeletedProductId] = useState('')
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [edittingProductId, setEdittingProductId] = useState('')
  const [searchText, setSearchText] = useState('')
  const [selectedSortOption, setSelectedSortOption] = useState('code|1')
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState('20')
  const [totalRecords, setTotalRecords] = useState(0)
  const [searchFunc, setSearchFunc] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    getProducts()

    return () => {
      clearTimeout(searchFunc)
    }
  }, [])

  const getProducts = async () => {
    setIsLoading(true)
    try {
      getPagingProducts(generateQuery({ PageIndex: null })), setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const handleEditRow = (productId) => {
    setEdittingProductId(productId)
    setIsActivePopupAdd(true)
  }

  const handleDeleteRow = (productId) => {
    setDeletedProductId(productId)
    setIsActivePopupDelete(true)
  }

  const handleChangeSearchText = (e) => {
    setSearchText(e.target.value)
    clearTimeout(searchFunc)
    setSearchFunc(
      setTimeout(() => {
        getPagingProducts(generateQuery({ SearchText: e.target.value }))
      }, 500)
    )
  }

  const handleChangeSort = (e) => {
    getPagingProducts(generateQuery({ Sort: e, PageIndex: 1 }))
    setPageIndex(1)
    setSelectedSortOption(e)
  }

  const handleChangePageIndex = (newPageIdx) => {
    setPageIndex(newPageIdx)
    getPagingProducts(generateQuery({ PageIndex: newPageIdx }))
  }

  const handleChangePageSize = (newPageSize) => {
    setPageSize(newPageSize)
    setPageIndex(1)
    getPagingProducts(generateQuery({ PageSize: newPageSize, PageIndex: 1 }))
  }

  const generateQuery = ({ SearchText = null, PageSize = null, PageIndex = null, Sort = null }) => {
    const query = `pageSize=${PageSize || pageSize}&pageIndex=${
      PageIndex || pageIndex
    }&searchText=${SearchText !== null ? SearchText : searchText}&sort=${
      Sort || selectedSortOption
    }`
    return query
  }

  const getPagingProducts = async (query = '') => {
    setIsLoading(true)
    try {
      const resProduct = await baseApi.get(`/products/query?${query}`)
      setProducts([...resProduct.data.data.pageData])
      setTotalRecords(resProduct.data.data.totalRecords)
      setSelectedRows([])
      setDeletedProductId('')
      setEdittingProductId('')

      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.log(error)
    }
  }

  const handleClosePopup = (isReload = false) => {
    setIsActivePopupAdd(false)
    setEdittingProductId('')
    if (isReload === true) {
      getPagingProducts(generateQuery({ PageIndex: null }))
    }
  }

  const handleClickDeleteMultiple = () => {
    if (selectedRows.length === 0) {
      return
    }
    if (selectedRows.length === 1) {
      setDeletedProductId(selectedRows[0])
    }
    setIsActivePopupDelete(true)
  }

  const handleClosePopupDelete = () => {
    setIsActivePopupDelete(false)
    setDeletedProductId('')
  }

  const handleDeleteProducts = async () => {
    setIsLoadingPopupDelete(true)
    try {
      let res = null
      let msg = ''
      if (deletedProductId !== '') {
        res = await baseApi.delete(`/products/${deletedProductId}`)
        msg = 'Xóa thành công 1 sản phẩm'
        const deletedProduct = products.find((p) => p._id === deletedProductId)
        if (deletedProduct) {
          msg = `Xóa thành công sản phẩm có mã <${deletedProduct.code}>`
        }
      } else {
        const idList = selectedRows.join(';')
        res = await baseApi.delete(`/products/${idList}`)
        msg = `Xóa thành công ${selectedRows.length} sản phẩm`
      }
      dispatch(
        openToastMsg({
          status: ToastMsgStatus.Success,
          msg,
        })
      )
      setIsLoadingPopupDelete(false)
      setIsActivePopupDelete(false)
      getPagingProducts(generateQuery({ PageIndex: null }))
    } catch (error) {
      setIsLoadingPopupDelete(false)
      setIsActivePopupDelete(false)
      if (error.response.status === 400) {
        dispatch(
          openToastMsg({
            status: ToastMsgStatus.Error,
            msg: 'Không thể xóa sản phẩm trong đơn hàng chưa thanh toán',
          })
        )
        return
      }
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

  return (
    <div className="container mx-auto px-6 mt-6">
      <Head>
        <title>Sản phẩm</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <main className="w-full">
        <div className="flex items-center justify-between">
          <div className="w-96">
            <InputField
              id="search-text"
              name="search-text"
              placeholder="Tìm kiếm theo tên, mã sản phẩm..."
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
                borderRadius: '6px',
                padding: '0 16px',
                fontWeight: '500',
                fontSize: '14px',
              }}
              onClick={() => setIsActivePopupAdd(true)}
            >
              <span className="leading-none pr-2 text-white">
                <i className="fa-solid fa-plus"></i>
              </span>
              <span className="leading-none">Thêm sản phẩm</span>
            </Button>
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
            data={products}
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

      <ProductInfoPopup
        isActive={isActivePopupAdd}
        edittingProductId={edittingProductId}
        onClose={handleClosePopup}
      />

      <PopupMsg
        isActive={isActivePopupDelete}
        isLoading={isLoadingPopupDelete}
        title="Xác nhận"
        textCloseBtn="Hủy"
        textAgreeBtn="Đồng ý"
        msg={
          <div>
            {selectedRows.length > 1 ? (
              <div>
                <span>Bạn có chắc muốn xóa </span>
                <span className="font-medium">{selectedRows.length} </span>
                <span>sản phẩm?</span>
              </div>
            ) : deletedProductId !== '' ? (
              <div>
                <span>Bạn có chắc muốn xóa sản phẩm có mã </span>
                <span className="font-medium">
                  {products.find((p) => p._id === deletedProductId)?.code}
                </span>
              </div>
            ) : null}
          </div>
        }
        onClose={handleClosePopupDelete}
        onAgree={handleDeleteProducts}
      />
    </div>
  )
}

export default ProductsAdmin
