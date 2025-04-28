import React, { useEffect, useState } from 'react'
import Header from '../../Regular/Table/Header';
import Table from './Table';

export default function User() {
  const [appUsers, setAppUsers] = useState();
  const [appUsersCopy, setAppUsersCopy] = useState();

  const tableHead = [
    {
      name: 'NAME',
    },
    {
      name: 'ADDRESS',
    },
  ];

  const onHandleSearch = (value) => {
    const filter = appUsers.filter(({ name }) => {
      name.toLowerCase().includes(value.toLowerCase());
    });

    if (filter.length === 0) {
      setAppUsers(appUsersCopy);
    } else {
      setAppUsers(filter);
    }
  };

  const onClearSearch = () => {
    if (appUsers.length && appUsersCopy.length) {
      setAppUsers(appUsersCopy);
    }
  }

  return (
    <>
    <div className="container-fluid">
      <Header
        name={"Hospital Users"}
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
                  name={"patient"}
                  tableData={appUsers}
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
