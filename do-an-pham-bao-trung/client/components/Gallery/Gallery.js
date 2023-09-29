import React from 'react'

const Gallery = ({ children }) => {
  return <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">{children}</div>
}

export default Gallery
