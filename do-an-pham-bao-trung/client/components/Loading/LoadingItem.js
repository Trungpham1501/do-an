import React from 'react'
import styles from './LoadingItem.module.scss'

const LoadingItem = ({ style, className }) => {
  return <div style={style} className={`${styles.skeleton} ${className}`} />
}

export default LoadingItem
