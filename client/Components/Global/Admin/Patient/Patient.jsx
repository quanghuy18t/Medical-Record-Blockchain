import React, { useEffect, useState } from 'react';
import Header from '../../Regular/Table/Header';
import Table from './Table';
import AddPatient from './AddPatient';
import { useStateContext } from '../../../../Context';

export default function Patient({ setOpenComponent, setPatientDetail }) {
  const { 
    address, 
    GET_ALL_REGISTERED_PATIENT, 
    GET_ALL_REGISTERED_DOCTOR
  } = useStateContext();
  const [registerPatient, setRegisterPatient] = useState(null);
  const [registerDoctor, setRegisterDoctor] = useState(null);
  const [registerPatientCopy, setRegisterPatientCopy] = useState(null);
  
  const tableHead = [
    {
      name: '#ID',
    },
    {
      name: 'Name',
    },
    {
      name: 'Email',
    },
    {
      name: 'Phone',
    },
    {
      name: "Address",
    },
    {
      name: 'Gender',
    },
    {
      name: 'Status',
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      GET_ALL_REGISTERED_PATIENT().then((patients) => {
        setRegisterPatient(patients);
        setRegisterPatientCopy(patients);
      });

      GET_ALL_REGISTERED_DOCTOR().then((doctors) => {
        setRegisterDoctor(doctors);
      });
    };

    fetchData();
  }, [address]);

  const onHandleSearch = (value) => {
    const filter = registerPatient.filter(({ firstName }) => 
      firstName.toLowerCase().includes(value.toLowerCase())
    );

    if (filter.length === 0) {
      setRegisterPatient(registerPatientCopy);
    } else {
      setRegisterPatient(filter);
    }
  };

  const onClearSearch = () => {
    if (registerPatient?.length && registerPatientCopy.length) {
      setRegisterPatient(registerPatientCopy);
    }
  }

  return (
    <>
      <div className='container-fluid'>
        <Header 
          name={'Patient List'}
          onHandleSearch={onHandleSearch}
          onClearSearch={onClearSearch}
        />
        <div className='row'>
          <div className='col-xl-12'>
            <div className='card'>
              <div className='card-body p-0'>
                <div className='table-responsive'>
                  <Table 
                    thead={tableHead}
                    name={'patient'}
                    tableData={registerPatient}
                    setOpenComponent={setOpenComponent}
                    setPatientDetail={setPatientDetail}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddPatient registerDoctor={registerDoctor} />
    </>
  );
};
