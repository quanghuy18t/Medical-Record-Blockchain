import React from 'react'
import TableHead from '../Regular/Table/TableHead'
import TableList from './TableList'

export default function Table({
  thead,
  tableData,
  setDoctorDetail,
  setOpenComponent,
  setPatientDetail,
  setMedicineDetail
}) {
  return (
    <table
      id="example5"
      className="table table-striped patient-list mb-4 dataTablesCard fs-14"
    >
      <TableHead thead={thead} />
      <tbody>
        {tableData?.map((item, index) => (
          <TableList
            item={item}
            setDoctorDetail={setDoctorDetail}
            setOpenComponent={setOpenComponent}
            setPatientDetail={setPatientDetail}
            setMedicineDetail={setMedicineDetail}
          />
        ))}
      </tbody>
    </table>
  )
}
