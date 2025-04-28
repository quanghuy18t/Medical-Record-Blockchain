import express from 'express';
import { 
  addDepartment, 
  addDoctor, 
  addRoom, 
  getAllDepartment, 
  getRoomByDepartment,
  getRoomByID
} from '../controller/department.controller.js';

const router = express.Router();

router.post('/add', addDepartment);
router.post('/addDoctor', addDoctor);
router.post('/addRoom/:departmentID', addRoom);

router.get('/getAll', getAllDepartment);
router.get('/getRoom/:name', getRoomByDepartment);
router.get('/getRoomID/:roomID', getRoomByID);

export default router;