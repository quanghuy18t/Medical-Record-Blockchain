import React, { useEffect, useState } from 'react';
import { IoIosSearch } from '../../../ReactICON/index';

export default function Header({
  name,
  onHandleSearch,
  onClearSearch
}) {
  const [search, setSearch] = useState("");
  const [searchItem, setSearchItem] = useState(search);

  useEffect(() => {
    const time = setTimeout(() => setSearch(searchItem), 1000);
    return () => clearTimeout(time);
  }, [searchItem]);

  useEffect(() => {
    if (search) {
      onHandleSearch(search);
    } else {
      onClearSearch();
    }
  }, [search]);

  return (
    <>
      <div className='page-titles'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <a href='javascript:void(0)'>Dashboard</a>
          </li>
          <li className='breadcrumb-item active'>
            <a href='javascript:void(0)'>{name}</a>
          </li>
        </ol>
      </div>
      <div className='form-head d-flex mb-3 mb-md-4 align-items-start'>
        <div className='me-auto d-none d-lg-block'>
          {name == 'Staff List' ? (
            <a
              className='btn btn-primary btn-rounded add-staff'
              href='javascript:void();'
              data-bs-toggle='modal'
              data-bs-target='#exampleModal'
            >
              + Add Staff
            </a>
          ) : name == 'Patient List' ? (
            <a
              className='btn btn-primary btn-rounded add-staff'
              href='javascript:void();'
              data-bs-toggle='modal'
              data-bs-target='#exampleModal'
            >
              + Add Patient
            </a>
          ) : name == 'Doctor List' ? (
            <a
              className='btn btn-primary btn-rounded add-staff'
              href='javascript:void();'
              data-bs-toggle='modal'
              data-bs-target='#exampleModal'
            >
              + Add Doctor
            </a>
          ) : name == 'Medicine List' ? (
            <a
              className='btn btn-primary btn-rounded add-staff'
              href='javascript:void();'
              data-bs-toggle='modal'
              data-bs-target='#exampleModal'
            >
              + Add Medicine
            </a>
          ) : name == 'Department List' ? (
            <a
              className='btn btn-primary btn-rounded add-staff'
              href='javascript:void();'
              data-bs-toggle='modal'
              data-bs-target='#exampleModal'
            >
              + Add Department
            </a>
          ) : ("")}
        </div>
        <div className='input-group search-area ms-auto d-inline-flex me-3'>
          <input 
            className='form-control'
            type='text'
            placeholder='Search here'
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
          />
          <div className='input-group-append'>
            <button type='button' className='input-group-text'>
              <i>
                <IoIosSearch />
              </i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
