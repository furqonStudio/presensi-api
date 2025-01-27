require('dotenv').config()
const express = require('express')
const bodyParser = express.json
const authRoutes = require('./routes/authRoutes')
const employeeRoutes = require('./routes/employeeRoutes')

const app = express()

// Middleware untuk parsing body
app.use(bodyParser())

// Route autentikasi
app.use('/api/auth', authRoutes)

// Route karyawan (dengan proteksi autentikasi)
app.use('/api/employees', employeeRoutes)

module.exports = app
