import React from 'react'
import Popup from './Popup'
import Button from '../Button/Button'
import { ButtonType } from '../../enums/ButtomEnum'

const PopupMsg = ({
  isActive = false,
  isLoading = false,
  isActiveLoadingScreen = true,
  title = '',
  msg = '',
  textCloseBtn = '',
  textAgreeBtn = '',
  onClose = () => {},
  onAgree = () => {},
}) => {
  return (
    <Popup
      isActive={isActive}
      isLoading={isLoading}
      isActiveLoadingScreen={isActiveLoadingScreen}
      title={title}
      onClose={onClose}
      footer={
        <div className="pb-4 pt-6 flex items-center justify-end gap-x-2 px-6">
          {textCloseBtn !== '' && (
            <Button
              style={{
                height: 44,
                borderRadius: 6,
              }}
              disabled={isLoading}
              buttonType={ButtonType.Secondary}
              onClick={onClose}
            >
              {textCloseBtn}
            </Button>
          )}
          {textAgreeBtn !== '' && (
            <Button
              type="submit"
              style={{
                height: 44,
                borderRadius: 6,
              }}
              isLoading={isLoading && !isActiveLoadingScreen}
              onClick={onAgree}
            >
              {textAgreeBtn}
            </Button>
          )}
        </div>
      }
    >
      <div className="w-[450px]">{msg}</div>
    </Popup>
  )
}

export default PopupMsg
