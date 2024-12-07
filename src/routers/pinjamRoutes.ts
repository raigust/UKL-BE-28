import express from "express"
import { borrowItem, returnItem, usageReport, borrowAnalysis } from "../controllers/pinjamControllers"
import { verifyPinjam, verifyKembalikan, verifyusage, verifyBorrowAnalysis } from "../middlewares/verifyPinjam"
import { verifyRole, verifyToken } from "../middlewares/authorization"

const app = express()
app.use(express.json())

app.post("/borrow", [verifyToken, verifyRole(["User"]), verifyPinjam], borrowItem);
app.post("/return", [verifyToken, verifyRole(["User"]), verifyKembalikan], returnItem);
app.post("/usagereport", [verifyToken, verifyRole(["Admin"]), verifyusage], usageReport);
app.post("/borrow-analysis", [verifyToken, verifyRole(["Admin"]), verifyBorrowAnalysis], borrowAnalysis );

export default app
