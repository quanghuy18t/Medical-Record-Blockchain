import React from 'react'
import dayjs from 'dayjs';
import TableList4 from '../../../SVG/TableList4'
import { useStateContext } from '../../../../Context';

export default function TableList({
  item,
  setOpenComponent,
  setDoctorDetail,
  setPatientDetail
}) {
  console.log(item)
  return (
    <tr key={item.name}>
      <td>
        <div className='checkbox text-end align-self-center'>
          <div className='form-check custom-checkbox'>
            <input 
              type='checkbox'
              className='form-check-input'
              id='customCheckBox2'
              required=''
            />
            <label className='form-check-label' htmlFor='customCheckbox2'/>
          </div>
        </div>
      </td>
      <td className="patient-info ps-0">
        <span className="text-nowrap ms-2">
          {item?.doctor.name}
        </span>
      </td>
      <td className="patient-info ps-0">
        <span className="text-nowrap ms-2">
          {item?.patient.name}
        </span>
      </td>
      <td>{dayjs(item.createAt).format('DD-MM-YYYY')}</td>
      <td>{dayjs(item.day).format('DD-MM-YYYY')}</td>
      <td>{dayjs(item.time).utc().format('HH:mm')}</td>
      {/* <td>
        <a
          onClick={() => (
            setDoctorDetail(item?.doctor), setOpenComponent("DoctorDetails")
          )}
          className="btn btn-primary light btn-rounded mb-2 me-2"
        >
          View Doctor
        </a>
      </td> */}
      <td>
        <div className='d-flex align-items-center'>
          <span
            className={`btn ${
              item.status === 'completed' ? "btn-primary" : item.status === 'cancelled' ? "btn-warning" : "btn-danger"
            } light btn-rounded mb-2 me-2`}
          >
            {item.status}
          </span>
        </div>
      </td>
    </tr>
  );
};
