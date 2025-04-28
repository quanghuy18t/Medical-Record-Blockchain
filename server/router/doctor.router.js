import express from 'express';
import { 
  approveDoctor,
  getAllApproved,
  getAllRegistered, 
  getDetailByAddress, 
  getDetailByID, 
  getRegistrationFee, 
  registerDoctor, 
} from '../controller/doctor.controller.js';

const router = express.Router();

router.post('/register', registerDoctor);
router.post('/approve/:doctorID', approveDoctor);

router.get('/getFee', getRegistrationFee);
router.get('/getAllRegistered', getAllRegistered);
router.get('/getAllApproved', getAllApproved);
router.get('/id/:doctorID', getDetailByID);
router.get('/address/:pubAdress', getDetailByAddress);

export default router;