import React, { useEffect, useState } from 'react';
import { 
  AddDoctor,
  AddMedicine,
  AddPatient,
  AI,
  AllAppoinments,
  Appointment,
  Auth,
  Chat,
  Doctor,
  DoctorAppointment,
  DoctorDetails,
  DoctorProfile,
  Header,
  Home,
  Invoice,
  Loader,
  MedicialHistory,
  Medicine,
  NavHeader, 
  Notifications, 
  Order, 
  Patient, 
  PatientProfile, 
  Preloader, 
  Prescription, 
  Profile, 
  Shop, 
  SideBar,
  StaffProfile,
  UpdateAdmin,
  User
} from '../Components/Global';
import { useStateContext } from '../Context'
import { errorParseMsg, SHORTEN_ADDRESS } from '../Context/constants';
import Schedule from '../Components/Global/Admin/DoctorSchedule/Schedule';
import Department from '../Components/Global/Admin/Department/Department';
import MedicalDetail from '../Components/Global/MedicialHistory/MedicalDetail';
import DoctorSchedule from '../Components/Global/DoctorSchedule/DoctorSchedule';

export default function index() {
  const {
    address, 
    setAddress,
    accountBalance,
    openComponent,
    setOpenComponent,
    loader,
    currency,
    reCall,
    notifyError,
    GET_ALL_APPOINTMENT,
    GET_USERNAME_TYPE,
    CHECK_DOCTOR_REGISTRATION,
    CHECK_PATIENT_REGISTRATION,
    GET_ALL_APPROVED_PATIENT,
    GET_ALL_APPROVED_DOCTOR
  } = useStateContext();

  const [user, setUser] = useState();
  const [registerDoctor, setRegisterDoctor] = useState(null);
  const [registerPatient, setRegisterPatient] = useState(null);
  const [userType, setUserType] = useState(null);
  const [checkRegistration, setCheckRegistration] = useState(null);
  const [addDoctor, setAddDoctor] = useState(false);
  const [addPatient, setAddPatient] = useState(false);
  const [notification, setNotification] = useState(null);
  const [notificationCount, setNotificationCount] = useState(null);
  const [authComponent, setAuthComponent] = useState(true);
  const [allAppointment, setAllAppointment] = useState(null);
  const [patientDetail, setPatientDetail] = useState(null);
  const [doctorDetail, setDoctorDetail] = useState(null);
  const [medicineDetail, setMedicineDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!address) return;

        setAuthComponent(false);

        const appointments = await GET_ALL_APPOINTMENT();
        setAllAppointment(appointments);

        GET_ALL_APPROVED_PATIENT().then((patients) => {
          setRegisterPatient(patients);
        });

        GET_ALL_APPROVED_DOCTOR().then((doctors) => {
          setRegisterDoctor(doctors);
        });

        if (address == process.env.NEXT_PUBLIC_ADMIN_ADDRESS) {
          setUserType("Admin");
          setOpenComponent("Home");
          return;
        }

        const checkUserType = await GET_USERNAME_TYPE(address);
        if (checkUserType.userType === "Admin") {
          setUserType("Admin");
          setOpenComponent("Home");
        } 
        else if (checkUserType.userType === "Doctor") {
          const doctor = await CHECK_DOCTOR_REGISTRATION(address);
          if (!doctor.isApprove) {
            setAuthComponent(true);
            return;
          }
  
          setUserType("Doctor");
          setUser(doctor);
          setOpenComponent("DoctorProfile");
        } 
        else if (checkUserType.userType === "Patient") {
          const patient = await CHECK_PATIENT_REGISTRATION(address);
          if (!patient.isApprove) {
            setAuthComponent(true);
            return;
          }
  
          setUserType("Patient");
          setUser(patient);
          setOpenComponent("PatientProfile");
        } 
        else {
          setAuthComponent(true);
        }
      } catch (error) {
        console.log(error);
        setAuthComponent(true);
      }
    };

    fetchData();
  }, [address, reCall]);

  const connectMetaMask = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(accounts[0]);
        notifySuccess("Connected successfully");
      } catch (error) {
        notifyError("Error connecting to MetaMask:");
      }
    } else {
      notifyError("MetaMask is not installed.");
    }
  };

  return (
    <>
      <Preloader />
      <div id='main-wrapper'>
        <NavHeader />

        <Header 
          user={user}
          setAddress={setAddress}
          setOpenComponent={setOpenComponent}
          checkRegistration={checkRegistration}
          notification={notification}
          notificationCount={notificationCount}
          setNotificationCount={setNotificationCount}
        />
        <SideBar 
          setOpenComponent={setOpenComponent} 
          user={user}
          setPatientDetail={setPatientDetail}
          setDoctorDetail={setDoctorDetail}
          userType={userType}
        />
        <div class='content-body'>
          {openComponent == 'Home' ? (
            <Home 
              registerDoctor={registerDoctor}
              registerPatient={registerPatient}
              setPatientDetail={setPatientDetail}
              setOpenComponent={setOpenComponent}
              setDoctorDetail={setDoctorDetail}
              notification={notification}
              allAppointment={allAppointment}
              accountBalance={accountBalance}
              currency={currency}
            />
          ) : openComponent == 'Patient' ? (
            <Patient 
              setPatientDetail={setPatientDetail}
              setOpenComponent={setOpenComponent}
            />
          ) : openComponent == 'Doctor' ? (
            <Doctor 
              setOpenComponent={setOpenComponent}
              setDoctorDetail={setDoctorDetail}
            /> 
          ) : openComponent == 'Medicine' ? (
            <AddMedicine 
              setOpenComponent={setOpenComponent}
              setMedicineDetail={setMedicineDetail}
            />
          ) : openComponent == 'All Appointment' ? (
            <AllAppoinments 
              setOpenComponent={setOpenComponent}
              setDoctorDetail={setDoctorDetail}
              setPatientDetail={setPatientDetail}
            />
          ) : openComponent == 'Appointment' ? (
            <Appointment 
              setOpenComponent={setOpenComponent}
              setDoctorDetail={setDoctorDetail}
            />
          ) : openComponent == 'Shop' ? (
            <Shop />
          ) : openComponent == 'Medicine' ? (
            <Medicine 
              setOpenComponent={setOpenComponent}
              setMedicineDetail={setMedicineDetail}
              medicineDetail={medicineDetail}
            />
          ) : openComponent == 'Order' ? (
            <Order />
          ) : openComponent == 'Invoice' ? (
            <Invoice />
          ) : openComponent == 'Notification' ? (
            <Notifications />
          ) : openComponent == 'Profile' ? (
            <Profile
              user={user}
              setOpenComponent={setOpenComponent}
              setDoctorDetail={setDoctorDetail}
            />
          ) : openComponent == 'PatientProfile' ? (
            <PatientProfile 
              user={user}
            />
          ) : openComponent == 'DoctorSchedule' ? (
            <DoctorSchedule
              user={user}
            />
          ) : openComponent == 'DoctorProfile' ? (
            <DoctorProfile 
              user={user}
              setPatientDetail={setPatientDetail}
              setOpenComponent={setOpenComponent}
            />
          ) : openComponent == 'DoctorDetail' ? (
            <DoctorDetails 
              doctorDetail={doctorDetail}
              setOpenComponent={setOpenComponent}
            />
          ) : openComponent == 'StaffProfile' ? (
            <StaffProfile />
          ) : openComponent == 'Chat' ? (
            <Chat />
          ) : openComponent == 'Ask AI' ? (
            <AI />
          ) : openComponent == 'MedicalHistory' ? (
            <MedicialHistory />
          ) : openComponent == 'MedicalDetail' ? (
            <MedicalDetail />
          ) : openComponent == 'User' ? (
            <User />
          ) : openComponent == 'UpdateAdmin' ? (
            <UpdateAdmin />
          ) : openComponent == 'Schedule' ? (
            <Schedule />
          ) : openComponent == 'Department' ? (
            <Department />
          ) : openComponent == 'YourAppointment' ? (
            <DoctorAppointment 
              user={user}
              setOpenComponent={setOpenComponent}
              setPatientDetail={setPatientDetail}
            />
          ) : openComponent == 'Prescription' ? (
            <Prescription
              setDoctorDetail={setDoctorDetail}
              setOpenComponent={setOpenComponent}
              setPatientDetail={setPatientDetail}
              setMedicineDetail={setMedicineDetail}
            />
          ) : ('')}
        </div>
      </div>
      {authComponent && (
        <Auth 
          setAddDoctor={setAddDoctor}
          setAddPatient={setAddPatient}
          address={address}
          connectMetaMask={connectMetaMask}
          SHORTEN_ADDRESS={SHORTEN_ADDRESS}
        />
      )}

      {addDoctor && <AddDoctor setAddDoctor={setAddDoctor} />}
      {addPatient && (
        <AddPatient
          setAddPatient={setAddPatient}
          registerDoctor={registerDoctor}
        />
      )}

      {loader && <Loader />}
    </>
  );
};
