import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import InputField from '../../components/InputField/InputField'
import PasswordField from '../../components/PasswordField/PasswordField'
import Button from '../../components/Button/Button'
import Image from 'next/image'
import { validateEmail, validateEmpty, validatePassword } from '../../js/commonFn'
import { useAccount } from '../../hooks/accountHook'
import ImgBackground from '../../assets/images/dang_nhap/background.jpg'
import resource from '../../resource'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setpassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { register, errors: serverErrors } = useAccount()

  useEffect(() => {
    const currentErrors = { ...errors }
    serverErrors.map((err) => {
      currentErrors[err.param] = err.msg
    })

    setErrors(currentErrors)
  }, [serverErrors])

  const handleSubmit = (e) => {
    e.preventDefault()

    const currentError = {
      email: '',
      password: '',
      confirmPassword: '',
    }

    if (!validateEmpty(email)) {
      currentError.email = 'Email không được để trống'
    } else if (!validateEmail(email)) {
      currentError.email = 'Email sai định dạng'
    }

    if (!validateEmpty(password)) {
      currentError.password = 'Mật khẩu không được để trống'
    } else if (!validatePassword(password)) {
      currentError.password = 'Mật khẩu phải có ít nhất 6 ký tự gồm chữ và số'
    }

    if (!validateEmpty(confirmPassword)) {
      currentError.confirmPassword = 'Xác nhận mật khẩu không được để trống'
    } else if (password !== confirmPassword) {
      currentError.confirmPassword = 'Mật khẩu không trùng khớp'
    }

    if (
      currentError.email === '' &&
      currentError.password === '' &&
      currentError.confirmPassword === ''
    ) {
      register(email, password, confirmPassword)
      setErrors(currentError)
      return
    }

    setErrors(currentError)
  }

  return (
    <div className="flex w-full h-screen">
      <Head>
        <title>Đăng ký</title>
        <link rel="icon" href="/icon.ico" />
      </Head>

      <main className="w-[40%] h-full p-12 relative flex items-center">
        <Link href="/home">
          <a className="absolute top-12 left-12 flex items-center">
            <div className="h-[30px] w-[30px] rounded-full bg-primary mr-[10px]" />
            <div className="text-xl font-bold">{resource.ten_trang_web}</div>
          </a>
        </Link>

        <div className="w-full px-[30px]">
          <h1 className="m-0 text-[52px]">
            Tạo tài khoản mới
            <span></span>
          </h1>

          <div className="my-[50px] mx-0 text-xl text-[#8d9aaf] flex items-center">
            Bạn đã có tài khoản?
            <Link href="/sign-in">
              <a className="block ml-2 text-primary font-medium hover:underline">Đăng nhập</a>
            </Link>
          </div>

          <form className="mb-[10%] wfull" autoComplete="off" onSubmit={handleSubmit}>
            <InputField
              isAutoFocus={true}
              name="email"
              id="email"
              label="Email"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path d="M4.25 21.15q-1.425 0-2.412-1-.988-1-.988-2.4V6.25q0-1.4.988-2.4.987-1 2.412-1h15.5q1.425 0 2.413 1 .987 1 .987 2.4v11.5q0 1.4-.987 2.4-.988 1-2.413 1ZM12 14.3l7.75-5V6.25L12 11.3 4.25 6.25V9.3Z" />
                </svg>
              }
              value={email}
              onInput={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <PasswordField
              name="password"
              id="password"
              label="Mật khẩu"
              value={password}
              onInput={(e) => setpassword(e.target.value)}
              error={errors.password}
            />
            <PasswordField
              name="cfPassword"
              id="cfPassword"
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onInput={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />
            <Button
              style={{
                width: '100%',
                marginTop: '50px',
                height: '62px',
                borderRadius: '36px',
              }}
              type="submit"
            >
              Đăng ký
            </Button>
          </form>
        </div>
      </main>

      <div className="w-[60%] h-full relative">
        <Image src={ImgBackground} layout="fill" objectFit="cover" objectPosition="0 center" />
      </div>
    </div>
  )
}

export default Register
