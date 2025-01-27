const express = require('express')
const employeeRoutes = require('./routes/employeeRoutes')
const { neon } = require('@neondatabase/serverless')

const app = express()

app.use(express.json())

app.get('/', async (_, res) => {
  const sql = neon(`${process.env.DATABASE_URL}`)
  const response = await sql`SELECT version()`
  const { version } = response[0]
  res.json({ version })
})

app.use('/api/employees', employeeRoutes)

module.exports = app
