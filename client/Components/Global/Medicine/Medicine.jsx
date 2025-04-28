import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context';
import MedicDetails from './MedicDetails';
import Card from '../Shop/Card';

export default function Medicine({
  setOpenComponent,
  setMedicineDetail,
  medicineDetail,
}) {
  const { GET_ALL_MEDICINE } = useStateContext();

  const [registerMedicine, setRegisterMedicine] = useState();

  useEffect(() => {
    const fetchData = async () => {
      GET_ALL_MEDICINE().then((medicines) => {
        setRegisterMedicine(medicines);
      });
    };

    fetchData();
  }, []);

  return (
    <div className="container-fluid">
      <div className="page-titles">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="javascript:void(0)">Home</a>
          </li>
          <li className="breadcrumb-item active">
            <a href="javascript:void(0)">Medicine Detail</a>
          </li>
        </ol>
      </div>
      <div className="row">
        <MedicDetails medicineDetail={medicineDetail} />
        {/* review /*/}
        <Review />
        <div>
          <h4 className="fs-20 font-w700 my-4">Medicines</h4>
          <div className="medicines card-slider">
            {registerMedicine?.map((item, index) => (
              <Card
                item={item}
                index={index}
                setOpenComponent={setOpenComponent}
                setMedicineDetail={setMedicineDetail}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
