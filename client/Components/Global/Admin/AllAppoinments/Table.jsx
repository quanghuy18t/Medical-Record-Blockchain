import React from 'react'
import TableHead from '../../Regular/Table/TableHead'
import TableList from './TableList'

export default function Table({
  thread,
  tableData,
  setDoctorDetail,
  setOpenComponent,
  setPatientDetail
}) {
  return (
    <table
      className='table table-striped patient-list mb-4 dataTablesCard fs-14'
      id='example5'
    >
      <TableHead thead={thread} />
      <tbody>
        {tableData?.map((item, index) => (
          <TableList 
            item={item}
            setOpenComponent={setOpenComponent}
            setDoctorDetail={setDoctorDetail}
            setPatientDetail={setPatientDetail}
          />
        ))}
      </tbody>
    </table>
  )
}
