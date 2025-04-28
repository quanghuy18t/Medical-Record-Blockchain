import React from 'react'
import { useStateContext } from '../../../../Context'
import { FaRegCopy } from '../../../ReactICON/index';

export default function TableList({ patient, index }) {
  const { notifySuccess } = useStateContext();
  
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess('Copied successfully');
  }

  return (
    <tr key={patient?.patientID}>
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
        </div>
      </td>
      <td>{patient?.name}</td>

      <td>
        {patient?.walletAddress}{" "}
        <FaRegCopy onClick={() => copyText(patient?.walletAddress)} />
      </td>
    </tr>
  )
}
