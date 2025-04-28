import React from 'react'

export default function Card({ children }) {
  return (
    <div 
      style={{
        background: 'white', 
        border: '1px solid #ddd', 
        borderRadius: '12px', 
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)', 
        marginBottom: '1rem'
      }}
    >
      {children}
    </div>
  )
}
