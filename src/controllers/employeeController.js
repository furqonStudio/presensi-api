const pool = require('../db/db')

const getEmployees = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees ORDER BY id ASC')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' })
  }
}

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [
      id,
    ])
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' })
  }
}

const createEmployee = async (req, res) => {
  try {
    const { name, contact, position } = req.body
    const result = await pool.query(
      'INSERT INTO employees (name, position, contact) VALUES ($1, $2, $3) RETURNING *',
      [name, position, contact]
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' })
  }
}

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const { name, contact, position } = req.body
    const result = await pool.query(
      'UPDATE employees SET name = $1, position = $2, contact = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [name, position, contact, id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' })
    }
    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' })
  }
}

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query(
      'DELETE FROM employees WHERE id = $1 RETURNING *',
      [id]
    )
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' })
    }
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' })
  }
}

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
}
