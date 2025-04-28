import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context';
import Header from '../Regular/Table/Header';
import Table from './Table';

export default function DoctorAppointment({ user, setOpenComponent, setPatientDetail }) {
  const { GET_DOCTOR_APPOINTMENT_HISTORY } = useStateContext();

  const [doctorAppoinment, setDoctorAppoinment] = useState([]);
  const [doctorAppoinmentCopy, setDoctorAppoinmentCopy] = useState();

  const tableHead = [
    {
      name: 'PATIENT',
    },
    {
      name: 'EMAIL',
    },
    {
      name: 'PHONE',
    },
    {
      name: 'BOOKING DATE',
    },
    {
      name: 'DATE',
    },
    {
      name: 'TIME',
    },
    {
      name: 'STATUS',
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const appointments = await GET_DOCTOR_APPOINTMENT_HISTORY(user.doctorID);

      setDoctorAppoinment(appointments);
    };

    fetchData();
  }, [user]);

  const onHandleSearch = (value) => {
    const filter = doctorAppoinment.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filter.length === 0) {
      setDoctorAppoinment(doctorAppoinmentCopy);
    } else {
      setDoctorAppoinment(filter);
    }
  };

  const onClearSearch = () => {
    if (doctorAppoinment?.length && doctorAppoinmentCopy.length) {
      setDoctorAppoinment(doctorAppoinmentCopy);
    }
  };

  return (
    <div className="container-fluid">
        <Header
          name={"Your Appointment"}
          onHandleSearch={onHandleSearch}
          onClearSearch={onClearSearch}
        />
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <Table
                    thead={tableHead}
                    tableData={doctorAppoinment}
                    name={"appoinment"}
                    setOpenComponent={setOpenComponent}
                    setPatientDetails={setPatientDetail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
