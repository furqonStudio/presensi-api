const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get all shifts
const getAllShifts = async (req, res) => {
  try {
    const shifts = await prisma.shift.findMany({
      include: {
        office: true,
      },
    })
    res.status(200).json(shifts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create a new shift
const createShift = async (req, res) => {
  const { officeId, clockIn, clockOut } = req.body

  try {
    const newShift = await prisma.shift.create({
      data: {
        officeId,
        clockIn: new Date(clockIn),
        clockOut: new Date(clockOut),
      },
    })
    res.status(201).json(newShift)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Update a shift
const updateShift = async (req, res) => {
  const { id } = req.params
  const { clockIn, clockOut } = req.body

  try {
    const updatedShift = await prisma.shift.update({
      where: { id: parseInt(id, 10) },
      data: {
        clockIn: new Date(clockIn),
        clockOut: new Date(clockOut),
      },
    })
    res.status(200).json(updatedShift)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Delete a shift
const deleteShift = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.shift.delete({
      where: { id: parseInt(id, 10) },
    })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllShifts,
  createShift,
  updateShift,
  deleteShift,
}
