import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET } from "../global";
import dotenv from 'dotenv';
dotenv.config();

interface JwtPayload {
    id: string;
    username: string;
    role: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(403).json({
            message: 'Access denied. No token provided.'
        });
    }

    if (!SECRET) {
        return res.status(500).json({
            message: 'Internal server error. Secret key not configured.'
        });
    }

    try {
        const decoded = verify(token, SECRET) as JwtPayload;
        (req as any).user = decoded; // Simpan user di req, bukan req.body
        next();
    } catch (error) {
        return res.status(401).json({
            message: `Invalid Token: ${error}`
        });
    }
};

export const verifyRole = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user; // Ambil user dari req, bukan req.body

        if (!user) {
            return res.status(403).json({
                message: 'No user information available.'
            });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({
                message: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`
            });
        }

        next();
    };
};
