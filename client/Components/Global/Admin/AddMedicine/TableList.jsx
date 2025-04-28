import React from 'react'
import { 
  TableList4
} from '../../../SVG/index'

export default function TableList({
  item,
  index,
  name,
  setOpenComponent,
  setActiveFunction,
  updateMedicine,
  setUpdateMedicine,
  setMedicineDetails
}) {
  return (
    <tr key={item?.medicineID}>
      <td>
        <div className="d-flex align-items-center">
          <div className="checkbox text-end align-self-center">
            <div className="form-check custom-checkbox">
              <input
                type="checkbox"
                className="form-check-input"
                id="customCheckBox2"
                required=""
              />
              <label className="form-check-label" htmlFor="customCheckBox2" />
            </div>
          </div>
          <img
            alt=""
            src={item?.image}
            height={43}
            width={43}
            className="rounded-circle ms-4"
          />
        </div>
      </td>
      <td>{item?.name}</td>
      <td>{item?.price}</td>
      <td>{item?.quantity}</td>
      <td>
        <span className="font-w500">{item?.brand}</span>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <div className="dropdown ms-auto c-pointer text-end">
            <div className="btn-link" data-bs-toggle="dropdown">
              <TableList4 />
            </div>
            <div className="dropdown-menu dropdown-menu-right">
              <a
                className="dropdown-item"
                href="javascript:void(0);"
                onClick={() => (
                  setMedicineDetails(item), setOpenComponent("Medicine")
                )}
              >
                View Detail
              </a>
              <a
                onClick={(e) => (
                  setUpdateMedicine({
                    ...updateMedicine,
                    medicineID: item?.medicineID,
                  }),
                  setActiveFunction("Price")
                )}
                className="dropdown-item"
              >
                Update Price
              </a>
              <a
                className="dropdown-item"
                onClick={(e) => (
                  setUpdateMedicine({
                    ...updateMedicine,
                    medicineID: item?.medicineID,
                  }),
                  setActiveFunction("Quantity")
                )}
              >
                Update Quantity
              </a>
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}
