import React from 'react'

export default function Header() {
  return (
    <>
      <div className='page-titles'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <a href='javascript:void(0)'>Dashboard</a>
          </li>
          <li className='breadcrumb-item active'>
            <a href='javascript:void(0)'>Profile</a>
          </li>
        </ol>
      </div>
    </>
  )
}
