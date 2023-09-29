import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase/index'
import { v4 as uuidv4 } from 'uuid'

const ImageUploader = ({
  name = '',
  id = '',
  text = 'Tải lên hình ảnh',
  value = '',
  onChange = () => {},
  width = null,
  height = null,
  label = '',
  required = false,
  isMultiple = false,
  isAvatar = false,
  error = '',
}) => {
  const [imageUrl, setImageUrl] = useState('')
  const [imageUrlList, setImageUrlList] = useState([])
  const imageInputRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isMultiple) {
      setImageUrl(value)
    } else {
      setImageUrlList(value)
    }
  }, [value])

  const handleChangeImageInput = async () => {
    setIsLoading(true)
    const selectedFile = imageInputRef.current.files[0]

    const metadata = {
      contentType: selectedFile.type,
    }

    const filenameArr = selectedFile.name.split('.')
    const fileNameArrLength = filenameArr.length
    const fileExtension = filenameArr[fileNameArrLength - 1]

    try {
      const imageRef = ref(storage, `images/${uuidv4()}.${fileExtension}`)
      const snapshot = await uploadBytes(imageRef, selectedFile, metadata)
      const downloadUrl = await getDownloadURL(snapshot.ref)

      setImageUrl(downloadUrl)
      if (typeof onChange === 'function') {
        onChange(downloadUrl)
      }
      setIsLoading(false)
      imageInputRef.current.value = ''
    } catch (error) {
      console.log(error)
      setIsLoading(false)
      imageInputRef.current.value = ''
    }
  }

  const handleChangeImageInputMultiple = async () => {
    const fileList = imageInputRef.current.files
    const fileListLength = fileList.length

    const oldFileListLength = imageUrlList.length

    setImageUrlList((prev) => {
      const newFileList = [...prev]
      for (let index = 0; index < fileListLength; index++) {
        newFileList.push(false)
      }
      return newFileList
    })

    const listFunc = []
    for (let index = 0; index < fileListLength; index++) {
      const file = fileList[index]
      listFunc.push(uploadImg(file, index + oldFileListLength))
    }

    const result = await Promise.all(listFunc)

    onChange([...imageUrlList, ...result])

    imageInputRef.current.value = ''
  }

  const uploadImg = async (file, fileIdx) => {
    const metadata = {
      contentType: file.type,
    }

    const filenameArr = file.name.split('.')
    const fileNameArrLength = filenameArr.length
    const fileExtension = filenameArr[fileNameArrLength - 1]

    try {
      const imageRef = ref(storage, `images/${uuidv4()}.${fileExtension}`)
      const snapshot = await uploadBytes(imageRef, file, metadata)
      const downloadUrl = await getDownloadURL(snapshot.ref)

      setImageUrlList((prev) => {
        const newFileList = [...prev]
        newFileList[fileIdx] = downloadUrl
        return newFileList
      })

      return downloadUrl
    } catch (error) {
      console.log(error)
      return false
    }
  }

  const removeImg = () => {
    onChange('')
    setImageUrl('')
  }

  const removeImgMultiple = (idx) => {
    const newFileList = [...imageUrlList]
    newFileList.splice(idx, 1)
    onChange(newFileList)
  }

  if (isAvatar) {
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute flex items-center justify-center z-10 top-0 left-0 w-full h-full backdrop-blur-sm rounded-full">
            <div className="h-24 w-24 border-4 border-y-transparent border-x-primary rounded-full animate-spin" />
          </div>
        )}
        <input
          ref={imageInputRef}
          className="hidden"
          type="file"
          name={name}
          id={id}
          onChange={handleChangeImageInput}
          multiple={false}
        />
        {imageUrl ? (
          <>
            <div
              style={{
                width,
                height,
              }}
              className="relative w-36 h-36 rounded-full border-2 border-black overflow-hidden shadow-xl"
            >
              <Image
                className="w-full h-full"
                src={imageUrl}
                objectFit="contain"
                objectPosition="center"
                width={width || 144}
                height={height | 144}
              />
            </div>
            <label
              htmlFor={id}
              className="absolute right-1 bottom-4 text-white z-10 w-6 h-6 bg-black flex items-center justify-center text-xs rounded-full hover:bg-primary transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-pencil"></i>
            </label>
          </>
        ) : (
          <label
            className="h-full w-full space-y-6 flex flex-col items-center justify-center"
            htmlFor={id}
          >
            <div className="text-blue-500 text-4xl">
              <i className="fa-solid fa-image"></i>
            </div>
          </label>
        )}
      </div>
    )
  }

  if (isMultiple) {
    return (
      <div className="relative w-full">
        {label && (
          <label className="block w-max text-sm pb-1" htmlFor={id}>
            <span className="mr-1">{label}</span>
            {required && <span className="text-red-600">*</span>}
          </label>
        )}
        <input
          ref={imageInputRef}
          className="hidden"
          type="file"
          name={name}
          id={id}
          multiple={true}
          onChange={handleChangeImageInputMultiple}
        />
        <div className="flex items-center border border-gray-300 rounded-md w-full py-2 overflow-x-auto">
          <div className="sticky left-0 z-20 shrink-0 bg-white px-1 before:absolute before:left-0 before:bottom-full before:w-full before:h-1 before:bg-white before:z-20">
            <label
              htmlFor={id}
              className="flex flex-col items-center justify-center w-28 h-20 bg-gray-400 text-white rounded-md hover:bg-primary cursor-pointer transition-colors duration-200"
            >
              <div className="text-lg">
                <i className="fa-solid fa-plus"></i>
              </div>
              <div className="text-sm">Tải lên</div>
            </label>
          </div>
          <ul className="flex items-center ml-1 pr-1 gap-x-1">
            {imageUrlList.map((url, idx) => {
              if (!url) {
                return (
                  <li
                    key={idx}
                    className="relative w-28 h-20 flex items-center justify-center rounded-md bg-gray-300"
                  >
                    <div className="h-10 w-10 border-4 border-y-transparent border-x-primary rounded-full animate-spin" />
                  </li>
                )
              }
              return (
                <li
                  key={idx}
                  className="relative shrink-0 w-28 h-20 border border-gray-300 rounded-md"
                >
                  <div className="rounded-md overflow-hidden">
                    <Image
                      src={url}
                      width={112}
                      height={80}
                      objectFit="contain"
                      objectPosition="center"
                    />
                  </div>
                  <div
                    className="absolute -top-1 -right-1 z-10 text-black hover:text-primary/80 cursor-pointer transition-colors flex items-center justify-center"
                    onClick={() => removeImgMultiple(idx)}
                  >
                    <i className="fa-solid fa-circle-xmark"></i>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {label && (
        <label className="block w-max text-sm pb-1" htmlFor={id}>
          <span className="mr-1">{label}</span>
          {required && <span className="text-red-600">*</span>}
        </label>
      )}
      {imageUrl && (
        <div
          className="absolute top-4 -right-2 z-10 text-black hover:text-primary/80 cursor-pointer transition-colors flex items-center justify-center"
          onClick={removeImg}
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </div>
      )}
      <div
        style={{
          width,
          height,
        }}
        className="bg-white border-dashed border-gray-300 border rounded-lg w-[300px] h-[300px] overflow-hidden relative"
      >
        {isLoading && (
          <div className="absolute flex items-center justify-center z-10 top-0 left-0 w-full h-full backdrop-blur-sm">
            <div className="h-24 w-24 border-4 border-y-transparent border-x-primary rounded-full animate-spin" />
          </div>
        )}
        <input
          ref={imageInputRef}
          className="hidden"
          type="file"
          name={name}
          id={id}
          onChange={handleChangeImageInput}
          multiple={false}
        />
        {imageUrl ? (
          <Image
            className="w-full h-full"
            src={imageUrl}
            objectFit="contain"
            objectPosition="center"
            layout="fill"
          />
        ) : (
          <label
            className="h-full w-full space-y-6 flex flex-col items-center justify-center"
            htmlFor={id}
          >
            <div className="text-blue-500 text-4xl">
              <i className="fa-solid fa-image"></i>
            </div>
            <div className="text-gray-500">{text}</div>
            <div className="flex items-center px-4 py-2 gap-x-2 border border-gray-300 rounded-lg cursor-pointer text-blue-700 font-medium hover:shadow hover:shadow-gray-300 transition-shadow">
              <div className="fill-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
                  <path d="M10.8 20.85H6.575q-2.625 0-4.488-1.8-1.862-1.8-1.862-4.4 0-2.2 1.213-3.962Q2.65 8.925 4.725 8.45 5.5 6.05 7.5 4.6q2-1.45 4.5-1.45 3.05 0 5.25 2.062 2.2 2.063 2.475 5.088 1.8.475 2.925 1.937 1.125 1.463 1.125 3.338 0 2.2-1.537 3.737Q20.7 20.85 18.5 20.85h-5.3v-6.775l1.775 1.775 1.675-1.65L12 9.525 7.35 14.2l1.675 1.65 1.775-1.775Z" />
                </svg>
              </div>
              Tải lên
            </div>
          </label>
        )}
      </div>
      {error && (
        <label className="group absolute top-0 right-3 text-red-600 flex items-center" htmlFor={id}>
          <i className="fa-solid fa-circle-exclamation"></i>
          <div className="opacity-0 invisible transition-all group-hover:opacity-100 group-hover:visible absolute top-1/2 right-[calc(100%_+_4px)] -translate-y-1/2 w-max text-sm text-white bg-red-600 px-2 py-[2px] rounded-md before:absolute before:top-1/2 before:left-full before:-translate-y-1/2 before:border-t-4 before:border-b-4 before:border-t-transparent before:border-b-transparent before:border-r-4 before:border-r-red-600 before:rotate-180">
            {error}
          </div>
        </label>
      )}
    </div>
  )
}

export default ImageUploader
