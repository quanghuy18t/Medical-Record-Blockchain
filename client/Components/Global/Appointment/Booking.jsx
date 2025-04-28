import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context'

export default function Booking({ registerDoctors }) {
  const {
    address,
    BOOK_APPOINTMENT, 
    GET_ALL_DEPARTMENT,
    GET_SCHEDULE_BY_VALID,
    GET_DOCTOR_DETAIL,
    CHECK_PATIENT_REGISTRATION
  } = useStateContext();

  const [departments, setDepartments] = useState([]);
  const [listDoctors, setListDoctors] = useState([]);
  const [doctorNameMap, setDoctorNameMap] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState();
  const [booking, setBooking] = useState({
    doctorID: '',
    departmentID: '',
    day: '',
    time: '',
  });

  const selectedDoctorTime = listDoctors
    .filter((doc) => doc.doctorID === selectedDoctor)
    .flatMap((doc) => doc.time);

  const handleFindDoctor = async () => {
    GET_SCHEDULE_BY_VALID(booking).then((doctor) => {
      setListDoctors(doctor);
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      CHECK_PATIENT_REGISTRATION(address).then(patient => 
        setBooking({...booking, patientID: patient.patientID.toString()}
      ));
      
      GET_ALL_DEPARTMENT().then((department) => {
        setDepartments(department);
      });
    };

    fetchData();
  }, [address]);

  useEffect(() => {
    const fetchData = async () => {
      const doctorIDs = [...new Set(listDoctors.map(doc => doc.doctorID))];

      const result = await Promise.all(doctorIDs.map(id => GET_DOCTOR_DETAIL(Number(id))));
      const nameMap = {};

      result.forEach((res, index) => {
        const id = doctorIDs[index];
        nameMap[id] = res.name;
      });

      setDoctorNameMap(nameMap);
    };

    if (listDoctors.length > 0) {
      fetchData();
    }
  }, [listDoctors]);

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Book Appointment
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div>
              <div className="row">
                <div className="col-xl-12">
                  <div className="form-group">
                    <label className="col-form-label">
                      Date Of Appointment:
                    </label>
                    <input
                      onChange={(e) => setBooking({ ...booking, day: e.target.value })}
                      size={16}
                      defaultValue={new Date().toISOString().split("T")[0]}
                      type="date"
                      className="form-control"
                    />
                  </div>
                </div>
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Specialization:</label>
                    <select
                      className='form-control'
                      onChange={(e) => {
                        setBooking({ ...booking, departmentID: e.target.value })
                      }}
                    >
                      <option value={""}>Select Specialization</option>
                      {departments.map((department, index) => (
                        <option key={index} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => handleFindDoctor()}
                  className="btn btn-primary"
                >
                  Find Doctor
                </button>

                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Doctor*:</label>
                    <select
                      className='form-control'
                      onChange={(e) => {
                        setSelectedDoctor(e.target.value);
                        setBooking({ ...booking, doctorID: e.target.value })
                      }}
                    >
                      <option value={""}>Select Doctor</option>
                      {[...new Set(listDoctors.map((doctor) => doctor.doctorID))].map((doctorID, index) => (
                        <option key={index} value={doctorID}>
                          {doctorNameMap[doctorID] || doctorID}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className='col-xl-12'>
                  <div className='form-group'>
                    <label className='col-form-label'>Slot Time*:</label>
                    <select
                      className='form-control'
                      onChange={(e) => {
                        setBooking({ ...booking, time: e.target.value })
                      }}
                    >
                      <option value={""}>Select Time</option>
                      {selectedDoctorTime.map((time, index) => (
                        <option key={index} value={time}>
                          {time.slice(11, 16)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger light"
              data-bs-dismiss="modal"
            >
              Close
            </button>
            <button
              onClick={() => BOOK_APPOINTMENT(booking)}
              className="btn btn-primary"
            >
              Book Appoinment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
