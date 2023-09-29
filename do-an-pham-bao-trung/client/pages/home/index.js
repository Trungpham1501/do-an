import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Slide from '../../components/Slide/Slide'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductCardLoading from '../../components/ProductCard/ProductCardLoading'
import Link from 'next/link'
import Gallery from '../../components/Gallery/Gallery'
import Button from '../../components/Button/Button'
import Image from 'next/image'
import baseApi from '../../api/BaseApi'

import Img1 from '../../assets/images/trang_chu/slide/img-5.jpg'
import Img2 from '../../assets/images/trang_chu/slide/img-1.jpg'
import Img3 from '../../assets/images/trang_chu/slide/img-2.jpg'
import Img4 from '../../assets/images/trang_chu/slide/img-3.jpg'
import Img5 from '../../assets/images/trang_chu/slide/img-4.jpg'
import EditorPick1 from '../../assets/images/trang_chu/lua_chon_chuyen_gia/editor-pick-1.jpg'
import EditorPick2 from '../../assets/images/trang_chu/lua_chon_chuyen_gia/editor-pick-2.jpg'
import { useRouter } from 'next/router'

const EDITOR_PICK = [EditorPick1, EditorPick2]

const WHY_CHOOSE = [
  {
    title: 'Chính sách bảo hành đảm bảo',
    content:
      'Chính sách bảo hành lên tới một năm đối với các lỗi do sản phẩm gây ra, bảo hành 1 đổi 1 trong vòng 1 tháng.',
    icon: <i className="far fa-hand-paper"></i>,
  },
  {
    title: 'Thủ tục mua hàng nhanh chóng',
    content:
      'Mua hàng nhanh chóng, tiện lợi thông qua ứng dụng web, xác nhận đơn hàng chỉ 10 phút sau khi đặt hàng.',
    icon: <i className="fas fa-rocket"></i>,
  },
  {
    title: 'Miễn phí sửa chữa',
    content:
      'Chúng tôi thực hiện chính sách sửa chữa sản phẩm trong vòng 6 tháng sau khi mua sản phẩm.',
    icon: <i className="fas fa-tools"></i>,
  },
]

const WHY_CHOOSE_2 = [
  {
    title: 'Sự kiện mua hàng',
    content: 'Tham gia quay số trúng thưởng đối với khách hàng thân thiết.',
    icon: <i className="fas fa-gift"></i>,
  },
  {
    title: 'Bảo hành sản phẩm',
    content: 'Chính sách bảo hành thân thiện, đảm bảo đối với khách hàng.',
    icon: <i className="fas fa-shield-alt"></i>,
  },
  {
    title: 'Thanh toán ngay khi nhận hàng',
    content: 'Thanh toán ngay khi nhận sản phẩm và xác nhận giấy tờ.',
    icon: <i className="fas fa-dollar-sign"></i>,
  },
  {
    title: 'Phục vụ mọi nơi',
    content: 'Phục vụ tận tình.',
    icon: <i className="fa-solid fa-map"></i>,
  },
]

