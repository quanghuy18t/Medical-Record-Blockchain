import React, { useEffect, useState } from 'react'
import { useStateContext } from '../../../Context';
import Header from './Header';
import Update from './Update';
import UpdateStatus from './UpdateStatus';
import Card from './Card';
import { 
  DoctorDetails1,
  DoctorDetails2,
  DoctorDetails3, 
  DoctorDetails4,
  DoctorDetails5
} from '../../SVG/index';
import { FaRegCopy } from '../../ReactICON/index';
import { SHORTEN_ADDRESS } from '../../../Context/constants';
import AppoinmentList from './AppoinmentList';
import UpdateTest from './UpdateTest';
import dayjs from 'dayjs';

export default function DoctorProfile({ user, setPatientDetail, setOpenComponent }) {
  const { 
    address,
    notifySuccess, 
    ADD_MEDICATION,
    GET_DOCTOR_APPOINTMENT_HISTORY,
    ADD_TEST,
    ADD_MEDICAL,
    ADD_PRESCRIPTION,
    GET_ALL_MEDICINE
  } = useStateContext();

  const [doctorAppoinment, setDoctorAppoinment] = useState();
  const [updateMedication, setUpdateMedication] = useState(false);
  const [updateCondition, setUpdateCondition] = useState(false);
  const [updateTest, setUpdateTest] = useState(false);
  const [registerMedicine, setRegisterMedicine] = useState();

  const [medicationUpdate, setMedicationUpdate] = useState({
    patientID: "",
    medicineID: "",
    dosage: "",
    frequency: "",
    duration: "",
    quantity: ""
  });

  const [prescriptionUpdate, setPrescriptionUpdate] = useState({
    patientID: "",
    medications: []
  })

  const [conditionUpdate, setConditionUpdate] = useState({
    patientID: "",
    symptoms: "",
    diagnosis: "",
    tests: [],
    prescriptions: [],
  });

  const [testUpdate, setTestUpdate] = useState({
    patientID: "",
    typeOfTest: "",
    result: "",
    diagnosis: "",
    notes: "",
    images: [],
  });

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    notifySuccess('Copied successfully');
  };

  const handleAddPrescription = async (data) => {
    const prescriptionID = await ADD_PRESCRIPTION(data);
    setConditionUpdate(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, prescriptionID]
    }));
  };

  const handleAddTest = async (data) => {
    console.log(data);
    const testID = await ADD_TEST(data);
    setConditionUpdate(prev => ({
      ...prev,
      tests: [...prev.tests, testID]
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      GET_DOCTOR_APPOINTMENT_HISTORY(user.doctorID).then((appointment) => {
        const _newArray = appointment.filter((item) => item.status === 'pending');

        setDoctorAppoinment(_newArray);
      });
    };

    fetchData();
  }, [user.doctorID]);

  useEffect(() => {
    const fetchData = async () => {
      GET_ALL_MEDICINE().then((medicine) => {
        setRegisterMedicine(medicine);
      });
    };

    fetchData();
  }, [address]);

  return (
    <div className='container-fluid'>
      <Header />
      {updateMedication && (
        <Update 
          setPrescriptionUpdate={setPrescriptionUpdate}
          registerMedicine={registerMedicine}
          handleClick={() => handleAddPrescription(prescriptionUpdate)}
        />
      )}

      {updateCondition && (
        <UpdateStatus 
          setUpdateCondition={setUpdateCondition}
          setConditionUpdate={setConditionUpdate}
          conditionUpdate={conditionUpdate}
          handleClick={() => {ADD_MEDICAL(conditionUpdate)}}
        />
      )}

      {updateTest && (
        <UpdateTest 
          setTestUpdate={setTestUpdate}
          setUpdateTest={setUpdateTest}
          testUpdate={testUpdate}
          handleClick={() => handleAddTest(testUpdate)}
        />
      )}

      <div className="row">
        <div className="col-xl-3 col-lg-4 col-xxl-4">
          <div className="card">
            {doctorAppoinment?.length ? (
              <div className="card-header border-0 pb-0">
                <h4 className="fs-20 font-w600 mb-0">Appointments List</h4>
              </div>
            ) : ("")}
            <div className="card-body px-0 pt-4">
              <div
                id="DZ_W_Todo2"
                className="widget-media dz-scroll px-4 height370"
              >
                {doctorAppoinment?.length ? (
                  <ul className="timeline">
                    {doctorAppoinment?.map((item, index) => (
                      <AppoinmentList
                        item={item}
                        index={index}
                      />
                    ))}
                  </ul>
                ) : (
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                    src="appointment.jpg"
                    alt="Appointment"
                  />
                )}
              </div>
              <div style={{marginTop: "3rem", padding: "1rem"}}>
                <Card
                  name={user?.appointmentCount}
                  title={"Total Appointment:"}
                  icon={<DoctorDetails3 />}
                />
                <Card
                  name={user?.successfulTreatmentCount}
                  title={"Successful Treatment:"}
                  icon={<DoctorDetails3 />}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 col-xxl-8 col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="media d-sm-flex d-block text-center text-sm-start pb-4 mb-4 border-bottom">
                <img
                  alt="image"
                  className="rounded me-sm-4 me-0"
                  width={130}
                  src={user?.image}
                />
                <div className="media-body align-items-center">
                  <div className="d-sm-flex d-block justify-content-between my-3 my-sm-0">
                    <div>
                      <h3 className="fs-22 text-black font-w600 mb-0">
                        {user?.name}
                      </h3>
                      <p className="mb-2 mb-sm-2">
                        {SHORTEN_ADDRESS(user?.walletAddress)}{" "}
                        <a onClick={() => copyText(user?.walletAddress)}>
                          {" "}
                          <FaRegCopy />
                        </a>
                      </p>
                    </div>
                    <span>ID: {user?.doctorID}</span>
                  </div>
                  <a className="btn btn-primary light btn-rounded mb-2 me-2">
                    <DoctorDetails1 />
                    {user?.gender}
                  </a>
                  <a className="btn btn-primary light btn-rounded mb-2">
                    <DoctorDetails2 />
                    {user?.specialization}
                  </a>
                  <a className="btn btn-primary light btn-rounded mb-2">
                    <DoctorDetails2 />
                    {user?.degree}
                  </a>
                </div>
              </div>
              <div className="row">
                <Card
                  name={user?.yourAddress}
                  title={"Doctor Address"}
                  icon={<DoctorDetails3 />}
                />
                <Card
                  name={user?.phone}
                  title={"Phone"}
                  icon={<DoctorDetails4 />}
                />
                <Card
                  name={user?.email}
                  title={"Email"}
                  icon={<DoctorDetails5 />}
                />
                <Card
                  name={user?.designation}
                  title={"Designation"}
                  icon={<DoctorDetails3 />}
                />
              </div>
              <hr />
              <div className="mt-5">
                <h4 className="fs-20 font-w600">
                  About Dr. {user?.name}
                </h4>
                <div className="staff-info">
                  <p>{user?.biography}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
