import express from 'express'
import cors from 'cors'
import pinjam from './routers/pinjamRoutes'
import user from './routers/loginRoutes'
import barang from './routers/barangRoutes'

const PORT: number = 8000
const app = express()
app.use(cors())

app.use(`/pinjam`, pinjam)
app.use(`/user`, user)
app.use(`/barang`, barang)

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`)
})