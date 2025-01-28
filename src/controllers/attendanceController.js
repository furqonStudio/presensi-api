const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get all attendances
const getAllAttendances = async (req, res) => {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        employee: true,
        office: true,
      },
    })
    res.status(200).json(attendances)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create attendance record
const createAttendance = async (req, res) => {
  try {
    const {
      employeeId,
      officeId,
      clockIn,
      clockOut,
      status,
      latitude,
      longitude,
    } = req.body

    const newAttendance = await prisma.attendance.create({
      data: {
        employeeId,
        officeId,
        clockIn: new Date(clockIn),
        clockOut: clockOut ? new Date(clockOut) : null,
        status,
        latitude,
        longitude,
      },
    })

    res.status(201).json(newAttendance)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create attendance' })
  }
}

// Update attendance (e.g., clock out)
const updateAttendance = async (req, res) => {
  const { id } = req.params
  const { clockOut, status } = req.body

  try {
    const updatedAttendance = await prisma.attendance.update({
      where: { id: parseInt(id, 10) },
      data: {
        clockOut: clockOut ? new Date(clockOut) : undefined,
        status,
      },
    })
    res.status(200).json(updatedAttendance)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Delete attendance record
const deleteAttendance = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.attendance.delete({
      where: { id: parseInt(id, 10) },
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllAttendances,
  createAttendance,
  updateAttendance,
  deleteAttendance,
}
