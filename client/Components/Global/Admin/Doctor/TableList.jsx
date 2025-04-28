import React from 'react'
import TableList4 from '../../../SVG/TableList4'
import { useStateContext } from '../../../../Context';

export default function TableList({
  item,
  setOpenComponent,
  setDoctorDetail
}) {
  const { APPROVE_DOCTOR, ADD_DOCTOR_DEPARTMENT } = useStateContext();

  const handleApprove = async () => {
    try {
      await ADD_DOCTOR_DEPARTMENT(item.specialization, item.doctorID);

      await APPROVE_DOCTOR(item.doctorID);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <tr key={item?.doctorID}>
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
              <label 
                className='form-check-label'
                htmlFor='customCheckbox2'
              />
            </div>
          </div>
          <img 
            className='rounded-circle ms-4'
            src={item?.image}
            alt='Avatar'
            height={43}
            width={43}
          />
        </div>
      </td>
      <td>{item?.doctorID}</td>
      <td>{item?.name}</td>
      <td>{item?.specialization}</td>
      <td>{item?.email}</td>
      <td>
        <span className='font-w500'>{item?.phone}</span>
      </td>
      <td>
        <a
          className={`btn light btn-rounded btn-sm ${
            item?.appointmentCount >= 1 ? 'btn-primary text-nowrap' : 'btn-secondary'
          }`}
        >
          {item?.appointmentCount >= 1 ? `${item?.appointmentCount} Appointments` : '0 Appointment'}
        </a>
      </td>
      <td>
        <div className='d-flex align-items-center'>
          <span
            className={`text-danger ${item?.isApprove ? 'text-primary' : 'text-danger'} font-w600`}
          >
            {item?.isApprove ? 'Approved' : 'Not Approved'}
          </span>
          <div className='dropdown ms-auto c-pointer text-end'>
            <div className='btn-link' data-bs-toggle='dropdown'>
              <TableList4 />
            </div>
            <div className='dropdown-menu dropdown-menu-right'>
              <a
                className='dropdown-item'
                href='javascript:void(0);'
                onClick={() => (
                  setDoctorDetail(item),
                  setOpenComponent('DoctorDetail')
                )}
              >
                View Detail
              </a>
              {item?.isApprove ? (
                <a
                  className='dropdown-item'
                  onClick={() => {}}
                >
                  Deactive Doctor
                </a>
              ) : (
                <a
                  className='dropdown-item'
                  onClick={() => handleApprove()}
                >
                  Approve Doctor
                </a>
              )}
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
};
