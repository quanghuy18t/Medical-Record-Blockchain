import React from 'react'

export default function CardContent({ children, className = '' }) {
  return (
    <div className={`p-2 ${className}`}>
      {children}
    </div>
  )
}
