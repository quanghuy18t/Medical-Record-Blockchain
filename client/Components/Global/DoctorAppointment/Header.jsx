import React, { useEffect, useState } from 'react'
import { IoIosSearch } from '../../ReactICON/index'

export default function Header() {
  return (
    <>
      <div className="page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="javascript:void(0)">Dashboard</a>
          </li>
          <li className="breadcrumb-item active">
            <a href="javascript:void(0)">Appointment</a>
          </li>
        </ol>
      </div>
      <div className="form-head d-flex mb-3 mb-md-4 align-items-center">
        <div className="input-group search-area d-inline-flex me-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search here"
          />
          <div className="input-group-append">
            <button type="button" className="input-group-text">
              <i>
                <IoIosSearch />
              </i>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
