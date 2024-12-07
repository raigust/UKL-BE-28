import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import dotenv from "dotenv";
import { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient({ errorFormat: "pretty" });


export const verifyPinjam = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        userId: Joi.number().integer().required(),
        itemId: Joi.number().integer().required(),
        borrowDate: Joi.date().required(),
        returnDate: Joi.date().min(Joi.ref("borrowDate")).required(), // Memastikan returnDate >= borrowDate
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: false,
            message: `Validation error: ${error.message}`,
        });
    }

    return next();
};
export const verifyKembalikan = async (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        borrowId: Joi.number().integer().required(), // ID pinjaman
        returnDate: Joi.date().required(), // Tanggal pengembalian
    });

    // Validasi awal dengan Joi
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: false,
            message: `Validation error: ${error}`,
        });
    }

    const { borrowId, returnDate } = req.body;

    try {
        // Ambil data peminjaman berdasarkan borrowId
        const borrow = await prisma.pinjam.findUnique({
            where: { id: borrowId },
        });

        if (!borrow) {
            return res.status(404).json({
                status: false,
                message: "Data pinjaman tidak ditemukan",
            });
        }

        // Validasi: pastikan returnDate tidak sebelum pinjamDate
        if (new Date(returnDate) < new Date(borrow.pinjamDate)) {
            return res.status(400).json({
                status: false,
                message: "Tanggal pengembalian tidak boleh lebih awal dari tanggal peminjaman",
            });
        }

        // Jika validasi berhasil
        return next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            message: "Terjadi kesalahan saat memvalidasi data",
        });
    }
};
export const verifyusage = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        startDate: Joi.date().required(),
        endDate: Joi.date().min(Joi.ref("startDate")).required(),
        groupBy: Joi.string().valid("category").required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: false,
            message: `Validation error: ${error}`,
        });
    }

    return next();
};
export const verifyBorrowAnalysis = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        start_date: Joi.date().required(),
        end_date: Joi.date().greater(Joi.ref("start_date")).required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: false,
            message: `Validation error: ${error}`,
        });
    }

    return next();
};
