import React from 'react'

export default function Avator({
  user,
  address,
  connectWallet,
  checkRegistration
}) {
  return (
    <>
      {address && checkRegistration == 'User is not registered' ? (
        <a onClick={() => {}} className='nav-link'>
          <img src={'logo.png'} width={20} alt='Avatar' />
          <div className='header-info'>
            <span>Register</span>
          </div>
        </a>
      ) : address && checkRegistration != 'User is not registered' ? (
        <>
          <a className='nav-link'>
            <img src={user?.image} width={20} alt='Avatar' />
            <div className='header-info'>
              <span>
                Hello, <strong>{user?.firstName}</strong>
              </span>
            </div>
          </a>
        </>
      ) : (
        <a onClick={() => connectWallet()} className='nav-link'>
          <img src={'logo.png'} width={20} alt='Avatar' />
          <div className='header-info'>
            <span>Connect Wallet</span>
          </div>
        </a>
      )}
    </>
  );
};
