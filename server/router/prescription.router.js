import express from 'express';
import { 
  addMedication, 
  addPrescription, 
  getMedicationByID, 
  getPrescriptionByDoctor, 
  getPrescriptionByID, 
  getPrescriptionByPatient
} from '../controller/prescription.controller.js';

const router = express.Router();

router.post('/addMedication', addMedication);
router.post('/addPrescription', addPrescription);

router.get('/getMedicationByID', getMedicationByID);
router.get('/getPrescriptionByPatient', getPrescriptionByPatient);
router.get('/getPrescriptionByDoctor', getPrescriptionByDoctor);
router.get('/getPrescriptionByID', getPrescriptionByID);

export default router;