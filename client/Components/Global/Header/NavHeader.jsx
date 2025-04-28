import React from 'react'
import { Nav1, Nav2 } from '../../SVG'

export default function NavHeader() {
  return (
    <div className='nav-header'>
      <a href='/' className='brand-logo'>
        <Nav1 />
        <Nav2 />
      </a>
      <div className='nav-control'>
        <div className='hamburger'>
          <span className='line' />
          <span className='line' />
          <span className='line' />
        </div>
      </div>
    </div>
  )
}

