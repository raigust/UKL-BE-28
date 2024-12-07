import { Request, response, Response } from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const borrowItem = async (req : Request, res : Response) => {
  const { userId, itemId, borrowDate, returnDate } = req.body;

  const findUser = await prisma.user.findFirst({ where: { iduser: Number(userId) } });
        if (!findUser) return res.status(400).json({ status: false, message: `User not found` });

  try {
    
      // Validasi: Pastikan itemId ada
      if (!itemId) {
          return res.status(400).json({
              status: "error",
              message: "ID barang (itemId) wajib diisi",
          });
      }

      // Validasi stok barang
      const inventory = await prisma.inventory.findUnique({
          where: { idinven: itemId },
      });

      if (!inventory) {
          return res.status(404).json({
              status: "error",
              message: "Barang tidak ditemukan",
          });
        }
          if (inventory.quantity < 1) {
            return res.status(400).json({
                status: "error",
                message: "Stok barang tidak mencukupi",
            });
        }
        
        // Kurangi stok barang yang dipinjam
        await prisma.inventory.update({
            where: { idinven: itemId },
            data: {
                quantity: {
                    decrement: 1, // Pastikan stok berkurang sebanyak 1
                },
            },
        });
    

      // Catat peminjaman barang
      const borrow = await prisma.pinjam.create({
          data: {
              userId,
              inventoryId: itemId,
              pinjamDate: new Date(borrowDate),
              kembalikanDate: new Date(returnDate),
          },
      });

      res.status(201).json({
          status: "success",
          message: "Peminjaman berhasil dicatat",
          data: borrow,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          status: "error",
          message: "Terjadi kesalahan",
          error: error,
      });
  }
};

  
export const returnItem = async (req : Request, res : Response) => {
  const { borrowId, returnDate } = req.body;

  try {
      // Validasi: Pastikan borrowId dan returnDate ada
      if (!borrowId || !returnDate) {
          return res.status(400).json({
              status: "error",
              message: "ID pinjaman (borrowId) dan tanggal pengembalian (returnDate) wajib diisi",
          });
      }

      // Periksa apakah pinjaman dengan borrowId ada
      const borrow = await prisma.pinjam.findUnique({
          where: { id: borrowId },
      });

      if (!borrow) {
          return res.status(404).json({
              status: "error",
              message: "Data pinjaman tidak ditemukan",
          });
      }

      // Cek apakah item sudah dikembalikan sebelumnya
      if (borrow.actualReturnDate) {
          return res.status(400).json({
              status: "error",
              message: "Item ini sudah dikembalikan sebelumnya",
          });
      }

      // Update tanggal pengembalian aktual (actualReturnDate)
      const updatedBorrow = await prisma.pinjam.update({
          where: { id: borrowId },
          data: {
              actualReturnDate: new Date(returnDate), // Mapping dari returnDate ke actualReturnDate
              
          }
      });

      // Tambahkan stok barang kembali
      await prisma.inventory.update({
        where: { idinven: updatedBorrow.inventoryId },
        data: {
            quantity: {
                increment: 1, // Tambahkan stok kembali setelah pengembalian
            },
        },
    });
    

      res.status(200).json({
          status: "success",
          message: "Pengembalian berhasil dicatat",
          data: updatedBorrow,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({
          status: "error",
          message: "Terjadi kesalahan",
          error: error,
      });
  }
};

  export const usageReport = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate, groupBy } = req.body;
  
      // Validasi input
      if (!startDate || !endDate || !groupBy) {
        return res.status(400).json({
          status: "error",
          message: "startDate, endDate, dan groupBy harus diisi",
        });
      }
  
      // Validasi nilai groupBy
      const validGroupByFields = ["category"];
      if (!validGroupByFields.includes(groupBy)) {
        return res.status(400).json({
          status: "error",
          message: `groupBy harus salah satu dari: ${validGroupByFields.join(", ")}`,
        });
      }
  
      // Query data dari Prisma
      const groupedData = await prisma.inventory.findMany({
        select: {
          [groupBy]: true, // Menggunakan dynamic key untuk `groupBy`
          _count: {
            select: { Pinjam: true },
          },
          Pinjam: {
            where: {
              pinjamDate: { gte: new Date(startDate), lte: new Date(endDate) },
            },
            select: {
              actualReturnDate: true,
            },
          },
        },
      });
  
      // Format hasil
      const result = groupedData.map((group) => {
        const totalBorrowed = group._count.Pinjam;
        const totalReturned = group.Pinjam.filter((p) => p.actualReturnDate !== null).length;
        const itemsInUse = totalBorrowed - totalReturned;
  
        return {
          group: group[groupBy],
          total_borrowed: totalBorrowed,
          total_returned: totalReturned,
          items_in_use: itemsInUse,
        };
      });
  
      res.json({
        status: "success",
        data: {
          analysis_period: {
            start_date: startDate,
            end_date: endDate,
          },
          usage_analysis: result,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: `Terjadi kesalahan: ${error}`,
      });
    }
  };
  export const borrowAnalysis = async (req: Request, res: Response) => {
    const { start_date, end_date } = req.body;
  
    if (!start_date || !end_date) {
      return res.status(400).json({
        status: "error",
        message: "Harap masukkan `start_date` dan `end_date`",
      });
    }
  
    try {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
  
      // Barang paling sering dipinjam
      const frequentlyBorrowedItems = await prisma.pinjam.groupBy({
        by: ["inventoryId"],
        _count: {
          inventoryId: true,
        },
        where: {
          pinjamDate: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: {
          _count: {
            inventoryId: "desc",
          },
        },
      });
  
      // Barang dengan pengembalian terlambat
      const inefficientItems = await prisma.pinjam.findMany({
        where: {
          pinjamDate: {
            gte: startDate,
            lte: endDate,
          },
          actualReturnDate: {
            not: null,
          },
          AND: [
            {
              actualReturnDate: {
                gt: prisma.pinjam.fields.kembalikanDate, // Perbandingan langsung
              },
            },
          ],
        },
        select: {
          inventoryId: true,
          inventory: {
            select: {
              name: true,
              category: true,
            },
          },
        },
      });
      
  
      // Format data barang paling sering dipinjam
      const frequentlyBorrowedFormatted = frequentlyBorrowedItems.map((item) => ({
        item_id: item.inventoryId,
        name: item.inventoryId || "Unknown",
        category: item.inventoryId || "Unknown",
        total_borrowed: item._count.inventoryId,
      }));
  
      // Format data barang pengembalian terlambat
      const inefficientFormatted = inefficientItems.map((item) => ({
        item_id: item.inventoryId,
        name: item.inventory?.name || "Unknown",
        category: item.inventory?.category || "Unknown",
        total_borrowed: 1, // Sesuaikan jika ada cara menghitung
        total_late_returns: 1, // Sesuaikan jika ada cara menghitung
      }));
  
      // Response
      return res.status(200).json({
        status: "success",
        data: {
          analysis_period: {
            start_date: startDate.toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
          },
          frequently_borrowed_items: frequentlyBorrowedFormatted,
          inefficient_items: inefficientFormatted,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: `Terjadi kesalahan: ${error}`,
      });
    }
  };
  