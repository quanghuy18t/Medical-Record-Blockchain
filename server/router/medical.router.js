import express from 'express';
import { addMedical, getMedicalByID, getMedicalByPatient, getMedicaltFee } from '../controller/medical.controller.js';

const router = express.Router();

router.post('/add', addMedical);

router.get('/getFee', getMedicaltFee);
router.get('/getMedicalByPatient/:patientID', getMedicalByPatient);
router.get('/:medicalID', getMedicalByID);

export default router;