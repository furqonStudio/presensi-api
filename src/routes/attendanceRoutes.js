const express = require('express')
const {
  getAllAttendances,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} = require('../controllers/attendanceController')

const router = express.Router()

router.get('/', getAllAttendances)
router.post('/', createAttendance)
router.put('/:id', updateAttendance)
router.delete('/:id', deleteAttendance)

module.exports = router
