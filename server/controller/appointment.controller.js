import axios from 'axios';
import { convertTimestamp, getAccessToken, MedicalContract } from '../utils/index.js';
import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const bookAppointment = async (req, res, next) => {
  try {
    const { doctorID, patientID, day, time } = req.body;

    const schedule = await prisma.schedule.findFirst({
      where: { day: new Date(day) }
    });
    if (!schedule) {
      return res.status(404).json({ message: "No schedule found for this day" });
    }

    let availableRooms = schedule.schedules.filter(
      (s) => s.doctorID === doctorID
    );
    if (availableRooms.length === 0) {
      return res.status(404).json({ message: "Doctor not available on this day" });
    }

    availableRooms.sort((a, b) => {
      const bookedA = a.slots.reduce((sum, slot) => sum + slot.booked, 0);
      const bookedB = b.slots.reduce((sum, slot) => sum + slot.booked, 0);
      return bookedA - bookedB;
    })

    let selectRoom = null;
    let selectedSlotIndex = -1;

    for (const room of availableRooms) {
      selectedSlotIndex = room.slots.findIndex((slot) => 
        (slot.time === time) && (slot.booked < 3 || slot.booked % 3 > 0)
      );

      if (selectedSlotIndex !== -1) {
        selectRoom = room;
        break;
      }
    }
    
    if (!selectRoom) {
      return res.status(404).json({ message: "No available slots for this time" });
    }

    const updateSchedule = schedule.schedules.map((s) => {
      if (s.doctorID === selectRoom.doctorID && s.roomID === selectRoom.roomID) {
        const updateSlots = s.slots.map((slot) => {
          if (slot.time === time) {
            return {
              ...slot,
              booked: slot.booked + 1
            };
          }
          return slot;
        });

        return { ...s, slots: updateSlots };
      };

      return s;
    });

    await prisma.schedule.update({
      where: { id: schedule.id },
      data: { schedules: updateSchedule }
    });

    const updatedRoom = updateSchedule.find(
      (s) => s.doctorID === selectRoom.doctorID && s.roomID === selectRoom.roomID
    );
    
    const updatedSlot = updatedRoom?.slots.find(
      (slot) => new Date(slot.time).getTime() === new Date(time).getTime()
    );
    const slotIndex = (new Date(time).getUTCHours() > 13) ? selectedSlotIndex + 8 : selectedSlotIndex;

    const newAppointment = await prisma.appointment.create({
      data: {
        patientID,
        doctorID,
        roomID: updatedRoom.roomID,
        day: new Date(day),
        time,
        queueNo: slotIndex * 3 + updatedSlot.booked,
      }
    })

    res.status(200).json({ newAppointment });
  } catch (error) {
    next(error);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const access_token = await getAccessToken();

    const response = await axios.post(
      `${process.env.PAYPAL_BASEURL}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [{
          items: [{
            name: 'Medical-Network',
            description: 'Appointment Cost',
            quantity: '1',
            unit_amount: {
              currency_code: 'USD',
              value: "20.00"
            }
          }],
          amount: {
            currency_code: 'USD',
            value: '20.00',
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: '20.00'
              }
            }
          }
        }],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              payment_method_selected: "PAYPAL",
              brand_name: "Medical - Network",
              shipping_preference: "NO_SHIPPING",
              locale: "en-US",
              user_action: "PAY_NOW",
            }
          }
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    const orderID = response.data.id;
    res.status(200).json({ orderID });
  } catch (error) {
    next(error);
  }
};

export const captureOrder = async (req, res, next) => {
  try {
    const { orderID, appointmentID } = req.body;
    const access_token = await getAccessToken();

    const response = await axios.post(
      `${process.env.PAYPAL_BASEURL}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`
        }
      }
    );

    if (response.data.status === 'COMPLETED') {
      const update = await prisma.appointment.update({
        where: { id: appointmentID },
        data: { payment: true }
      });

      res.status(200).json({ update });
    }
    else {
      res.status(400).json({ message: 'Payment failed' });
    }

  } catch (error) {
    next(error);
  }
}

export const completeAppointment = async (req, res, next) => {
  try {
    const appointmentID = req.params.appointmentID;

    const update = await prisma.appointment.update({
      where: { id: appointmentID },
      data: { status: 'completed' }
    });

    res.status(200).json({ update });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const { appointmentID } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentID }
    });
    const schedule = await prisma.schedule.findFirst({
      where: { day: new Date(appointment.day) }
    })

    const targetRoom = schedule.schedules.find(
      (s) => s.doctorID === appointment.doctorID && s.roomID === appointment.roomID
    );

    const updatedSchedules = schedule.schedules.map((s) => {
      if (s.doctorID === appointment.doctorID && s.roomID === appointment.roomID) {
        const updatedSlots = s.slots.map((slot) => {
          if (new Date(slot.time).getTime() === new Date(appointment.time).getTime()) {
            return {
              ...slot,
              booked: Math.max(0, slot.booked - 1),
            };
          }
          return slot;
        });
        return { ...s, slots: updatedSlots };
      }
      return s;
    });
    await prisma.schedule.update({
      where: { id: schedule.id },
      data: { schedules: updatedSchedules },
    });

    const update = await prisma.appointment.update({
      where: { id: appointmentID },
      data: { status: 'cancelled' }
    })

    res.status(200).json({ update });
  } catch (error) {
    next (error);
  }
};

export const getHistoryOfDoctor = async (req, res, next) => {
  try {
    const doctorID = req.params.doctorID;

    const appointments = await prisma.appointment.findMany({
      where: { doctorID }
    })

    const contract = MedicalContract();

    const result = await Promise.all(appointments.map(async (appointment) => {
      const patient = await contract.GET_PATIENT_DETAIL(Number(appointment.patientID));
      const info = await axios.get(patient.ipfs);

      return {
        ...appointment,
        ...info.data
      }
    }))

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentByID = async (req, res, next) => {
  try {
    const appointmentID = req.params.appointmentID;

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentID }
    })

    res.status(200).json({ appointment });
  } catch (error) {
    next(error);
  }
};

export const getHistoryOfPatient = async (req, res, next) => {
  try {
    const patientID = req.params.patientID;

    const result = await prisma.appointment.findMany({
      where: {patientID}
    })

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getAllAppointment = async (req, res, next) => {
  try {
    const appointments = await prisma.appointment.findMany();

    res.status(200).json({ appointments });
  } catch (error) {
    next(error);
  }
};