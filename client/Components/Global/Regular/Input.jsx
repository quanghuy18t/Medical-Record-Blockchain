import React from 'react'

export default function Input({ name, type, handleChange, register, value }) {
  return (
    <div className='col-xl-6'>
      <div className='form-group'>
        <label className='col-form-label'>{name}:</label>
        <input 
          className='form-control'
          type={type}
          size={16}
          placeholder={name}
          { ...(register && value ? register(value) : { onChange: handleChange }) }
        />
      </div>
    </div>
  )
}
