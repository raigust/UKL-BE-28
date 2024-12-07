import { Request, Response } from "express";
import { PrismaClient  } from "@prisma/client";
import { SECRET } from "../global";
import { sign } from "jsonwebtoken";
import md5 from "md5";
require('dotenv').config();

const prisma = new PrismaClient({ errorFormat: "pretty"})

export const getAllUser = async (request: Request, response: Response) => {
    try {
        const { search } = request.query;
        const allUsers = await prisma.user.findMany({
            where: { username: { contains: search?.toString() || "" } }
        });
        return response.status(200).json({
            status: true,
            data: allUsers,
            message: `Users have been retrieved`
        });
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `There is an error. ${error}`
        });
    }
};

export const createUser = async (req: Request, res: Response) => {
    try {
        const { username, password, role } = req.body;

        const newUser = await prisma.user.create({
            data: { username, password: md5(password),role }
        })

        return res.status(200).json({
            status: true,
            data: newUser,
            message: 'New user has been created'
        })
        
    } catch (error) {
        return res.status(400).json({
            status: false,
            message: `nama harus berbeda`
        })
    }
}

export const updateUser = async (request: Request, response: Response) => {
    try {
        const { iduser } = request.params;
        const { username, password, role } = request.body;

        const findUser = await prisma.user.findFirst({ where: { iduser: Number(iduser) } });
        if (!findUser) return response.status(404).json({ status: false, message: `User not found` });

        const updatedUser = await prisma.user.update({
            data: {
                username: username || findUser.username,
                password: password ? md5(password) : findUser.password,
                role: role || findUser.role
            },
            where: { iduser: Number(iduser) }
        })

        return response.status(200).json({
            status: true,
            data: updatedUser,
            message: `User has been updated`
        })
    } catch (error) {
        return response.status(400).json({
            status: false,
            message: `nama harus berbeda`
        })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { iduser } = req.params;
  
    // Cari apakah user ada
    const findUser = await prisma.user.findFirst({
      where: { iduser: Number(iduser) },
    });
  
    if (!findUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }
  
    // Hapus entitas yang berhubungan dengan user (misalnya Pinjam)
    await prisma.pinjam.deleteMany({
      where: { userId: Number(iduser) },
    });
  
    // Sekarang hapus user
    await prisma.user.delete({
      where: { iduser: Number(iduser) },
    });
  
    return res.json({
      status: true,
      message: "User deleted successfully",
    });
  };

export const authentication = async (request: Request, response: Response) => {
try {
    const { username, password } = request.body;

    const findUser = await prisma.user.findFirst({
        where: { username, password: md5(password) },
    })

    if (!findUser)
        return response
        .status(200)
        .json({
            status: false,
            logged: false,
            message: `Email or password is salah maseh`,
        })
        let data = {
            id: findUser.iduser,
            username: findUser.username,
            role: findUser.role
        }
        let payload = JSON.stringify(data)//menyiapkan data yang dijadikan tokem
        let token = sign(payload, SECRET || "token")

        return response
        .status(200)
            .json({ status: true, logged: true, message: `Login berhasil`, token })
    } catch (error) {
        return response
        .json({
            status: false,
            message: `Ada error. ${error}`,
        })
        .status(400)
    }
}

