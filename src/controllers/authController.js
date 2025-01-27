const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db/db')

const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    )

    res
      .status(201)
      .json({ message: 'User registered successfully', user: result.rows[0] })
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' })
  }
}

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body

    const result = await pool.query('SELECT * FROM users WHERE username = $1', [
      username,
    ])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    )

    res.json({ message: 'Login successful', token })
  } catch (error) {
    res.status(500).json({ error: 'Failed to login user' })
  }
}

module.exports = { registerUser, loginUser }
