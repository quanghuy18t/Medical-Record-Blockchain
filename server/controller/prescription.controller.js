import { PrismaClient } from '@prisma/client';
import { convertTimestamp, MedicalContract, uploadData } from '../utils/index.js';
import axios from 'axios';

export const addMedication = async (req, res, next) => {
  try {
    const { medication } = req.body; 
    const prisma = new PrismaClient();

    const medicine = await prisma.medicine.findFirst({
      where: { id: medication.medicineID }
    });

    if (medicine.quantity < medication.quantity) {
      res.status(404).json({ message: "Not enough quantity to add medication" });
    }

    await prisma.medicine.update({
      where: { id: medicine.id },
      data: { quantity: (medicine.quantity - medication.quantity) }
    });

    const newMedication = await prisma.medication.create({
      data: medication
    });

    res.status(200).json({ newMedication });
  } catch (error) {
    next(error);
  }
};

export const getMedicationByID = async (req, res, next) => {
  try {
    const { medicationID } = req.query;
    const prisma = new PrismaClient();

    const medication = await prisma.medication.findUnique({
      where: { id: medicationID },
      include: { medicine: true }
    })

    const medicine = await axios.get(medication.medicine.ipfs);
    const result = {
      ...medication,
      medicine: {
        ...medicine.data
      }
    }

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const addPrescription = async (req, res, next) => {
  try {
    const { prescription } = req.body;
console.log(prescription);
    const contract = MedicalContract();
    const txData = contract.interface.encodeFunctionData('ADD_PRESCRIPTION', [
      Number(prescription.patientID),
      prescription.medications
    ]);

    res.status(200).json({ txData });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionByPatient = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const prescriptions = await contract.GET_PRESCRIPTION_OF_PATIENT();

    const result = await Promise.all(prescriptions.map(async (prescription) => {
      return {
        prescriptionID: Number(prescription.id),
        patientID: Number(prescription.patientID),
        doctorID: Number(prescription.doctorID),
        medications: prescription.medications,
        date: Number(prescription.date)
      };
    }));

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionByDoctor = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const prescriptions = await contract.GET_PRESCRIPTION_OF_DOCTOR();

    const result = await Promise.all(prescriptions.map(async (prescription) => {
      return {
        prescriptionID: Number(prescription.id),
        patientID: Number(prescription.patientID),
        doctorID: Number(prescription.doctorID),
        medications: prescription.medications,
        date: Number(prescription.date)
      };
    }));

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getPrescriptionByID = async (req, res, next) => {
  try {
    const { prescriptionID } = req.query;

    const contract = MedicalContract();
    const prescription = await contract.GET_PRESCRIPTION_DETAIL(Number(prescriptionID));

    const result = {
      prescriptionID: Number(prescription.id),
      patientID: Number(prescription.patientID),
      doctorID: Number(prescription.doctorID),
      medications: prescription.medications,
      date: convertTimestamp(Number(prescription.date))
    };

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
}