import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../../Context';
import Update from './Update';
import Table from './Table';
import AddMedice from './AddMedice';
import Header from '../../Regular/Table/Header';

export default function Medicine({
  setOpenComponent,
  setMedicineDetail,
}) {
  const [activeFunction, setActiveFunction] = useState();
  const [updateMedicine, setUpdateMedicine] = useState({
    medicineID: '',
    update: ''
  });

  const { 
    address,
    checkMetamask,
    GET_ALL_MEDICINE,
    UPDATE_MEDICINE_PRICE,
    UPDATE_MEDICINE_QUANTITY
  } = useStateContext();
  
  const [registerMedicine, setRegisterMedicine] = useState();
  const [registerMedicineCopy, setRegisterMedicineCopy] = useState();

  const tableHead = [
    {
      name: "Name",
    },
    {
      name: "Price",
    },
    {
      name: "Quantity",
    },
    {
      name: "Brand",
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const accountAddress = await checkMetamask();
      if (accountAddress) {
        GET_ALL_MEDICINE().then((medicine) => {
          setRegisterMedicine(medicine);
          setRegisterMedicineCopy(medicine);
        });
      }
    };

    fetchData();
  }, [address]);

  const onHandleSearch = (value) => {
    const filter = registerMedicine.filter(({ name }) =>
      name.toLowerCase().includes(value.toLowerCase())
    );

    if (filter.length === 0) {
      setRegisterMedicine(registerMedicineCopy);
    } else {
      setRegisterMedicine(filter);
    }
  };

  const onClearSearch = () => {
    if (registerMedicine?.length && registerMedicineCopy.length) {
      setRegisterMedicine(registerMedicineCopy);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <Header
          name={"Medicine List"}
          onHandleSearch={onHandleSearch}
          onClearSearch={onClearSearch}
        />

        {activeFunction == "Price" ? (
          <Update
            activeFunction={activeFunction}
            updateMedicine={updateMedicine}
            setActiveFunction={setActiveFunction}
            setUpdateMedicine={setUpdateMedicine}
            handleClick={() => UPDATE_MEDICINE_PRICE(updateMedicine)}
          />
        ) : activeFunction == "Quantity" ? (
          <Update
            activeFunction={activeFunction}
            updateMedicine={updateMedicine}
            setActiveFunction={setActiveFunction}
            setUpdateMedicine={setUpdateMedicine}
            handleClick={() => UPDATE_MEDICINE_QUANTITY(updateMedicine)}
          />
        ) : (
          ""
        )}

        <div className="row">
          <div className="col-xl-12">
            <div className="table-responsive">
              <Table
                thead={tableHead}
                tableData={registerMedicine}
                name={"Doctor"}
                setOpenComponent={setOpenComponent}
                setActiveFunction={setActiveFunction}
                updateMedicine={updateMedicine}
                setUpdateMedicine={setUpdateMedicine}
                setMedicineDetails={setMedicineDetail}
              />
            </div>
          </div>
        </div>
      </div>
      <AddMedice />
    </>
  )
}
