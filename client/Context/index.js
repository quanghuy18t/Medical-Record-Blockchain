import React, { createContext, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { ethers } from 'ethers';
import { MEDICAL_ADDRESS, Signer } from './constants';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [loader, setLoader] = useState(false);
  const [reCall, setReCall] = useState(0);
  const [openComponent, setOpenComponent] = useState("Home");

  const [medicalDetail, setMedicalDetail] = useState(null);

  const notifySuccess = (msg) => toast.success(msg, {duration: 2000});
  const notifyError = (msg) => toast.error(msg, { duration: 2000 });

  const checkMetamask = async () => {
    try {
      if (!window.ethereum) return console.log("Install Metamask");

      const accounts = await window.ethereum.request({
        method: 'eth_accounts'
      });

      if (accounts.length) {
        setAddress(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const getBalance = await provider.getBalance(accounts[0]);
        const balance = ethers.utils.formatEther(getBalance);

        setAccountBalance(balance);
        return accounts[0];
      } else {
        return "No account";
      }
    } catch (error) {
      return `Not connected, ${error}`;
    }
  };

  const checkConnected = async () => {
    try {
      if (!window.ethereum) return console.log("Install Metamask");

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      const firstAccount = accounts[0];
      setAddress(firstAccount);

      return firstAccount;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkMetamask();
  }, []);

  const GET_USERNAME_TYPE = async (_userAddress) => {
    if (!_userAddress) return notifyError('No address');

    const response = await axios.get(`http://localhost:4000/api/getType/${_userAddress}`);

    return response.data;
  }

  //-------------------DEPARTMENT---------------------
  //ADD DEPARTMENT
  const ADD_DEPARTMENT = async (name) => {
    try {
      if (!name) return notifyError("Data Invalid");

      const response = await axios.post('http://localhost:4000/api/department/add', name);
      const { newDepartment } = response.data;

      if (newDepartment) {
        notifySuccess("Add Department Successfull");
        await GET_ALL_DEPARTMENT()
      }
  
      return newDepartment;
    } catch (error) {
      console.log(error);
    }
  }

  //ADD DOCTOR TO DEPARTMENT
  const ADD_DOCTOR_DEPARTMENT = async (departmentName, doctorID) => {
    try {
      if (!departmentName || !doctorID) return notifyError("Data invalid");

      const response = await axios.post('http://localhost:4000/api/department/addDoctor', { departmentName, doctorID });
      const { result } = response.data;

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  //ADD ROOM
  const ADD_ROOM = async (departmentID) => {
    try {
      if (!departmentID) return notifyError("Data invalid");

      const response = await axios.post(`http://localhost:4000/api/department/addRoom/${departmentID}`);
      const { newRoom } = response.data;

      return newRoom;
    } catch (error) {
      console.log(error);
    }
  }

  //GET ALL DEPARTMENT
  const GET_ALL_DEPARTMENT = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/department/getAll');
      const { departments } = response.data;

      return departments;
    } catch (error) {
      console.log(error);
    }
  }

  //GET ROOMS IN DEPARTMENT
  const GET_ROOM_DEPARTMENT = async (name) => {
    try {
      if(!name) return notifyError('Data invalid');

      const response = await axios.get(`http://localhost:4000/api/department/getRoom/${name}`);
      const { rooms } = response.data;

      return rooms;
    } catch (error) {
      console.log(error);
    }
  }

  const GET_ROOM_BY_ID = async (roomID) => {
    try {
      if (!roomID) return notifyError('Data Invalid');

      const response = await axios.get(`http://localhost:4000/api/department/getRoomID/${roomID}`);
      const { room } = response.data;

      return room;
    } catch (error) {
      console.log(error);
    }
  }

  //---------------------DOCTOR------------------------
  //REGISTER DOCTOR
  const REGISTER_DOCTOR = async (doctor) => {
    try {
      const { name, image, gender, birth, degree, yourAddress, phone, email, designation, specialization, biography } = doctor;

      if (!name || !image || !gender || !birth || !degree || !yourAddress || !phone || !email || !designation || !specialization || !biography) {
        return notifyError('Data missing');
      }

      setLoader(true);
      notifySuccess("Registration processing...");

      const accountAddress = await checkMetamask();
      if (accountAddress) {
        const feeResponse = await axios.get('http://localhost:4000/api/doctor/getFee');
        const { registrationFee } = feeResponse.data;

        const txResponse = await axios.post('http://localhost:4000/api/doctor/register',
          { doctor },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const { txData } = txResponse.data;
        
        const signer = await Signer();
        const transaction = await signer.sendTransaction({
          to: MEDICAL_ADDRESS,
          data: txData,
          value: ethers.utils.parseEther(registrationFee),
          gasLimit: ethers.utils.hexlify(8000000)
        });
        await transaction.wait();
        
        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registration complete");
          window.location.reload();
        }
      }
    } catch(error) {
      setLoader(false);
      console.log(error);
    }
  }

  //APPROVE DOCTOR
  const APPROVE_DOCTOR = async (_doctorID) => {
    try {
      if (!_doctorID) return notifyError('Data missing');

      setLoader(true);
      notifySuccess('Registration Approve Doctor is processing...');

      const txResponse = await axios.post(`http://localhost:4000/api/doctor/approve/${_doctorID}`)

      const { txData } = txResponse.data;
      
      const signer = await Signer();
      const transaction = await signer.sendTransaction({
        to: MEDICAL_ADDRESS,
        data: txData,
        gasLimit: ethers.utils.hexlify(8000000)
      });
      await transaction.wait();

      if (transaction.hash) {
        setLoader(false);
        notifySuccess('Registration Approve Doctor Complete');
        setReCall(reCall + 1);
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  }

  //CHECK DOCTOR ALREADY REGISTER
  const CHECK_DOCTOR_REGISTRATION = async (_doctorAddress) => {
    const response = await axios.get(`http://localhost:4000/api/doctor/address/${_doctorAddress}`)
    const { result } = response.data;

    return result;
  }

  //GET ALL REGISTERED DOCTOR
  const GET_ALL_REGISTERED_DOCTOR = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/doctor/getAllRegistered');
      const { doctorArray } = response.data;

      return doctorArray;
    } catch (error) {
      console.log(error);
    }
  }

  //GET ALL APPROVED DOCTOR
  const GET_ALL_APPROVED_DOCTOR = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/doctor/getAllApproved');
      const { doctorArray } = response.data;

      return doctorArray;
    } catch (error) {
      console.log(error);
    }
  }

  //GET DOCTOR DETAIL
  const GET_DOCTOR_DETAIL = async (_doctorID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/doctor/id/${_doctorID}`);
      const { result } = response.data;

      return result;
    } catch(error) {
      console.log(error);
    }
  }

  //-----------------PATIENT--------------------
  //REGISTER PATIENT
  const REGISTER_PATIENT = async (patient) => {
    try {
      const { name, birth, gender, phone, email, yourAddress, insurance, notes } = patient;

      if (!name || !birth || !gender || !phone || !email || !yourAddress || !insurance || !notes) {
        return notifyError('Data missing');
      }

      setLoader(true);
      notifySuccess('Registration processing...');

      const accountAddress = await checkMetamask();
      if (accountAddress) {
        const feeResponse = await axios.get('http://localhost:4000/api/patient/getFee');
        const { registrationFee } = feeResponse.data;

        const txResponse = await axios.post('http://localhost:4000/api/patient/register',
          { patient },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const { txData } = txResponse.data;
        
        const signer = await Signer();
        const transaction = await signer.sendTransaction({
          to: MEDICAL_ADDRESS,
          data: txData,
          value: ethers.utils.parseEther(registrationFee),
          gasLimit: ethers.utils.hexlify(8000000)
        });
        await transaction.wait();
        
        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registration complete");
          window.location.reload();
        }
      }
    } catch(error) {
      setLoader(false);
      console.log(error);
    }
  }

  //APPROVE PATIENT
  const APPROVE_PATIENT = async (_patientID) => {
    try {
      if (!_patientID) return notifyError('Data missing');

      setLoader(true);
      notifySuccess('Registration Approve Patient is processing...');

      const txResponse = await axios.post(`http://localhost:4000/api/patient/approve/${_patientID}`)
      const { txData } = txResponse.data;
      
      const signer = await Signer();
      const transaction = await signer.sendTransaction({
        to: MEDICAL_ADDRESS,
        data: txData,
        gasLimit: ethers.utils.hexlify(8000000)
      });
      await transaction.wait();

      if (transaction.hash) {
        setLoader(false);
        notifySuccess('Registration Approve Patient Complete');
        window.location.reload();
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  }

  //CHECK PATIENT ALREADY REGISTER
  const CHECK_PATIENT_REGISTRATION = async (_patientAddress) => {
    if (!_patientAddress) notifyError('Data missing');

    const response = await axios.get(`http://localhost:4000/api/patient/address/${_patientAddress}`)
    const { result } = response.data;

    return result;
  }

  //GET ALL REGISTERED PATIENT
  const GET_ALL_REGISTERED_PATIENT = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/patient/getAllRegistered');
      const { patientArray } = response.data;

      return patientArray;
    } catch (error) {
      console.log(error);
    }
  }

  //GET ALL APPROVED PATIENT
  const GET_ALL_APPROVED_PATIENT = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/patient/getAllApproved');
      const { patientArray } = response.data;

      return patientArray;
    } catch (error) {
      console.log(error);
    }
  }

  //GET PATIENT DETAIL
  const GET_PATIENT_DETAIL = async (_patientID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/patient/id/${_patientID}`);
      const { result } = response.data;

      return result;
    } catch(error) {
      console.log(error);
    }
  }

  //--------------------APPOINTMENT-----------------------
  //BOOK APPOINTMENT
  const BOOK_APPOINTMENT = async (booking) => {
    try {
      const { doctorID, patientID, day, time } = booking;
      if (!doctorID || !patientID || !day || !time) {
        return notifyError('Data missing');
      }

      const response = await axios.post('http://localhost:4000/api/appointment/book',
        { doctorID, patientID, day, time },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { newAppointment } = response.data;

      if (newAppointment) {
        notifySuccess('Booking Successfull');
        window.location.reload();
      }

      return newAppointment;
    } catch(error) {
      console.log(error);
    }
  }

  //PAYMENT
  const APPOINTMENT_PAYMENT = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/appointment/createOrder');
      const { orderID } = response.data;

      return orderID;
    } catch (error) {
      console.log(error);
    }
  }

  //CAPTURE
  const APPOINTMENT_CAPTURE = async (orderID, appointmentID) => {
    try {
      const response = await axios.post('http://localhost:4000/api/appointment/capture', {
        orderID, appointmentID
      });

      const { update } = response.data;
      if (update) {
        window.location.reload();
        return update
      }
    } catch (error) {
      console.error(error);
    }
  }

  //COMPLETE APPOINTMENT
  const COMPLETE_APPOINTMENT = async (_appointmentID) => {
    try {
      if (!_appointmentID) return notifyError('Data missing');
      
      const response = await axios.post(`http://localhost:4000/api/appointment/complete/${_appointmentID}`)
      const { update } = response.data;

      if (update) {
        window.location.reload();
      }
        
      return update;
    } catch(error) {
      console.log(error);
    }
  }

  //CANCEL APPOINTMENT
  const CANCEL_APPOINTMENT = async (appointmentID) => {
    try {
      const request = await axios.post('http://localhost:4000/api/appointment/cancel', { appointmentID });
      const { update } = request.data;

      if (update) {
        window.location.reload();
        return update;
      }
    } catch (error) {
      console.error(error);
    }
  }

  //GET DOCTOR APPOINTMENT HISTORY
  const GET_DOCTOR_APPOINTMENT_HISTORY = async (_doctorID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/appointment/getHistoryOfDoctor/${_doctorID}`);
      const { result } = response.data;

      return result;
    } catch(error) {
      console.log(error);
    }
  }

  //GET PATIENT APPOINTMENT
  const GET_PATIENT_APPOINTMENT = async (_appointmentID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/appointment/${_appointmentID}`);
      const { appointment } = response.data;

      return appointment;
    } catch(error) {
      console.log(error);
    }
  }

  //GET PATIENT APPOINTMENT HISTORY
  const GET_PATIENT_APPOINTMENT_HISTORY = async (_patientID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/appointment/getHistoryOfPatient/${_patientID}`);
      const { result } = response.data;

      return result;
    } catch(error) {
      console.log(error);
    }
  }

  //GET ALL APPOINTMENT
  const GET_ALL_APPOINTMENT = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/appointment/getAll`);
      const { appointments } = response.data;

      return appointments;
    } catch(error) {
      console.log(error);
    }
  }

  //------------------MEDICAL------------------
  //ADD MEDICAL
  const ADD_MEDICAL = async (medical) => {
    console.log(medical);
    try {
      const { symptoms, diagnosis } = medical;

      if (!symptoms || !diagnosis) {
        return notifyError('Data missing');
      } 

      setLoader(true);
      notifySuccess('Registration processing...');

      const accountAddress = await checkMetamask();
      if (accountAddress) {
        const feeResponse = await axios.get('http://localhost:4000/api/medical/getFee');
        const { medicalFee } = feeResponse.data;

        const txResponse = await axios.post('http://localhost:4000/api/medical/add',
          { medical },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const { txData } = txResponse.data;
        
        const signer = await Signer();
        const transaction = await signer.sendTransaction({
          to: MEDICAL_ADDRESS,
          data: txData,
          value: ethers.utils.parseEther(medicalFee),
          gasLimit: ethers.utils.hexlify(8000000)
        });
        await transaction.wait();
        
        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registration complete");
          return transaction.hash;
          window.location.reload();
        }
      }
    } catch(error) {
      setLoader(false);
      console.log(error);
    }
  }

  //GET ALL PATIENT MEDICAL
  const GET_ALL_PATIENT_MEDICAL = async (_patientID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/medical/getMedicalByPatient/${_patientID}`);
      const { medicalArray } = response.data;

      return medicalArray;
    } catch(error) {
      console.log(error);
    }
  }

  //GET MEDICAL DETAIL
  const GET_MEDICAL_DETAIL = async (_medicalID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/medical/${_medicalID}`);
      const { medical } = response.data;

      return medical;
    } catch(error) {
      console.log(error);
    }
  }

  //-------------------TEST-------------------
  //ADD TEST
  const ADD_TEST = async (test) => {
    try {
      const { typeOfTest, result } = test;

      if (!typeOfTest || !result) {
        return notifyError('Data missing');
      } 

      setLoader(true);
      notifySuccess('Registration processing...');

      const accountAddress = await checkMetamask();
      if (accountAddress) {
        const feeResponse = await axios.get('http://localhost:4000/api/test/getFee');
        const { testFee } = feeResponse.data;

        const txResponse = await axios.post('http://localhost:4000/api/test/add',
          { test },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const { txData } = txResponse.data;
        
        const signer = await Signer();
        const transaction = await signer.sendTransaction({
          to: MEDICAL_ADDRESS,
          data: txData,
          value: ethers.utils.parseEther(testFee),
          gasLimit: ethers.utils.hexlify(8000000)
        });
        await transaction.wait();

        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registration complete");

          const provider = signer.provider;
          const testCount = ethers.utils.id('testCount()').slice(0, 10);
          const testCountHex = await provider.call({
            to: MEDICAL_ADDRESS,
            data: testCount
          })
          const testID = ethers.BigNumber.from(testCountHex).toString();
          return testID;
        }
      }
    } catch(error) {
      setLoader(false);
      notifyError('Registration Failed')
      console.log(error);
    }
  }

  //COMPLETE TEST
  const COMPLETE_TEST = async (_testID) => {
    try {
      if (!_testID) return notifyError('Data missing');
      
      setLoader(true);
      notifySuccess('Registration processing...');

      const accountAddress = await checkMetamask();
      if (accountAddress) {
        const feeResponse = await axios.get('http://localhost:4000/api/test/getFee');
        const { testFee } = feeResponse.data;

        const txResponse = await axios.post(`http://localhost:4000/api/test/complete/${_testID}`)

        const { txData } = txResponse.data;
        
        const signer = await Signer();
        const transaction = await signer.sendTransaction({
          to: MEDICAL_ADDRESS,
          data: txData,
          value: ethers.utils.parseEther(testFee),
          gasLimit: ethers.utils.hexlify(8000000)
        });
        await transaction.wait();
        
        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registration complete");
          window.location.reload();
        }
      }
    } catch(error) {
      setLoader(false);
      console.log(error);
    }
  }

  //GET TEST DETAIL
  const GET_TEST_DETAIL = async (_testID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/test/${_testID}`);
      const { testArray } = response.data;

      return testArray;
    } catch(error) {
      console.log(error);
    }
  }

  //GET ALL TEST
  const GET_ALL_TEST = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/test/getAll`);
      const { testArray } = response.data;

      return testArray;
    } catch(error) {
      console.log(error);
    }
  }

  //GET ALL DOCTOR TEST
  const GET_ALL_DOCTOR_TEST = async (_doctorID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/test/getTestOfDoctor/${_doctorID}`);
      const { testArray } = response.data;

      return testArray;
    } catch(error) {
      console.log(error);
    }
  }

  //GET ALL PATIENT TEST
  const GET_ALL_PATIENT_TEST = async (_patientID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/test/getTestOfPatient/${_patientID}`);
      const { testArray } = response.data;

      return testArray;
    } catch(error) {
      console.log(error);
    }
  }

  //-----------------MEDICINE------------------
  //ADD MEDICINE
  const ADD_MEDICINE = async (medicine) => {
    try {
      const response = await axios.post('http://localhost:4000/api/medicine/add',
        { medicine },
        { headers: { 'Content-Type': 'application/json' } }
      )

      const { newMedicine } = response.data;

      notifySuccess("Add new medicine successfully");
      console.log("New Medicine", newMedicine);
    } catch(error) {
      console.log(error);
    }
  }

  //UPDATE MEDICINE PRICE
  const UPDATE_MEDICINE_PRICE = async (_medicineID, _price) => {
    try {
      if (!_medicineID || !_price) {
        return notifyError('Data missing');
      } 

      const response = await axios.get(`http://localhost:4000/api/medicine/updatePrice/${_medicineID}`);
      const { updatePrice } = response.data;

      return updatePrice;
    } catch(error) {
      console.log(error);
    }
  }

  //UPDATE MEDICINE QUANTITY
  const UPDATE_MEDICINE_QUANTITY = async (_medicineID, _quantity) => {
    try {
      if (!_medicineID || !_quantity) {
        return notifyError('Data missing');
      } 

      const response = await axios.get(`http://localhost:4000/api/medicine/updateQuantity/${_medicineID}`);
      const { updateQuantity } = response.data;

      return updateQuantity;
    } catch(error) {
      setLoader(false);
      console.log(error);
    }
  }

  //GET ALL MEDICINE
  const GET_ALL_MEDICINE = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/medicine/getAll`);
      const { medicineArray } = response.data;

      return medicineArray;
    } catch(error) {
      console.log(error);
    }
  }

  //GET MEDICINE DETAIL
  const GET_MEDICINE_DETAIL = async (_medicineID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/medicine/${_medicineID}`);
      const { result } = response.data;

      return result;
    } catch(error) {
      console.log(error);
    }
  }

  //ADD MEDICATION
  const ADD_MEDICATION = async (medication) => {
    console.log(medication)
    try {
      const { dosage, frequency, duration, quantity } = medication;

      if (!dosage || !frequency || !duration || !quantity) {
        return notifyError('Data missing');
      } 

      const response = await axios.post('http://localhost:4000/api/prescription/addMedication',
        { medication },
        { headers: { 'Content-Type': 'application/json' } }
      )
      const { newMedication } = response.data;
      return newMedication;
    } catch(error) {
      setLoader(false);
      console.log(error);
    }
  }

  //ADD PRESCRIPTION
  const ADD_PRESCRIPTION = async (prescription) => {
    try {
      const { medications } = prescription;

      if (!medications) {
        return notifyError('Data missing');
      } 

      setLoader(true);
      notifySuccess('Registration processing...');

      const accountAddress = await checkMetamask();
      if (accountAddress) {
        const txResponse = await axios.post('http://localhost:4000/api/prescription/addPrescription',
          { prescription },
          { headers: { 'Content-Type': 'application/json' } }
        )

        const { txData } = txResponse.data;
        
        const signer = await Signer();
        const transaction = await signer.sendTransaction({
          to: MEDICAL_ADDRESS,
          data: txData,
          gasLimit: ethers.utils.hexlify(8000000)
        });
        await transaction.wait();
        
        if (transaction.hash) {
          setLoader(false);
          notifySuccess("Registration complete");

          const provider = signer.provider;
          const prescriptionCount = ethers.utils.id('prescriptionCount()').slice(0, 10);
          const prescriptionCountHex = await provider.call({
            to: MEDICAL_ADDRESS,
            data: prescriptionCount
          })
          const prescriptionID = ethers.BigNumber.from(prescriptionCountHex).toString();
          return prescriptionID;
        }
      }
    } catch(error) {
      setLoader(false);
      console.log(error);
    }
  }

  //GET MEDICATION BY ID
  const GET_MEDICATION_DETAIL = async (medicationID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/prescription/getMedicationByID`, {params: {medicationID}});
      const { result } = response.data;

      return result;
    } catch(error) {
      console.log(error);
    }
  }

  //GET PRESCRIPTION BY PATIENT
  const GET_PRESCRIPTION_PATIENT = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/prescription/getPrescriptionByPatient`);
      const { result } = response.data;

      return result;
    } catch(error) {
      console.log(error);
    }
  }

  //GET PRESCRIPTION BY PATIENT
  const GET_PRESCRIPTION_DOCTOR = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/prescription/getPrescriptionByDoctor`);
      const { result } = response.data;

      return result;
    } catch(error) {
      console.log(error);
    }
  }

  //GET PRESCRIPTION BY ID
  const GET_PRESCRIPTION_DETAIL = async (prescriptionID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/prescription/getPrescriptionByID`, {params: {prescriptionID}});
      const { result } = response.data;

      return result;
    } catch(error) {
      console.log(error);
    }
  }

  //---------------SCHEDULE----------------
  //CREATE SCHEDULE
  const CREATE_SCHEDULE = async (events) => {
    try {
      const response = await axios.post('http://localhost:4000/api/schedule/create',
        { events },
        { headers: { 'Content-Type': 'application/json' } }
      )
      const { newSchedule } = response.data;

      if (newSchedule) {
        notifySuccess("Add new medicine successfully");
        return newSchedule;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const GET_ALL_SCHEDULE = async (doctor) => {
    try {
      const request = await axios.get('http://localhost:4000/api/schedule/getAll', { params: doctor });
      const { events } = request.data;
      
      return events;
    } catch (error) {
      console.log(error);
    }
  }

  //GET SCHEDULE BY DAY
  const GET_SCHEDULE_BY_DAY = async (day) => {
    try {
      if (!day) return notifyError("Data invalid");

      const request = await axios.get(`http://localhost:4000/api/schedule/getByDay/${day}`);
      const { schedules } = request.data;

      return schedules;
    } catch (error) {
      console.log(error);
    }
  }

  //GET SCHEDULE BY DOCTOR
  const GET_SCHEDULE_BY_DOCTOR = async (doctorID) => {
    try {
      if (!doctorID) return notifyError("Data invalid");

      const request = await axios.get(`http://localhost:4000/api/schedule/getByDoctor/${doctorID}`);
      const { events } = request.data;

      return events;
    } catch (error) {
      console.log(error);
    }
  }

  //GET SCHEDULE VALID
  const GET_SCHEDULE_BY_VALID = async (info) => {
    try {
      const { departmentID, day } = info;
      if (!departmentID || !day) return notifyError("Data invalid");

      const request = await axios.get(`http://localhost:4000/api/schedule/getValid`, {params: info});
      const { validSchedule } = request.data;

      return validSchedule;
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <StateContext.Provider
      value={{
        address,
        setAddress,
        accountBalance,
        setAccountBalance,
        loader,
        setLoader,
        reCall,
        setReCall,
        openComponent,
        setOpenComponent,
        notifySuccess,
        notifyError,
        checkMetamask,
        checkConnected,
        GET_USERNAME_TYPE,
        medicalDetail,
        setMedicalDetail,

        //DEPARTMENT
        ADD_DEPARTMENT,
        ADD_DOCTOR_DEPARTMENT,
        ADD_ROOM,
        GET_ALL_DEPARTMENT,
        GET_ROOM_DEPARTMENT,
        GET_ROOM_BY_ID,

        //DOCTOR
        REGISTER_DOCTOR,
        APPROVE_DOCTOR,
        CHECK_DOCTOR_REGISTRATION,
        GET_ALL_REGISTERED_DOCTOR,
        GET_ALL_APPROVED_DOCTOR,
        GET_DOCTOR_DETAIL,

        //PATIENT
        REGISTER_PATIENT,
        APPROVE_PATIENT,
        CHECK_PATIENT_REGISTRATION,
        GET_ALL_REGISTERED_PATIENT,
        GET_ALL_APPROVED_PATIENT,
        GET_PATIENT_DETAIL,

        //APPOINTMENT
        BOOK_APPOINTMENT,
        APPOINTMENT_PAYMENT,
        APPOINTMENT_CAPTURE,
        COMPLETE_APPOINTMENT,
        CANCEL_APPOINTMENT,
        GET_DOCTOR_APPOINTMENT_HISTORY,
        GET_PATIENT_APPOINTMENT,
        GET_PATIENT_APPOINTMENT_HISTORY,
        GET_ALL_APPOINTMENT,

        //MEDICAL
        ADD_MEDICAL,
        GET_ALL_PATIENT_MEDICAL,
        GET_MEDICAL_DETAIL,

        //TEST
        ADD_TEST,
        COMPLETE_TEST,
        GET_TEST_DETAIL,
        GET_ALL_TEST,
        GET_ALL_DOCTOR_TEST,
        GET_ALL_PATIENT_TEST,

        //MEDICINE
        ADD_MEDICINE,
        UPDATE_MEDICINE_PRICE,
        UPDATE_MEDICINE_QUANTITY,
        GET_ALL_MEDICINE,
        GET_MEDICINE_DETAIL,

        //PRESCRIPTION
        ADD_MEDICATION,
        ADD_PRESCRIPTION,
        GET_MEDICATION_DETAIL,
        GET_PRESCRIPTION_PATIENT,
        GET_PRESCRIPTION_DOCTOR,
        GET_PRESCRIPTION_DETAIL,

        //SCHEDULE
        CREATE_SCHEDULE,
        GET_ALL_SCHEDULE,
        GET_SCHEDULE_BY_DAY,
        GET_SCHEDULE_BY_DOCTOR,
        GET_SCHEDULE_BY_VALID
      }}
    >
      {children}
    </StateContext.Provider>
  )
};



export const useStateContext = () => useContext(StateContext);