import React from 'react'
import dayjs from 'dayjs'

export default function TableList({
  item,
  index,
  name,
  setOpenComponent,
  setPatientDetails
}) {
  console.log(item)
  return (
    <tr key={item?.id}>
      <td>
        <div className="checkbox text-end align-self-center">
          <div className="form-check custom-checkbox">
            <input
              type="checkbox"
              className="form-check-input"
              id="customCheckBox1"
              required=""
            />
            <label className="form-check-label" htmlFor="customCheckBox1" />
          </div>
        </div>
      </td>
      <td className="patient-info ps-0">
        <span className="text-nowrap ms-2">
          {item.name}
        </span>
      </td>
      <td className="text-primary">{item.email}</td>
      <td>{item.phone}</td>
      <td>{dayjs(item.createAt).format('DD-MM-YYYY')}</td>
      <td>{dayjs(item.day).format('DD-MM-YYYY')}</td>
      <td>{dayjs(item.time).utc().format('HH:mm')}</td>
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
  )
}
