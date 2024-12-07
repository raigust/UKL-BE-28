import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Schema untuk menambahkan barang
const addBarangSchema = Joi.object({
  name: Joi.string().min(3).required(),
  category: Joi.string().valid("elektronik","nonElektronik").required(),
  location: Joi.string().min(3).required(),
  quantity: Joi.number().integer().min(1).required()
  })

// Schema untuk memperbarui data barang
const updateBarangSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  category: Joi.string().valid("elektronik","nonElektronik").optional(),
  location: Joi.string().min(3).optional(),
  quantity: Joi.number().integer().min(1).optional(),
  })

// Middleware untuk verifikasi penambahan barang
export const verifyAddBarang = (req: Request, res: Response, next: NextFunction) => {
  const { error } = addBarangSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(", "), // Gabungkan pesan error
    });
  }
  return next();
};

// Middleware untuk verifikasi pembaruan barang
export const verifyUpdateBarang = (req: Request, res: Response, next: NextFunction) => {
  const { error } = updateBarangSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details.map((it) => it.message).join(", "), // Gabungkan pesan error
    });
  }
  return next();
};
