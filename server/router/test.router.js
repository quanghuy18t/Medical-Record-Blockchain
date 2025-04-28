import express from 'express';
import { 
  addTest,
  completeTest, 
  getAllTest,
  getTestByID,
  getTestFee,
  getTestOfDoctor,
  getTestOfPatient
} from '../controller/test.controller.js';

const router = express.Router();

router.post('/add', addTest);
router.post('/comlete/:testID', completeTest);

router.get('/getFee', getTestFee);
router.get('/getAll', getAllTest);
router.get('/getTestOfDoctor/:doctorID', getTestOfDoctor);
router.get('/getTestOfPatient/:patientID', getTestOfPatient);
router.get('/:testID', getTestByID);

export default router;