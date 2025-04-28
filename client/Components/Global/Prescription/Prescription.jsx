import React, { use, useEffect, useState } from 'react'
import { useStateContext } from '../../../Context';
import Table from './Table';
import Header from './Header';

export default function Prescription({
  setDoctorDetail,
  setOpenComponent,
  setPatientDetail,
  setMedicineDetail
}) {
  const { GET_PRESCRIPTION_OF_MEDICAL } = useStateContext();

  const [allPrescribed, setAllPrescribed] = useState();

  const tableHead = [
    {
      name: 'DOCTOR',
    },
    {
      name: 'PATIENT',
    },
    {
      name: 'MEDICINE',
    },
    {
      name: 'DATE',
    },
    {
      name: 'PRESCRIPTION',
    },
    {
      name: 'PROFILE',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      GET_PRESCRIPTION_OF_MEDICAL().then((prescription) => {
        setAllPrescribed(prescription);
      });
    };

    fetchData();
  })

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
                    tableData={allPrescribed}
                    name={"Appoinment"}
                    setDoctorDetail={setDoctorDetail}
                    setOpenComponent={setOpenComponent}
                    setPatientDetail={setPatientDetail}
                    setMedicineDetail={setMedicineDetail}
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
