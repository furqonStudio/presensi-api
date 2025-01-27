const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  host: process.env.NEON_DB_HOST,
  user: process.env.NEON_DB_USER,
  password: process.env.NEON_DB_PASSWORD,
  database: process.env.NEON_DB_DATABASE,
  port: process.env.NEON_DB_PORT,
  ssl: { rejectUnauthorized: false },
})

module.exports = pool
