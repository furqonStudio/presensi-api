require('dotenv').config()
const express = require('express')
const bodyParser = express.json
const authRoutes = require('./routes/authRoutes')
const employeeRoutes = require('./routes/employeeRoutes')
const officeRoutes = require('./routes/officeRoutes')
const attendanceRoutes = require('./routes/attendanceRoutes')
const shiftRoutes = require('./routes/shiftRoutes')

const app = express()

// Middleware untuk parsing body
app.use(bodyParser())

// Route autentikasi
// app.use('/api/auth', authRoutes)

// Route karyawan (dengan proteksi autentikasi)
app.use('/api/employees', employeeRoutes)
app.use('/api/offices', officeRoutes)
app.use('/api/shifts', shiftRoutes)
app.use('/api/attendances', attendanceRoutes)

module.exports = app
