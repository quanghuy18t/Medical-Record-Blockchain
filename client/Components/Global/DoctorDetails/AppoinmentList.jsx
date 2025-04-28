import React, { useEffect, useState } from 'react'

export default function AppoinmentList({ item, index }) {
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
          <li className="me-2 fs-15">Time: {item?.day}</li>
        </ul>
      </div>
    </li>
  )
}
