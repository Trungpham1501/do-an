import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import InputField from '../../components/InputField/InputField'
import PasswordField from '../../components/PasswordField/PasswordField'
import Button from '../../components/Button/Button'
import Image from 'next/image'
import { useAccount } from '../../hooks/accountHook'
import { validateEmail, validateEmpty } from '../../js/commonFn'

import ImgBackground from '../../assets/images/dang_nhap/background.jpg'
import resource from '../../resource'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isTheFirstValidation, setIsTheFirstValidation] = useState(true)
  const { signIn, errors: serverErrors } = useAccount()

  useEffect(() => {
    if (!isTheFirstValidation) {
      if (!validateEmpty(email)) {
        setEmailError('Bắt buộc nhập email')
      } else if (!validateEmail(email)) {
        setEmailError('Email không đúng định dạng')
      } else {
        setEmailError('')
      }
    }
  }, [email])

  useEffect(() => {
    if (!isTheFirstValidation) {
      if (validateEmpty(password)) {
        setPasswordError('')
      } else {
        setPasswordError('Bắt buộc nhập mật khẩu')
      }
    }
  }, [password])

  useEffect(() => {
    const currentErrors = {}
    serverErrors.map((err) => {
      currentErrors.email = err.msg
      currentErrors.password = err.msg
    })

    setEmailError(currentErrors.email)
    setPasswordError(currentErrors.password)
  }, [serverErrors])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsTheFirstValidation(false)
    let isValid = true
    if (!validateEmpty(email)) {
      setEmailError('Bắt buộc nhập email')
      isValid = false
    }
    if (!validateEmpty(password)) {
      setPasswordError('Bắt buộc nhập mật khẩu')
      isValid = false
    }
    if (!isValid) {
      return
    }
    if (!validateEmail(email)) {
      setEmailError('Email không đúng định dạng')
      return
    }

    signIn(email, password)
  }

  return (
    <div className="flex w-full h-screen">
      <Head>
        <title>Đăng Nhập</title>
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
            Đăng nhập hệ thống
            <span></span>
          </h1>

          <div className="my-[50px] mx-0 text-xl text-[#8d9aaf] flex items-center">
            Bạn chưa có tài khoản?
            <Link href="/register">
              <a className="block ml-2 text-primary font-medium hover:underline">Đăng ký</a>
            </Link>
          </div>

          <form className="mb-[10%] wfull" autoComplete="off" noValidate onSubmit={handleSubmit}>
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
              error={emailError}
            />
            <PasswordField
              name="password"
              id="password"
              label="Mật khẩu"
              value={password}
              onInput={(e) => setPassword(e.target.value)}
              error={passwordError}
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
              Đăng nhập
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

export default SignIn
