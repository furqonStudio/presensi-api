const express = require('express')
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController')
const authenticateToken = require('../middlewares/authMiddleware')

const router = express.Router()

// router.get('/', authenticateToken, getEmployees)
// router.get('/:id', authenticateToken, getEmployeeById)
// router.post('/', authenticateToken, createEmployee)
// router.put('/:id', authenticateToken, updateEmployee)
// router.delete('/:id', authenticateToken, deleteEmployee)

router.get('/', getEmployees)
router.get('/:id', getEmployeeById)
router.post('/', createEmployee)
router.put('/:id', updateEmployee)
router.delete('/:id', deleteEmployee)

module.exports = router
