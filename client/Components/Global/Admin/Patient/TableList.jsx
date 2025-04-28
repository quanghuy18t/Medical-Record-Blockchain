import React from 'react'
import { TableList4 } from '../../../SVG'
import { useStateContext } from '../../../../Context';

export default function TableList({
  patient,
  index,
  setOpenComponent,
  setPatientDetail
}) {
  const { APPROVE_PATIENT } = useStateContext();

  return (
    <tr key={patient?.patientId}>
      <td>
        <div className='d-flex align-items-center'>
          <div className='checkbox text-end align-self-center'>
            <div className='form-check custom-checkbox'>
              <input 
                type='checkbox'
                className='form-check-input'
                id='customCheckBox2'
                required=''
              />
              <label className='form-check-label' htmlFor='customCheckBox2' />
            </div>
          </div>
          <img 
            alt='Avatar'
            src={patient?.image}
            height={43}
            width={43}
            className='rounded-circle ms-4'
          />
        </div>
      </td>
      <td>{patient?.patientID}</td>
      <td>{patient?.name}</td>
      <td>{patient?.email}</td>
      <td>{patient?.phone}</td>
      <td>{patient?.yourAddress}</td>
      {/* <td>{patient?.medicalHistory[0]}</td> */}
      <td>{patient?.gender}</td>
      <td>
        <div className='d-flex align-items-center'>
        <span
            className={`text-danger ${patient?.isApprove ? 'text-primary' : 'text-danger'} font-w600`}
          >
            {patient?.isApprove ? 'Approved' : 'Not Approved'}
          </span>
          <div className='dropdown ms-auto c-pointer text-end'>
            <div className='btn-link' data-bs-toggle='dropdown'>
              <TableList4 />
            </div>
            <div className='dropdown-menu dropdown-menu-right'>
              <a
                className='dropdown-item'
                onClick={() => (
                  setPatientDetail(patient),
                  setOpenComponent('PatientProfile')
                )}
              >
                View Detail
              </a>
              {patient?.isApprove ? (
                <a
                  className='dropdown-item'
                  onClick={() => {}}
                >
                  Deactive Patient
                </a>
              ) : (
                <a
                  className='dropdown-item'
                  onClick={() => APPROVE_PATIENT(patient?.patientID)}
                >
                  Approve Patient
                </a>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};
