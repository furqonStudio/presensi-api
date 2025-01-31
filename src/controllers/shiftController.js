const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Create a new shift
const createShift = async (req, res) => {
  const { name, clockIn, clockOut } = req.body

  try {
    const newShift = await prisma.shift.create({
      data: {
        name,
        clockIn: new Date(clockIn),
        clockOut: new Date(clockOut),
      },
    })
    res.status(201).json(newShift)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create shift' })
  }
}

// Get all shifts
const getAllShifts = async (req, res) => {
  try {
    const shifts = await prisma.shift.findMany()
    res.status(200).json(shifts)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve shifts' })
  }
}

// Get a single shift by ID
const getShiftById = async (req, res) => {
  const { id } = req.params

  try {
    const shift = await prisma.shift.findUnique({
      where: { id: Number(id) },
    })

    if (!shift) {
      return res.status(404).json({ error: 'Shift not found' })
    }

    res.status(200).json(shift)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve shift' })
  }
}

// Update a shift by ID
const updateShift = async (req, res) => {
  const { id } = req.params
  const { name, clockIn, clockOut } = req.body

  try {
    const updatedShift = await prisma.shift.update({
      where: { id: Number(id) },
      data: {
        name,
        clockIn: new Date(clockIn),
        clockOut: new Date(clockOut),
      },
    })
    res.status(200).json(updatedShift)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update shift' })
  }
}

// Delete a shift by ID
const deleteShift = async (req, res) => {
  const { id } = req.params

  try {
    const deletedShift = await prisma.shift.delete({
      where: { id: Number(id) },
    })
    res.status(200).json(deletedShift)
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete shift' })
  }
}

module.exports = {
  createShift,
  getAllShifts,
  getShiftById,
  updateShift,
  deleteShift,
}
