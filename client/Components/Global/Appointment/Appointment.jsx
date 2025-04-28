import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context';
import Booking from './Booking';
import Header from './Header';
import Table from './Table';

export default function Appointment({ setOpenComponent, setDoctorDetail }) {
  const { 
    address,
    GET_PATIENT_APPOINTMENT_HISTORY,
    CHECK_PATIENT_REGISTRATION
  } = useStateContext();
  
  const [patientAppoinment, setPatientAppoinment] = useState();
  const [registerDoctors, setRegisterDoctors] = useState();

  const tableHead = [
    {
      name: 'DAY',
    },
    {
      name: 'TIME SLOT',
    },
    {
      name: 'ROOM',
    },
    {
      name: 'QUEUE NO'
    },
    {
      name: 'DOCTOR',
    },
    {
      name: 'STATUS',
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      const patient = await CHECK_PATIENT_REGISTRATION(address);

      GET_PATIENT_APPOINTMENT_HISTORY(patient.patientID.toString()).then((appointment) => {
        setPatientAppoinment(appointment);
      });
    };

    fetchData();
  }, [address]);

  return (
    <>
      <div className="container-fluid">
        <Header />
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <Table
                    thead={tableHead}
                    tableData={patientAppoinment}
                    name={"appoinment"}
                    setOpenComponent={setOpenComponent}
                    setDoctorDetails={setDoctorDetail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Booking registerDoctors={registerDoctors} />
    </>
  )
}
