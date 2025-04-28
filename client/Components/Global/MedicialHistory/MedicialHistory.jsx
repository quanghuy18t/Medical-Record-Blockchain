import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context';
import Table from './Table';

export default function MedicialHistory() {
  const { 
    address,
    CHECK_PATIENT_REGISTRATION,
    GET_ALL_PATIENT_MEDICAL
  } = useStateContext();
  const [history, setHistory] = useState();

  const tableHead = [
    {
      name: 'ID',
    },
    {
      name: 'DOCTOR',
    },
    {
      name: 'HOSPITAL',
    },
    {
      name: 'DAY',
    },
    {
      name: 'ACTION'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      const patient = await CHECK_PATIENT_REGISTRATION(address);
      const medicals = await GET_ALL_PATIENT_MEDICAL(Number(patient.patientID));
      setHistory(medicals);
    };

    fetchData();
  }, [address]);

  return (
    <div className="container-fluid">
      <div className="page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="javascript:void(0)">History</a>
          </li>
          <li className="breadcrumb-item active">
            <a href="javascript:void(0)">Medicial History</a>
          </li>
        </ol>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card overflow-hidden">
            <div className="card-body p-0">
              <div className="table-responsive">
                <Table
                  thead={tableHead}
                  tableData={history}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
