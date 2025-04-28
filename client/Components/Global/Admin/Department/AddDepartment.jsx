import React, { useState } from 'react'
import { useStateContext } from '../../../../Context';
import Input from '../../Regular/Input';

export default function AddDepartment() {
  const { ADD_DEPARTMENT } = useStateContext();

  const [department, setDepartment] = useState({
    name: ''
  });

  return (
    <div
      className='modal fade'
      id='exampleModal'
      tabIndex={-1}
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog modal-lg' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title' id='exampleModalLabel'>
              Add Department
            </h5>
            <button 
              className='btn-close'
              type='button'
              data-bs-dismiss='modal'
              aria-label='Close'
            />
          </div>
          <div className='modal-body'>
            <div>
              <div className='row'>
                <Input 
                  name={'Department Name'}
                  type={'text'}
                  handleChange={(e) => setDepartment({ ...department, name: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-secondary'
              data-bs-dismiss='modal'
            >
              Close
            </button>
            <button
              className='btn btn-primary'
              onClick={() => ADD_DEPARTMENT(department)}
            >
              Add Department
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
