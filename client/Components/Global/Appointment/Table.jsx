import React from 'react'
import TableList from './TableList'
import TableHead from '../Regular/Table/TableHead'

export default function Table({
  thead,
  tableData,
  name,
  setOpenComponent,
  setDoctorDetails,
}) {
  return (
    <table
      id="example5"
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
            setDoctorDetails={setDoctorDetails}
          />
        ))}
      </tbody>
    </table>
  )
}
