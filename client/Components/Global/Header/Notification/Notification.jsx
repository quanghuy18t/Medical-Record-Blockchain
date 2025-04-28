import React from 'react';
import ListCard from './ListCard';
import { FaArrowRightLong } from '../../../ReactICON/index';

export default function Notification({ notification, setOpenComponent }) {
  return (
    <div className='dropdown-menu dropdown-menu-end'>
      <div id='DZ_W_Notification1' className='widget-media dz-scroll p-3 height380'>
        <ul className='timeline'>
          {notification?.map((item) => <ListCard item={item} />)}
        </ul>
      </div>
      <a 
        className='all-notification'
        onClick={() => setOpenComponent('Notification')}
      >
        See all notification <FaArrowRightLong />
      </a>
    </div>
  );
};
