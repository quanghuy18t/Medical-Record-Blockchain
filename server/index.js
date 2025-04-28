import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

// import { enrollAdminHosp } from './hybrid/fabric/index.js';

// // Import router
import doctorRoute from './router/doctor.router.js';
import patientRoute from './router/patient.router.js';
import appointmentRoute from './router/appointment.router.js';
import medicalRoute from './router/medical.router.js';
import testRoute from './router/test.router.js';
import medicineRoute from './router/medicine.router.js';
import prescriptionRoute from './router/prescription.router.js';
import scheduleRoute from './router/schedule.router.js';
import departmentRoute from './router/department.router.js';
import { MedicalContract } from './utils/index.js';

const app = express();
dotenv.config();

app.use(cookieParser());
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
app.use(cors());

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})

app.use((error, req, res, next) => {
  const errorStatus = error.status || 500;
  const errorMessage = error.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: error.stack,
  });
});

app.use("/api/doctor", doctorRoute);
app.use("/api/patient", patientRoute);
app.use("/api/appointment", appointmentRoute);
app.use("/api/medical", medicalRoute);
app.use("/api/test", testRoute);
app.use("/api/medicine", medicineRoute);
app.use("/api/prescription", prescriptionRoute);
app.use("/api/schedule", scheduleRoute);
app.use("/api/department", departmentRoute);

app.get("/api/getType/:pubAddress", async (req, res, next) => {
  try {
    const pubAddress = req.params.pubAddress;

    const contract = MedicalContract();
    const user = await contract.GET_USERNAME_TYPE(pubAddress);

    res.status(200).json({
      name: user.name,
      userType: user.userType
    });
  } catch (error) {
    next(error);
  }
});