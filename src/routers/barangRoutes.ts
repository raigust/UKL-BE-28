import express from "express"
import { getAllBarang, createBarang, updateBarang, deleteBarang  } from "../controllers/barangControllers"
import { verifyAddBarang, verifyUpdateBarang } from "../middlewares/verifyBarang"
import { verifyRole, verifyToken } from "../middlewares/authorization"

const app = express()
app.use(express.json())

app.get("/", verifyToken, getAllBarang)
app.post("/", [verifyToken, verifyRole(["Admin"]), verifyAddBarang], createBarang);
app.put("/:id", [verifyToken, verifyRole(["Admin"]), verifyUpdateBarang], updateBarang);
app.delete("/:id", [verifyToken, verifyRole(["Admin"])], deleteBarang);

export default app
