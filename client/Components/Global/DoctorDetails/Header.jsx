import React from 'react'

export default function Header({ setOpenComponent }) {
  return (
    <>
      <div className='page-titles'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <a href='javascript:void(0)'>Dashboard</a>
          </li>
        </ol>
      </div>
      <div className='d-block d-sm-flex mb-3 mb-md-4'>
        <a
          className='btn btn-outline-primary btn-rounded mb-2'
          onClick={() => setOpenComponent('Appointment')}
        >
          <i className='lar me-2 scale5 me-2' />
          Book Appointment
        </a>
      </div>
    </>
  )
}
