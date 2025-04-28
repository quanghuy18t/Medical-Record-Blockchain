import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const addDepartment = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newDepartment = await prisma.department.create({
      data: { name }
    });

    res.status(200).json({ newDepartment });
  } catch (error) {
    next(error);
  }
};

export const addDoctor = async (req, res, next) => {
  try {
    const {departmentName, doctorID} = req.body;

    const result = await prisma.department.update({
      where: {name: departmentName},
      data: {
        doctors: { push: doctorID.toString() }
      }
    });

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

export const getAllDepartment = async (req, res, next) => {
  try {
    const departments = await prisma.department.findMany({
      include: {rooms: true}
    });

    res.status(200).json({ departments });
  } catch (error) {
    next(error);
  }
};

export const addRoom = async (req, res, next) => {
  try {
    const { departmentID } = req.params;
    const { name } = req.body;

    const newRoom = await prisma.room.create({
      data: {
        departmentID,
        name
      }
    });

    res.status(200).json({ newRoom });
  } catch (error) {
    next(error);
  }
};

export const getRoomByDepartment = async (req, res, next) => {
  try {
    const { name } = req.params;

    const department = await prisma.department.findFirst({
      where: {name}
    })

    const rooms = await prisma.room.findMany({
      where: { departmentID: department.id }
    });

    res.status(200).json({ rooms });
  } catch (error) {
    next(error);
  }
};

export const getRoomByID = async (req, res, next) => {
  try {
    const { roomID } = req.params;

    const room = await prisma.room.findFirst({
      where: {id: roomID}
    });

    res.status(200).json({ room });
  } catch (error) {
    next(error);
  }
};