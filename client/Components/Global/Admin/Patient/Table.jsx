import React from 'react'
import TableHead from '../../Regular/Table/TableHead'
import TableList from './TableList'

export default function Table({
  thead,
  name,
  tableData,
  setOpenComponent,
  setPatientDetail
}) {
  return (
    <table 
      id='example5' 
      className='table table-striped patient-list mb-4 dataTablesCard fs-14'
    >
      <TableHead
        thead={thead}
        name={name}
      />
      <tbody>
        {tableData?.map((patient, index) => (
          <TableList 
            patient={patient}
            index={index}
            setOpenComponent={setOpenComponent}
            setPatientDetail={setPatientDetail}
          />
        ))}
      </tbody>
    </table>
  );
};
