import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../Navbar/Navbar'
import { useAccount } from '../../hooks/accountHook'
import Link from 'next/link'
import resource from '../../resource'

const Footer = () => {
  const [isVisible, setIsVisible] = useState(true)
  const { accountInfo } = useAccount()

  const router = useRouter()

  useEffect(() => {
    if (router.pathname === '/sign-in' || router.pathname === '/register') {
      setIsVisible(false)
    } else if (router.pathname.includes('admin') && accountInfo?.isAdmin) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
  }, [router.pathname, accountInfo])

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-black px-10 mt-10">
      <div className="lg:grid grid-cols-4 gap-x-8">
        <div className="pt-10">
          <h3 className="text-xl font-medium text-white pb-5 mb-5 border-b border-dotted border-white">
            Về chúng tôi
          </h3>
          <div className="text-gray-400 text-justify mb-5 text-sm">
            {resource.footer.ve_chung_toi}
          </div>
          <ul className="flex text-gray-400 text-lg gap-x-3">
            <li className="cursor-pointer hover:text-primary transition-colors duration-300">
              <i className="fa-brands fa-facebook"></i>
            </li>
            <li className="cursor-pointer hover:text-primary transition-colors duration-300">
              <i className="fa-brands fa-twitter"></i>
            </li>
            <li className="cursor-pointer hover:text-primary transition-colors duration-300">
              <i className="fa-brands fa-google"></i>
            </li>
            <li className="cursor-pointer hover:text-primary transition-colors duration-300">
              <i className="fa-brands fa-linkedin"></i>
            </li>
          </ul>
        </div>

        <div className="pt-10">
          <h3 className="text-xl font-medium text-white pb-5 mb-5 border-b border-dotted border-white">
            Liên hệ với chúng tôi
          </h3>
          <div className="text-gray-400 text-justify mb-5 text-sm">
            {resource.footer.lien_he_voi_chung_toi}
          </div>
          <div>
            <h4 className="text-lg font-medium text-primary mb-2">Địa chỉ:</h4>
            <div className="text-gray-400 text-justify mb-5 text-sm">{resource.footer.dia_chi}</div>
          </div>
          <div>
            <h4 className="text-lg font-medium text-primary mb-2">Thông tin liên lạc:</h4>
            <div className="text-gray-400 text-justify mb-2 text-sm">
              Điện thoại: {resource.footer.dien_thoai}
            </div>
            <div className="text-gray-400 text-justify text-sm">
              Email:{' '}
              <span className="cursor-pointer text-gray-100 hover:text-primary transition-colors">
                {resource.footer.email}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-10">
          <h3 className="text-xl font-medium text-white pb-5 mb-5 border-b border-dotted border-white">
            Liên kết nhanh
          </h3>
          <ul className="text-sm text-gray-400">
            {NAV_LINKS.map((link, idx) => (
              <li className="mb-5 last:mb-0" key={idx}>
                <Link href={link.url}>
                  <a className="hover:text-primary transition-colors">{link.name}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-10">
          <h3 className="text-xl font-medium text-white pb-5 mb-5 border-b border-dotted border-white">
            Đăng ký để bắt đầu mua hàng
          </h3>
          <div className="text-gray-400 text-justify mb-5 text-sm">
            {resource.footer.dang_ky_de_bat_dau_mua_hang}
          </div>
          <div className="relative">
            <input
              className="bg-transparent text-sm text-white placeholder:text-gray-400 py-2 pl-4 pr-12 outline-none border border-gray-400 w-full"
              type="email"
              formNoValidate
              placeholder="Nhập địa chỉ email của bạn..."
            />
            <div className="text-primary text-lg absolute top-1/2 right-4 -translate-y-1/2">
              <i className="fa-regular fa-envelope"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-400 py-10 mt-5 border-t border-gray-400 border-solid text-center">
        {resource.footer.chu_duoi_cung}
      </div>
    </div>
  )
}

export default Footer
