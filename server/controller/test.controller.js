import { convertTimestamp, MedicalContract } from '../utils/index.js';
import { ethers } from 'ethers';

export const addTest = async (req, res, next) => {
  try {
    const { test } = req.body;
    console.log(test);
    const contract = MedicalContract();
    const txData = contract.interface.encodeFunctionData('ADD_TEST', [
      Number(test.patientID),
      test.typeOfTest,
      test.result,
      test.images,
      test.diagnosis,
      test.notes
    ]);

    res.status(200).json({ txData });
  } catch (error) {
    next(error);
  }
};

export const completeTest = async (req, res, next) => {
  try {
    const testID = req.params.testID;
    const { result, images, diagnosis } = req.body;

    const contract = MedicalContract();
    const txData = contract.interface.encodeFunctionData('COMPLETE_TEST', [
      Number(testID),
      result,
      images,
      diagnosis
    ]);

    res.status(200).json({ txData });
  } catch (error) {
    next(error);
  }
};

export const getAllTest = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const tests = await contract.GET_ALL_TEST();

    const testArray = await Promise.all(tests.map(async (test) => {
      return {
        testID: Number(test.id),
        patientID: Number(test.patientID),
        doctorID: Number(test.doctorID),
        typeOfTest: test.typeOfTest,
        date: Number(test.date),
        result: test.result,
        images: test.images,
        diagnosis: test.diagnosis,
        notes: test.notes,
        status: test.status
      };
    }));

    res.status(200).json({ testArray });
  } catch (error) {
    next(error);
  }
};

export const getTestOfDoctor = async (req, res, next) => {
  try {
    const doctorID = req.params.doctorID;

    const contract = MedicalContract();
    const tests = await contract.GET_ALL_DOCTOR_TEST(Number(doctorID));

    const testArray = await Promise.all(tests.map(async (test) => {
      return {
        testID: Number(test.id),
        patientID: Number(test.patientID),
        doctorID: Number(test.doctorID),
        typeOfTest: test.typeOfTest,
        date: Number(test.date),
        result: test.result,
        images: test.images,
        diagnosis: test.diagnosis,
        notes: test.notes,
        status: test.status
      };
    }));

    res.status(200).json({ testArray });
  } catch (error) {
    next(error);
  }
};

export const getTestOfPatient = async (req, res, next) => {
  try {
    const patientID = req.params.doctorID;

    const contract = MedicalContract();
    const tests = await contract.GET_ALL_PATIENT_TEST(Number(patientID));

    const testArray = await Promise.all(tests.map(async (test) => {
      return {
        testID: Number(test.id),
        patientID: Number(test.patientID),
        doctorID: Number(test.doctorID),
        typeOfTest: test.typeOfTest,
        date: Number(test.date),
        result: test.result,
        images: test.images,
        diagnosis: test.diagnosis,
        notes: test.notes,
        status: test.status
      };
    }));

    res.status(200).json({ testArray });
  } catch (error) {
    next(error);
  }
};

export const getTestByID = async (req, res, next) => {
  try {
    const testID = req.params.testID;

    const contract = MedicalContract();
    const test = await contract.GET_TEST_DETAIL(Number(testID));

    const testArray = {
      testID: Number(test.id),
      patientID: Number(test.patientID),
      doctorID: Number(test.doctorID),
      typeOfTest: test.typeOfTest,
      date: convertTimestamp(Number(test.date)),
      result: test.result,
      images: test.images,
      diagnosis: test.diagnosis,
      notes: test.notes,
    };

    res.status(200).json({ testArray });
  } catch (error) {
    next(error);
  }
};

export const getTestFee = async (req, res, next) => {
  try {
    const contract = MedicalContract();
    const fee = await contract.testFee();

    res.status(200).json({ testFee: ethers.formatEther(fee) });
  } catch (error) {
    next(error);
  }
};