const HomePage = () => {
  const items = [
    {
      src: Img1,
    },
    {
      src: Img2,
    },
    {
      src: Img3,
    },
    {
      src: Img4,
    },
    {
      src: Img5,
    },
  ]

  const [windowWidth, setWindowWidth] = useState(0)
  const [newestproducts, setNewestProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setWindowWidth(window.innerWidth)

    const setWindowWidthFunc = () => {
      setWindowWidth(window.innerWidth)
    }

    const fetchData = async () => {
      setIsLoading(true)
      const res = await baseApi.get('/products/query?sort=createdAt|-1')
      let newestProducts = res.data.data.pageData
      setNewestProducts(newestProducts)
      setIsLoading(false)
    }

    window.addEventListener('resize', setWindowWidthFunc)
    fetchData()

    return () => {
      window.removeEventListener('resize', setWindowWidthFunc)
    }
  }, [])

  const handleLoadMore = () => {
    router.replace('/products')
  }

  return (
    <div>
      <Head>
        <title>Trang chủ</title>
        <link rel="icon" href="/icon.ico" />
      </Head>
      <main className="w-full">
        <div className="w-full">
          <Slide items={items} delay={3000} height={windowWidth <= 768 ? 300 : 500} />
        </div>
        <div className="container mx-auto">
          <h3 className="text-xl font-bold mb-4 flex items-end justify-between mt-10">
            Sản phẩm mới nhất dành cho bạn
          </h3>
          {isLoading ? (
            <Gallery>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((productIdx) => (
                <ProductCardLoading key={productIdx} />
              ))}
            </Gallery>
          ) : (
            <>
              <Gallery>
                {newestproducts.map((product, productIdx) => (
                  <ProductCard key={productIdx} {...product} />
                ))}
              </Gallery>
              <div>
                <Button
                  className="mx-auto mt-10"
                  style={{
                    height: 44,
                    borderRadius: 6,
                  }}
                  onClick={handleLoadMore}
                >
                  Tải thêm
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="container mx-auto grid grid-cols-2 gap-x-6 mt-10">
          {EDITOR_PICK.map((image, idx) => {
            return (
              <div key={idx} className="group relative h-[400px] w-full overflow-hidden">
                <div className="absolute z-[1] top-0 left-0 w-full h-full bg-black/30"></div>
                <div className="absolute z-[3] top-0 left-0 w-full h-full">
                  <div className="text-2xl font-medium absolute top-6 left-6">
                    <span className="text-white group-hover:text-black transition-colors duration-300">
                      LỰA CHỌN CỦA
                    </span>{' '}
                    <span className="text-primary">CHUYÊN GIA</span>
                  </div>
                </div>
                <div className="absolute text-xl z-[2] -bottom-12 -right-9 shadow-[0_0_10px_1000px_rgba(255,255,255,0.3)] scale-0 origin-center w-48 h-48 bg-transparent rounded-full border-2 border-white flex items-center justify-center opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300">
                  <div>
                    <div className="text-white">LỰA CHỌN</div>
                    <div className="text-white">CỦA BẠN</div>
                  </div>
                </div>
                <div
                  key={idx}
                  className="relative h-[120%] w-[120%] group-hover:scale-125 transition-transform duration-300"
                >
                  <Image src={image} layout="fill" objectFit="corver" objectPosition="center" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="container mx-auto grid grid-cols-3 gap-6 text-center mt-10">
          {WHY_CHOOSE.map((item, idx) => (
            <div key={idx}>
              <span className="text-4xl text-[#444]">{item.icon}</span>
              <h3 className="text-2xl font-medium text-[#444] h-[50px] mb-0 mt-[30px]">
                {item.title}
              </h3>
              <p className="max-w-[300px] mx-auto mt-5 mb-[30px] text-base">{item.content}</p>
              <Link href="/products">
                <a className="flex items-center w-max mx-auto px-4 rounded-md h-10 border-2 border-primary bg-transparent text-base uppercase">
                  Mua sắm ngay
                </a>
              </Link>
            </div>
          ))}
        </div>

        <div className="container mx-auto grid bg-[#f7f7f7] grid-cols-4 p-[50px] gap-6 text-center mt-10">
          {WHY_CHOOSE_2.map((item, idx) => (
            <div key={idx} className="grid grid-cols-[70px_1fr] gap-x-5 w-full">
              <div className="text-2xl leading-none flex p-4 h-[70px] w-[70px] justify-center items-center border-2 border-[#777] rounded-full mr-[10px]">
                {item.icon}
              </div>
              <div className="text-center">
                <h3 className="mt-0 text-base text-primary font-medium leading-none mb-2 text-left">
                  {item.title}
                </h3>
                <p className="mt-0 text-sm text-[#777] mb-0 text-justify">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default HomePage
