import express from 'express';
import { 
  approvePatient,
  getAllApproved,
  getAllRegistered,
  getDetailByAddress,
  getDetailByID,
  getRegistrationFee,
  registerPatient 
} from '../controller/patient.controller.js';

const router = express.Router();

router.post('/register', registerPatient);
router.post('/approve/:patientID', approvePatient);

router.get('/getFee', getRegistrationFee);
router.get('/getAllRegistered', getAllRegistered);
router.get('/getAllApproved', getAllApproved);
router.get('/id/:patientID', getDetailByID);
router.get('/address/:pubAdress', getDetailByAddress);

export default router;