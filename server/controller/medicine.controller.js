import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { uploadData } from '../utils/index.js';

export const addMedicine = async (req, res, next) => {
  try {
    const { medicine } = req.body;
    const prisma = new PrismaClient();

    const data = {
      name: medicine.name,
      image: medicine.image,
      brand: medicine.brand,
      description: medicine.description,
      manufacturDate: medicine.manufacturDate,
      expiryDate: medicine.expiryDate
    }
    const ipfs_url = await uploadData(data);

    const newMedicine = await prisma.medicine.create({
      data: {
        ipfs: ipfs_url,
        price: Number(medicine.price),
        quantity: Number(medicine.quantity)
      }
    });

    res.status(200).json({ newMedicine });
  } catch (error) {
    next(error);
  }
};

export const updatePrice = async (req, res, next) => {
  try {
    const medicineID = req.params.medicineID;
    const { price } = req.body;
    const prisma = new PrismaClient();

    const updatePrice = await prisma.medicine.update({
      where: { id: medicineID },
      data: { price }
    });

    res.status(200).json({ updatePrice });
  } catch (error) {
    next(error);
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const medicineID = req.params.medicineID;
    const { quantity } = req.body;
    const prisma = new PrismaClient();

    const updateQuantity = await prisma.medicine.update({
      where: { id: medicineID },
      data: { quantity }
    });

    res.status(200).json({ updateQuantity });
  } catch (error) {
    next(error);
  }
};

export const getAllMedicine = async (req, res, next) => {
  try {
    const prisma = new PrismaClient();
    const medicines = await prisma.medicine.findMany();

    const medicineArray = await Promise.all(medicines.map(async (medicine) => {
      const info = await axios.get(medicine.ipfs);

      return {
        ...info.data,
        medicineID: medicine.id,
        price: medicine.price,
        quantity: medicine.quantity
      };
    }));
    res.status(200).json({ medicineArray });
  } catch (error) {
    next(error);
  }
};

export const getMedicineByID = async (req, res, next) => {
  try {
    const medicineID = req.params.medicineID;
    const prisma = new PrismaClient();

    const medicine = await prisma.medicine.findFirst({
      where: { id: medicineID }
    });
    const info = await axios.get(medicine.ipfs);

    const result = {
      ...info.data,
      medicineID: medicine.id,
      price: medicine.price,
      quantity: medicine.quantity
    };

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};