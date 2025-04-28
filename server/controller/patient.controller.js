import { ethers } from 'ethers';
import { MedicalContract, uploadData } from '../utils/index.js';
import axios from "axios";

export const registerPatient = async (req, res, next) => {
  try {
    const { patient } = req.body;
    const ipfs_url = await uploadData(patient);

    const contract = MedicalContract();
    const isRegistered = await contract.registeredPatients(patient.walletAddress);
    if (isRegistered) {
      return res.status(400).json({ message: 'Patient is already registered' });
    }

    const txData = contract.interface.encodeFunctionData('ADD_PATIENT', [
      patient.walletAddress,
      patient.name,
      ipfs_url,
      'Patient'
    ]);

    res.status(200).json({ txData });
  } catch (error) {
    next (error);
  }
};

export const approvePatient = async (req, res, next) => {
  try {
    const patientID = req.params.patientID;

    const contract = MedicalContract();
    const patient = await contract.GET_PATIENT_DETAIL(Number(patientID));

    if (patient.isApprove) {
      res.status(400).json({ message: 'Patient is already approved' })
    }

    const txData = contract.interface.encodeFunctionData('APPROVE_PATIENT', [
      Number(patientID)
    ]);

    res.status(200).json({ txData });
  } catch (error) {
    next(error);
  }
};

export const getAllRegistered = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const patients = await contract.GET_ALL_REGISTERED_PATIENT();

    const patientArray = await Promise.all(patients.map(async (patient) => {
      const info = await axios.get(patient.ipfs);

      return {
        ...info.data,
        patientID: Number(patient.id),
        isApprove: patient.isApprove
      };
    }));

    res.status(200).json({ patientArray });
  } catch (error) {
    next(error);
  }
};

export const getAllApproved = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const patients = await contract.GET_ALL_APPROVED_PATIENT();

    const patientArray = await Promise.all(patients.map(async (patient) => {
      const info = await axios.get(patient.ipfs);

      return {
        ...info.data,
        patientID: Number(patient.id),
        isApprove: patient.isApprove
      };
    }));

    res.status(200).json({ patientArray });
  } catch (error) {
    next(error);
  }
};

export const getDetailByID = async (req, res, next) => {
  try {
    const patientID = req.params.patientID;

    const contract = MedicalContract();
    const patient = await contract.GET_PATIENT_DETAIL(Number(patientID));
    const info = await axios.get(patient.ipfs);

    const result = {
      ...info.data,
      patientID: Number(patient.id),
      isApprove: patient.isApprove
    };

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getDetailByAddress = async (req, res, next) => {
  try {
    const pubAdress = req.params.pubAdress;

    const contract = MedicalContract();
    const patientID = await contract.GET_PATIENT_ID(pubAdress);
    const patientDetail = await contract.GET_PATIENT_DETAIL(Number(patientID));
    const info = await axios.get(patientDetail.ipfs);

    const result = {
      ...info.data,
      patientID: Number(patientDetail.id),
      isApprove: patientDetail.isApprove
    }

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getRegistrationFee = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const fee = await contract.registrationPatientFee();

    res.status(200).json({ registrationFee: ethers.formatEther(fee) });
  } catch (error) {
    next(error);
  }
};