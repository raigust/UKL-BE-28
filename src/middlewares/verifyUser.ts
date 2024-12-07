import { NextFunction, Request, Response } from "express";
import Joi from "joi";

// Schema untuk validasi penambahan pengguna
const addUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("Admin", "User").required(),
  })

// Schema untuk validasi pengeditan pengguna
const editUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid("Admin", "User").optional(),
});

// Middleware untuk validasi penambahan pengguna
export const verifyAddUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = addUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details.map((detail) => detail.message).join(", "),
    });
  }
  next();
};

// Middleware untuk validasi pengeditan pengguna
export const verifyEditUser = (req: Request, res: Response, next: NextFunction) => {
  const { error } = editUserSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: false,
      message: error.details.map((detail) => detail.message).join(", "),
    });
  }
  next();
};
