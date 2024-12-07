import express from "express"
import { createUser, getAllUser, updateUser, deleteUser, authentication } from "../controllers/loginControllers"
import { verifyAddUser, verifyEditUser } from "../middlewares/verifyUser"
import { userValidation } from "../middlewares/userValidation"

const app = express()
app.use(express.json())

app.get(`/`, getAllUser)
app.post(`/create`, [verifyAddUser], createUser)
app.put(`/:iduser`, [verifyEditUser], updateUser)
app.delete(`/:iduser`, deleteUser)
app.post(`/login`, [userValidation], authentication)

export default app