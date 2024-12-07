import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient({ errorFormat: "pretty" });

// Mengambil semua barang
export const getAllBarang = async (req: Request, res: Response) => {
  try {
    const allBarang = await prisma.inventory.findMany();
    return res.status(200).json({
      status: true,
      data: allBarang,
      message: 'Berikut data barang inventaris',
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: `Error: ${error}`,
    });
  }
};

// Menambahkan barang baru
export const createBarang = async (req: Request, res: Response) => {
  try {
    const { name, category, location, quantity } = req.body;
    const newBarang = await prisma.inventory.create({
      data: { name, category, location, quantity: Number(quantity) },
    });
    return res.status(200).json({
      status: true,
      data: newBarang,
      message: 'Barang berhasil ditambahkan',
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: `Error: ${error}`,
    });
  }
};

// Mengupdate data barang
export const updateBarang = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, location, quantity } = req.body;

    const findBarang = await prisma.inventory.findUnique({
      where: { idinven: Number(id) },
    });
    if (!findBarang) {
      return res.status(404).json({
        status: false,
        message: 'Barang tidak ditemukan',
      });
    }

    const updatedBarang = await prisma.inventory.update({
      where: { idinven: Number(id) },
      data: {
        name: name || findBarang.name,
        category: category || findBarang.category,
        location: location || findBarang.location,
        quantity: quantity ? Number(quantity) : findBarang.quantity,
      },
    });

    return res.status(200).json({
      status: true,
      data: updatedBarang,
      message: 'Barang berhasil diperbarui',
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: `Error: ${error}`,
    });
  }
};

// Menghapus barang
export const deleteBarang = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const findItems = await prisma.inventory.findFirst({ where: { idinven: Number(id) } })
        if (!findItems) return res
            .status(200)
            .json({ status: false, message: 'gada broooooo' })
    const deletedBarang = await prisma.inventory.delete({
      where: { idinven: Number(id) },
    });

    return res.status(200).json({
      status: true,
      data: deletedBarang,
      message: 'Barang berhasil dihapus',
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      message: `Error: ${error}`,
    });
  }
};
