import React, { useEffect, useState } from 'react'
import baseApi from '../../api/BaseApi'
import Head from 'next/head'
import Link from 'next/link'
import Slide from '../../components/Slide/Slide'
import Button from '../../components/Button/Button'
import Gallery from '../../components/Gallery/Gallery'
import ProductCard from '../../components/ProductCard/ProductCard'
import Rating from '../../components/Rating/Rating'
import { convertPrice, numberWithCommas } from '../../js/commonFn'
import { useRouter } from 'next/router'
import { useCart } from '../../hooks/cartHook'
import { useAccount } from '../../hooks/accountHook'
import { useDispatch } from 'react-redux'
import { openToastMsg } from '../../slices/toastMsgSlice'
import { ToastMsgStatus } from '../../enums/ToastMsgEnum'

const ProductDetail = () => {
  const [slideHeight, setSlideHeight] = useState(400)
  const [productDetail, setProductDetail] = useState(null)
  const [relatedProducts, setRelatedProduct] = useState([])
  const [gallery, setGallery] = useState([])

  const { accountInfo } = useAccount()
  const { addProduct } = useCart()
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    if (window.innerWidth < 976) {
      setSlideHeight(400)
    } else {
      setSlideHeight(600)
    }

    const getRelatedProducts = async () => {
      try {
        const res = await baseApi.get(`/products/query?pageIndex=1&pageSize=8`)
        if (res.data.success) {
          setRelatedProduct(res.data.data.pageData)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getProductData = async () => {
      const productID = router.query.id
      const res = await baseApi.get(`/products/${productID}`)
      let productDetail = null
      if (res.data.success) {
        productDetail = res.data.data
        const galleryList = [res.data.data.image, ...res.data.data.gallery].map((i) => ({ src: i }))
        setGallery(galleryList)
      }

      setProductDetail(productDetail)
      return productDetail
    }

    if (router.query.id) {
      getProductData().then((productDetail) => {
        getRelatedProducts(productDetail)
      })
    }

    const windowResize = () => {
      if (window.innerWidth < 976) {
        setSlideHeight(400)
      } else {
        setSlideHeight(600)
      }
    }
    window.addEventListener('resize', windowResize)

    return () => {
      window.removeEventListener('resize', windowResize)
    }
  }, [router.query.id])

  const addToCart = () => {
    if (!accountInfo?._id) {
      dispatch(
        openToastMsg({
          msg: 'Bạn cần đăng nhập để có thể mua hàng',
          status: ToastMsgStatus.Info,
        })
      )
      return
    }
    addProduct(productDetail._id)
    dispatch(
      openToastMsg({
        msg: 'Thêm thành công sản phẩm vào giỏ hàng',
        status: ToastMsgStatus.Success,
      })
    )
  }

  return (
    <div>
      <Head>
        <title>{`Sản phẩm ${productDetail?.name}`}</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <main className="container mx-auto px-6 sm:px-0">
        <div className="mt-10 grid-cols-3 gap-x-10 lg:grid">
          <div className="relative w-full shadow-md rounded-lg col-start-1 col-end-3">
            <Slide items={gallery} height={slideHeight} objectFit="contain" />
          </div>
          <div className="mt-8 lg:mt-0 col-start-3 col-end-4 lg:flex lg:flex-col lg:justify-start">
            <h1 className="text-4xl font-bold mb-6">{productDetail?.name}</h1>
            <div className="mb-3">
              <h2 className="text-xl font-bold mb-1">
                Giá từ: {convertPrice(productDetail?.price)}
              </h2>
              <div className="font-normal italic">
                *Thông tin mức giá chỉ mang tính chất tham khảo
              </div>
            </div>
            <div className="flex-grow">
              <div className="text-xl font-bold mb-1">
                {productDetail?.desc && <span>Mô tả:</span>}
              </div>
              {productDetail?.desc && <div className="font-normal mb-1">{productDetail?.desc}</div>}
            </div>
            <Button
              className="group justify-self-end"
              style={{
                borderRadius: '8px',
                width: '100%',
              }}
              onClick={addToCart}
            >
              <div className="flex items-center gap-x-2">
                <span>Thêm vào giỏ hàng</span>
                <div className="flex items-center transition-[transform] duration-300 ease-in-out group-hover:scale-125">
                  <i className="fa-solid fa-cart-arrow-down"></i>
                </div>
              </div>
            </Button>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t-4 border-black border-solid">
          <h2 className="text-2xl font-bold mb-6">Đánh giá</h2>
          <Rating product={productDetail} />
        </div>

        <div className="mt-10 pt-8 border-t-4 border-black border-solid">
          <h2 className="text-2xl font-bold mb-6 flex items-end justify-between">
            <span>Sản phẩm tương tự</span>
            <div className="relative group flex items-center ml-3 text-sm text-primary">
              <div className="text-sm pl-1 flex items-center -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200">
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </h2>
          <Gallery>
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} {...product} />
            ))}
          </Gallery>
        </div>
      </main>
    </div>
  )
}

export default ProductDetail
