import express from 'express';
import { 
  createSchedule,
  getAllSchedule,
  getScheduleByDay,
  getScheduleByDoctor,
  getScheduleValid
} from '../controller/schedule.controller.js';

const router = express.Router();

router.post('/create', createSchedule);

router.get('/getAll', getAllSchedule);
router.get('/getByDay/:day', getScheduleByDay);
router.get('/getByDoctor/:doctorID', getScheduleByDoctor);
router.get('/getValid', getScheduleValid);

export default router;