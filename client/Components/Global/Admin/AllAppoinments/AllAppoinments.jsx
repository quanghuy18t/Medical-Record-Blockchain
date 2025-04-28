import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../../Context';
import Header from '../../Regular/Table/Header';
import Table from './Table';

export default function AllAppoinments({
  setDoctorDetail,
  setOpenComponent,
  setPatientDetail
}) {
  const {
    GET_ALL_APPOINTMENT,
    GET_DOCTOR_DETAIL,
    GET_PATIENT_DETAIL
  } = useStateContext();
  const [registerDoctors, setRegisterDoctors] = useState();
  const [registerDoctorsCopy, setRegisterDoctorsCopy] = useState();

  const tableHead = [
    {
      name: "Patient",
    },
    {
      name: "Doctor",
    },
    {
      name: "Booking Date",
    },
    {
      name: "Date",
    },
    {
      name: "Time",
    },
    {
      name: "Status",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointments = await GET_ALL_APPOINTMENT();

        const data = await Promise.all(appointments.map(async (appointment) => {
          const doctor = await GET_DOCTOR_DETAIL(appointment.doctorID);
          const patient = await GET_PATIENT_DETAIL(appointment.patientID);

          return { ...appointment, doctor, patient, ...doctor };
        }));

        data.sort((a, b) => new Date(b.time) - new Date(a.time));

        setRegisterDoctors(data);
        setRegisterDoctorsCopy(data);
      } catch(error) {
        console.error('Error fetching data', error);
      }
    };

    fetchData();
  }, []);

  const onHandleSearch = (value) => {
    const filter = registerDoctors.filter(({ firstName }) =>
      firstName.toLowerCase().includes(value.toLowerCase())
    );

    if (filter.length === 0) {
      setRegisterDoctors(registerDoctorsCopy);
    } else {
      setRegisterDoctors(filter);
    }
  };

  const onClearSearch = () => {
    if (registerDoctors?.length && registerDoctorsCopy.length) {
      setRegisterDoctors(registerDoctorsCopy);
    }
  };

  return (
    <>
      <div className='container-fluid'>
        <Header 
          name={'Appointment'}
          onHandleSearch={onHandleSearch}
          onClearSearch={onClearSearch}
        />
        <div className='row'>
          <div className='col-xl-12'>
            <div className='card'>
              <div className='card-body p-0'>
                <div className='table-responsive'>
                  <Table 
                    thread={tableHead}
                    tableData={registerDoctors}
                    setOpenComponent={setOpenComponent}
                    setDoctorDetail={setDoctorDetail}
                    setPatientDetail={setPatientDetail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
