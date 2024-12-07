import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import dotenv from "dotenv";
dotenv.config();

export const userValidation = (req: Request, res: Response, next: NextFunction) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(6).required(),
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
