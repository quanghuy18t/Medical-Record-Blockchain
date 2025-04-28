import React from 'react'
import TableHead from '../Regular/Table/TableHead'
import TableList from './TableList'

export default function Table({ thead, tableData }) {
  return (
    <table className="table table-sm mb-0">
      <TableHead thead={thead} />
      <tbody id="orders">
        {tableData?.map((item, index) => (
          <TableList
            item={item}
            index={index}
          />
        ))}
      </tbody>
    </table>
  )
}
