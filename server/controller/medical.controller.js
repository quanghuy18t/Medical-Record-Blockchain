import { convertTimestamp, MedicalContract } from '../utils/index.js';
import { ethers } from 'ethers';

export const addMedical = async (req, res, next) => {
  try {
    const { medical } = req.body;
    const convertedMedical = {
      ...medical,
      tests: medical.tests.map(Number),
      prescriptions: medical.prescriptions.map(Number)
    };

    const contract = MedicalContract();
    const txData = contract.interface.encodeFunctionData('ADD_MEDICAL', [
      Number(convertedMedical.patientID),
      "ABC Hospital",
      convertedMedical.symptoms,
      convertedMedical.diagnosis,
      convertedMedical.tests,
      convertedMedical.prescriptions
    ]);

    res.status(200).json({ txData });
  } catch (error) {
    next(error);
  }
};

export const getMedicalByPatient = async (req, res, next) => {
  try {
    const patientID = req.params.patientID;

    const contract = MedicalContract();
    const medicals = await contract.GET_ALL_PATIENT_MEDICAL(Number(patientID));
    const medicalArray = await Promise.all(medicals.map(async (medical) => {
      return {
        medicalID: Number(medical.id),
        patientID: Number(medical.patientID),
        doctorID: Number(medical.doctorID),
        hospitalName: medical.hospitalName,
        symptoms: medical.symptoms,
        diagnosis: medical.diagnosis,
        tests: medical.tests.map(Number),
        prescriptions: medical.prescriptions.map(Number),
        date: convertTimestamp(Number(medical.date))
      };
    }));

    res.status(200).json({ medicalArray });
  } catch (error) {
    next(error);
  }
};

export const getMedicalByID = async (req, res, next) => {
  try {
    const medicalID = req.params.medicalID;

    const contract = MedicalContract();
    const medical = await contract.GET_MEDICAL_DETAIL(Number(medicalID));

    res.status(200).json({ medical });
  } catch (error) {
    next(error);
  }
};

export const getMedicaltFee = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const fee = await contract.medicalFee();

    res.status(200).json({ medicalFee: ethers.formatEther(fee) });
  } catch (error) {
    next(error);
  }
};