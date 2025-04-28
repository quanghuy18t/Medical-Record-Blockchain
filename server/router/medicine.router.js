import express from 'express';
import { 
  addMedicine, 
  getAllMedicine, 
  getMedicineByID, 
  updatePrice, 
  updateQuantity
} from '../controller/medicine.controller.js';

const router = express.Router();

router.post('/add', addMedicine);
router.post('/updatePrice/:medicineID', updatePrice);
router.post('/updateQuantity/:medicineID', updateQuantity);

router.get('/getAll', getAllMedicine);
router.get('/:medicineID', getMedicineByID);

export default router