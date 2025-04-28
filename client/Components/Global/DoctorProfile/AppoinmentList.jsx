import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context'
import { DoctorDetails1, DoctorDetails2, DoctorDetails3 } from '../../SVG/index';
import { FaHospital, FaNotesMedical, GiMedicines } from '../../ReactICON/index';
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import UpdateStep from './UpdateStep';

dayjs.extend(utc)

export default function AppoinmentList({
  item,
  index,
}) {
  const { GET_PATIENT_DETAIL } = useStateContext();
  const [patient, setPatient] = useState();

  useEffect(() => {
    const fetchData = async () => {
      GET_PATIENT_DETAIL(item.patientID).then((patient) => {
        setPatient(patient);
      });
    };

    fetchData();
  }, [item]);

  return (
    <li key={index}>
      <div className="timeline-panel bgl-dark flex-wrap border-0 p-3 rounded">
        <div className="media bg-transparent me-2">
          <img
            className="rounded-circle"
            alt="image"
            width={48}
            height={48}
            src={patient?.image}
          />
        </div>
        <div className="media-body">
          <h5 className="mb-1 fs-18">
            {patient?.name}
          </h5>
          <span>Phone: {patient?.phone}</span>
        </div>
        <ul className="mt-3 d-flex flex-wrap text-primary font-w600">
          <li className="me-2 fs-14">Day: {dayjs(item.day).format('DD-MM-YYYY')}   </li>
          <li className="me-2 fs-14">Time: {dayjs(item.time).utc().format('HH:mm')}</li>
        </ul>
        <div className="mt-3 d-flex flex-wrap text-primary font-w600">
          <a
            className='btn btn-primary light btn-rounded mb-2 me-2'
            href='javascript:void();'
            data-bs-toggle='modal'
            data-bs-target='#exampleModal'
          >
            Open Appointment
          </a>
          <UpdateStep 
            patientID={item.patientID} 
            appointmentID={item.id}
          />
        </div>
      </div>
    </li>
  )
}
