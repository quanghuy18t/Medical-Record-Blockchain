import React from 'react'
import TableHead from '../../Regular/Table/TableHead'
import TableList from './TableList'

export default function Table({
  thead,
  name,
  tableData,
  setOpenComponent,
  setDoctorDetail
}) {
  return (
    <table 
      id='example5' 
      className="table shadow-hover doctor-list table-bordered mb-4 dataTablesCard fs-14"
    >
      <TableHead
        thead={thead}
        name={name}
      />
      <tbody>
        {tableData?.map((item, index) => (
          <TableList 
            item={item}
            setOpenComponent={setOpenComponent}
            setDoctorDetail={setDoctorDetail}
          />
        ))}
      </tbody>
    </table>
  );
};
