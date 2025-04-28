import React, { useEffect, useState } from 'react'
import Header from '../../Regular/Table/Header';
import Table from './Table';
import AddDoctor from './AddDoctor';
import { useStateContext } from '../../../../Context';

export default function Doctor({ setOpenComponent, setDoctorDetail }) {
  const { GET_ALL_REGISTERED_DOCTOR, address } = useStateContext();
  const [registerDoctor, setRegisterDoctor] = useState(null);
  const [registerDoctorCopy, setRegisterDoctorCopy] = useState(null);

  const tableHead = [
    {
      name: 'ID',
    },
    {
      name: 'Name',
    },    
    {
      name: 'Specialization',
    },
    {
      name: 'Email',
    },
    {
      name: 'Phone',
    },
    {
      name: 'Appointment',
    },
    {
      name: 'Status',
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      GET_ALL_REGISTERED_DOCTOR().then((doctors) => {
        setRegisterDoctor(doctors);
        setRegisterDoctorCopy(doctors);
      });
    };

    fetchData();
  }, [address]);

  const onHandleSearch = (value) => {
    const filter = registerDoctor.filter(({ firstName }) => 
      firstName.toLowerCase().includes(value.toLowerCase())
    );

    if (filter.length === 0) {
      setRegisterDoctor(registerDoctorCopy);
    } else {
      setRegisterDoctor(filter);
    }
  };

  const onClearSearch = () => {
    if (registerDoctor?.length && registerDoctorCopy.length) {
      setRegisterDoctor(registerDoctorCopy);
    }
  };
  
  return (
    <>
      <div className='container-fluid'>
        <Header 
          name={'Doctor List'}
          onClearSearch={onClearSearch}
          onHandleSearch={onHandleSearch}
        />
        <div className='row '>
          <div className='col-xl-12'>
            <div className='table-responsive'>
              <Table 
                thead={tableHead}
                name={'Doctor'}
                tableData={registerDoctor}
                setOpenComponent={setOpenComponent}
                setDoctorDetail={setDoctorDetail}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
