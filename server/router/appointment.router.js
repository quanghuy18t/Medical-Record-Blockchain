import express from 'express';
import { 
  bookAppointment, 
  cancelAppointment, 
  captureOrder, 
  completeAppointment, 
  createOrder, 
  getAllAppointment, 
  getAppointmentByID, 
  getHistoryOfDoctor,
  getHistoryOfPatient
} from '../controller/appointment.controller.js';

const router = express.Router();

router.post('/book', bookAppointment);
router.post('/complete/:appointmentID', completeAppointment);
router.post('/createOrder', createOrder);
router.post('/capture', captureOrder);
router.post('/cancel', cancelAppointment)

router.get('/getAll', getAllAppointment);
router.get('/getHistoryOfDoctor/:doctorID', getHistoryOfDoctor);
router.get('/getHistoryOfPatient/:patientID', getHistoryOfPatient);
router.get('/:appointmentID', getAppointmentByID);

export default router;