import React from 'react';
import { FaUserAlt, FaUserDoctor, GiMedicines, MdAdminPanelSettings } from '../../../ReactICON/index';

export default function ListCard({ item }) {
  return (
    <li key={item?.notificationId}>
      <div className='timeline-panel'>
        <div
          className={`media me-2 ${
            item?.categoryType == 'Doctor'
              ? 'media-info'
              : item?.categoryType == 'Medicine'
              ? 'media-success'
              : item?.categoryType == 'Patient'
              ? 'media-danger'
              : 'text-info'
          }`}
        >
          <small style={{fontSize:'1.5rem'}}>
            {item?.categoryType == 'Admin' ? (
              <MdAdminPanelSettings />
            ) : item?.categoryType == 'Medicine' ? (
              <GiMedicines />
            ) : item?.categoryType == 'Doctor' ? (
              <FaUserDoctor />
            ) : (
              <FaUserAlt />
            )}
          </small>
        </div>
        <div className='media-body'>
          <h6 className='mb-1'>
            {item?.message.slice(0, 50)}
            ..
          </h6>
          <small className='d-block'>
            {`${item?.date}`}{" "}
          </small>
        </div>
      </div>
    </li>
  );
};
