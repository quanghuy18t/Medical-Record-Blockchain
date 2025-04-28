import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../../Context';
import Header from '../../Regular/Table/Header';
import Table from './Table';
import AddDepartment from './AddDepartment';

export default function Department({ setOpenComponent }) {
  const { GET_ALL_DEPARTMENT, address } = useStateContext();

  const [department, setDepartment] = useState([]);

  const tableHead = [
    {
      name: 'Name'
    },
    {
      name: 'Doctors'
    },
    {
      name: 'Rooms'
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      GET_ALL_DEPARTMENT().then((departments) => {
        setDepartment(departments);
      });
    };

    fetchData();
  }, [address]);
  
  const onHandleSearch = (value) => {
    const filter = department.filter(({ firstName }) => 
      firstName.toLowerCase().includes(value.toLowerCase())
    );

    if (filter.length === 0) {
      setDepartment(department);
    } else {
      setDepartment(filter);
    }
  };

  const onClearSearch = () => {
    if (department?.length) {
      setDepartment(department);
    }
  };

  return (
    <>
      <div className='container-fluid'>
        <Header 
          name={'Department List'}
          onClearSearch={onClearSearch}
          onHandleSearch={onHandleSearch}
        />
        <div className='row'>
          <div className='col-xl-12'>
            <div className='table-responsive'>
              <Table 
                thead={tableHead}
                name={'Department'}
                tableData={department}
                setOpenComponent={setOpenComponent}
              />
            </div>
          </div>
        </div>
      </div>
      <AddDepartment />
    </>
  )
}
