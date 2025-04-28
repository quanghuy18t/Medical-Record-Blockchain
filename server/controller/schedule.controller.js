import { PrismaClient } from "@prisma/client";
import { generateSlots } from "../utils/index.js";
import axios from "axios";

const prisma = new PrismaClient();

export const createSchedule = async (req, res, next) => {
  try {
    const { events } = req.body;

    const newSchedules = await Promise.all(
      events.map(async (event) => {
        const { day, schedules } = event;

        const newSchedules = await Promise.all(schedules.map(async (schedule) => {
          return {
            doctorID: schedule.doctorID,
            roomID: schedule.roomID,
            slots: generateSlots(day, schedule.start, schedule.end)
          }
        }));

        let existingSchedule = await prisma.schedule.findUnique({ where: { day: new Date(day) } });
        if (existingSchedule) {
          return await prisma.schedule.update({
            where: { day: new Date(day) },
            data: { schedules: [...existingSchedule.schedules, ...newSchedules] }
          });
        }
        else {
          return await prisma.schedule.create({
            data: { 
              day: new Date(day), 
              schedules: newSchedules,
            }
          });
        }
      })
    );

    res.status(200).json({ newSchedules });
  } catch (error) {
    next(error);
  }
};

export const getAllSchedule = async (req, res, next) => {
  try {
    const doctor = req.query;
    const schedules = await prisma.schedule.findMany();

    const events = [];

    for (const schedule of schedules) {
      const day = new Date(schedule.day).toISOString().split("T")[0];
      const scheduleData = schedule.schedules;

      for (const sch of scheduleData) {
        const startTime = new Date(sch.slots[0].time);
        const lastSlotTime = new Date(sch.slots[sch.slots.length - 1].time);
        const endTime = new Date(lastSlotTime.getTime() + 30 * 60 * 1000);
        

        const event = {
          id: `${day}-${sch.doctorID}-${startTime.toISOString()}`,
          title: doctor[sch.doctorID].name,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          extendedProps: {
            doctorID: sch.doctorID,
            roomID: sch.roomID,
            specialization: doctor.specialization,
            start: startTime.toISOString(),
            end: endTime.toISOString(),
          },
        };
        events.push(event);
      }
    }

    res.status(200).json({ events });
  } catch (error) {
    next(error);
  }
}

export const getScheduleByDay = async (req, res, next) => {
  try {
    const {day} = req.params;

    const schedules = await prisma.schedule.findMany({
      where: { day: new Date(day) }
    });

    res.status(200).json({ schedules });
  } catch (error) {
    next(error);
  }
};

export const getScheduleByDoctor = async (req, res, next) => {
  try {
    const { doctorID } = req.params;

    const schedules = await prisma.schedule.findMany();

    const events = [];
    for (const schedule of schedules) {
      const day = new Date(schedule.day).toISOString().split("T")[0];
      const scheduleData = schedule.schedules.filter(sch => sch.doctorID === doctorID);
      const room = await prisma.room.findFirst({
        where: { id: scheduleData.roomID }
      })

      for (const sch of scheduleData) {
        const startTime = new Date(sch.slots[0].time);
        const lastSlotTime = new Date(sch.slots[sch.slots.length - 1].time);
        const endTime = new Date(lastSlotTime.getTime() + 30 * 60 * 1000);
        
        const event = {
          id: `${day}-${sch.doctorID}-${startTime.toISOString()}`,
          title: room.name,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          extendedProps: {
            doctorID: sch.doctorID,
            roomID: sch.roomID,
            start: startTime.toISOString(),
            end: endTime.toISOString(),
          },
        };
        events.push(event);
      }
    }

    res.status(200).json({ events });
  } catch (error) {
    next(error);
  }
};

export const getScheduleValid = async (req, res, next) => {
  try {
    const info = req.query;
    const { departmentID, day } = info;
    console.log(info)

    const department = await prisma.department.findFirst({
      where: { id: departmentID },
      select: { doctors: true }
    });
    if (!department) {
      res.status(404).json({ message: "Department does not exist." });
    }

    const schedules = await prisma.schedule.findMany({
      where: {
        day: new Date(day)
      },
      select: {
        schedules: true
      }
    });

    const validSchedule = schedules.flatMap((schedule) => {
      return schedule.schedules.flatMap((entry) =>{
        if (department.doctors.includes(entry.doctorID)) {
          const validSlots = entry.slots.filter((slot) => slot.booked < 3);

          return {
            doctorID: entry.doctorID,
            time: validSlots.map((slot) => slot.time)
          }
        }

        return [];
      })
    });
console.log(validSchedule);
    res.status(200).json({ validSchedule });
  } catch (error) {
    next(error);
  }
};