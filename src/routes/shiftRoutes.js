const express = require('express')
const {
  getAllShifts,
  createShift,
  updateShift,
  deleteShift,
} = require('../controllers/shiftController')

const router = express.Router()

router.get('/', getAllShifts)
router.post('/', createShift)
router.put('/:id', updateShift)
router.delete('/:id', deleteShift)

module.exports = router
