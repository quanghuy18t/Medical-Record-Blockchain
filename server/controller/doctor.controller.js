import { ethers } from 'ethers';
import { MedicalContract, uploadData } from '../utils/index.js';
import axios from 'axios';

export const registerDoctor = async (req, res, next) => {
  try {
    const { doctor } = req.body;
    const ipfs_url = await uploadData(doctor);

    const contract = MedicalContract();
    const isRegistered = await contract.registeredDoctors(doctor.walletAddress);
    if (isRegistered) {
      return res.status(400).json({ message: 'Doctor is already registered' });
    }

    const txData = contract.interface.encodeFunctionData('ADD_DOCTOR', [
      doctor.walletAddress,
      doctor.name,
      ipfs_url,
      'Doctor'
    ]);

    res.status(200).json({ txData });
  } catch (error) {
    next(error);
  }
};

export const approveDoctor = async (req, res, next) => {
  try {
    const doctorID = req.params.doctorID;

    const contract = MedicalContract();
    const doctor = await contract.GET_DOCTOR_DETAIL(Number(doctorID));
    if (doctor.isApprove) {
      res.status(400).json({ message: 'Doctor is already approved' })
    }

    const txData = contract.interface.encodeFunctionData('APPROVE_DOCTOR', [
      Number(doctorID)
    ]);

    res.status(200).json({ txData });
  } catch (error) {
    next(error);
  }
};

export const getAllRegistered = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const doctors = await contract.GET_ALL_REGISTERED_DOCTOR();

    const doctorArray = await Promise.all(doctors.map(async (doctor) => {
      const info = await axios.get(doctor.ipfs);

      return {
        ...info.data,
        doctorID: Number(doctor.id),
        appointmentCount: Number(doctor.appointmentCount),
        successfulTreatmentCount: Number(doctor.successfulTreatmentCount),
        availabilities: doctor.availabilities,
        isApprove: doctor.isApprove
      };
    }));

    res.status(200).json({ doctorArray });
  } catch (error) {
    next(error);
  }
};

export const getAllApproved = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const doctors = await contract.GET_ALL_APPROVED_DOCTOR();

    const doctorArray = await Promise.all(doctors.map(async (doctor) => {
      const info = await axios.get(doctor.ipfs);

      return {
        ...info.data,
        doctorID: Number(doctor.id),
        appointmentCount: Number(doctor.appointmentCount),
        successfulTreatmentCount: Number(doctor.successfulTreatmentCount),
        availabilities: doctor.availabilities,
        isApprove: doctor.isApprove
      };
    }));

    res.status(200).json({ doctorArray });
  } catch (error) {
    next(error);
  }
};

export const getDetailByID = async (req, res, next) => {
  try {
    const doctorID = req.params.doctorID;

    const contract = MedicalContract();
    const doctor = await contract.GET_DOCTOR_DETAIL(Number(doctorID));
    const info = await axios.get(doctor.ipfs);

    const result = {
      ...info.data,
      doctorID: Number(doctor.id),
      appointmentCount: Number(doctor.appointmentCount),
      successfulTreatmentCount: Number(doctor.successfulTreatmentCount),
      availabilities: doctor.availabilities,
      isApprove: doctor.isApprove
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
    const doctorID = await contract.GET_DOCTOR_ID(pubAdress);
    const doctorDetail = await contract.GET_DOCTOR_DETAIL(Number(doctorID));
    console.log(doctorDetail)
    const info = await axios.get(doctorDetail.ipfs);

    const result = {
      ...info.data,
      doctorID: Number(doctorDetail.id),
      appointmentCount: Number(doctorDetail.appointmentCount),
      successfulTreatmentCount: Number(doctorDetail.successfulTreatmentCount),
      availabilities: doctorDetail.availabilities,
      isApprove: doctorDetail.isApprove
    };

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getRegistrationFee = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const fee = await contract.registrationDoctorFee();

    res.status(200).json({ registrationFee: ethers.formatEther(fee) });
  } catch (error) {
    next(error);
  }
};