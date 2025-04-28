import React from 'react'

export default function Link({ name, handleClick }) {
  return (
    <li>
      <a onClick={handleClick}>{name}</a>
    </li>
  )
}

