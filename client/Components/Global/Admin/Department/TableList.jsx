import React from 'react'

export default function TableList({ item, setOpenComponent }) {
  console.log(item);

  return (
    <tr key={item?.id}>
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
        </div>
      </td>
      <td>{item.name}</td>
      <td>{item.doctors.length}</td>
      <td>{item.rooms.length}</td>
    </tr>
  );
}
