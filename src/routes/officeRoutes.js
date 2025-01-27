const express = require('express')
const {
  getOffices,
  getOfficeById,
  createOffice,
  updateOffice,
  deleteOffice,
} = require('../controllers/officeController')
const authenticateToken = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', authenticateToken, getOffices)
router.get('/:id', authenticateToken, getOfficeById)
router.post('/', authenticateToken, createOffice)
router.put('/:id', authenticateToken, updateOffice)
router.delete('/:id', authenticateToken, deleteOffice)

module.exports = router
