import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context'
import Card from './Card';

export default function TableList({ item, index }) {
  const { GET_DOCTOR_DETAIL, setMedicalDetail, setOpenComponent } = useStateContext();

  const [doctor, setDoctor] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const doctor = await GET_DOCTOR_DETAIL(item.doctorID);
      console.log(doctor);
      setDoctor(doctor);
    };

    fetchData();
  }, []);
  
  return (
    <tr key={index} className="btn-reveal-trigger">
      <td className="py-2">
        <div className="form-check custom-checkbox checkbox-success">
          <input type="checkbox" className="form-check-input" id="checkbox" />
          <label className="form-check-label" htmlFor="checkbox" />
        </div>
      </td>

      <td className="py-2">{item.medicalID}</td>
      <td className='py-2'>{doctor?.name}</td>
      <td className="py-2">{item.hospitalName}</td>
      <td className='py-2'>{item.date}</td>
      <td>
        <a
          className='btn btn-primary light btn-rounded mb-2 me-2'
          onClick={() => (
            setMedicalDetail(item), 
            setOpenComponent('MedicalDetail')
          )}
        >
          Detail
        </a>
        <Card 
          item={item}
          doctor={doctor}
        />
      </td>
    </tr>
  )
}
