const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Helper function untuk konversi waktu string ke objek Time
const convertToTime = (timeString) => {
  const [hours, minutes] = timeString.split(':')
  // Set only hours and minutes, ignore date and seconds
  return `${hours}:${minutes}`
}

// Get all shifts
const getAllShifts = async (req, res) => {
  try {
    const shifts = await prisma.shift.findMany()
    res.status(200).json(shifts)
  } catch (error) {
    console.error('Error fetching shifts:', error)
    res.status(500).json({ error: 'Failed to retrieve shifts' })
  }
}

// Create a new shift
const createShift = async (req, res) => {
  const { name, clockIn, clockOut } = req.body

  // Validasi input
  if (!name || !clockIn || !clockOut) {
    return res
      .status(400)
      .json({ error: 'Name, clockIn, and clockOut are required' })
  }

  // Validasi waktu format HH:mm
  const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/
  if (!timePattern.test(clockIn) || !timePattern.test(clockOut)) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:mm' })
  }

  try {
    const newShift = await prisma.shift.create({
      data: {
        name,
        clockIn: convertToTime(clockIn), // Store only the time (HH:mm)
        clockOut: convertToTime(clockOut), // Store only the time (HH:mm)
      },
    })
    res.status(201).json(newShift)
  } catch (error) {
    console.error('Error creating shift:', error)
    res.status(500).json({ error: 'Failed to create shift' })
  }
}

// Update a shift
const updateShift = async (req, res) => {
  const { id } = req.params
  const { name, clockIn, clockOut } = req.body

  // Validasi input
  if (!name || !clockIn || !clockOut) {
    return res
      .status(400)
      .json({ error: 'Name, clockIn, and clockOut are required' })
  }

  // Validasi waktu format HH:mm
  const timePattern = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/
  if (!timePattern.test(clockIn) || !timePattern.test(clockOut)) {
    return res.status(400).json({ error: 'Invalid time format. Use HH:mm' })
  }

  try {
    const updatedShift = await prisma.shift.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        clockIn: convertToTime(clockIn), // Store only the time (HH:mm)
        clockOut: convertToTime(clockOut), // Store only the time (HH:mm)
      },
    })
    res.status(200).json(updatedShift)
  } catch (error) {
    console.error('Error updating shift:', error)
    res.status(500).json({ error: 'Failed to update shift' })
  }
}

// Delete a shift
const deleteShift = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.shift.delete({
      where: { id: parseInt(id, 10) },
    })
    res.status(204).send() // No content
  } catch (error) {
    console.error('Error deleting shift:', error)
    res.status(500).json({ error: 'Failed to delete shift' })
  }
}

module.exports = {
  getAllShifts,
  createShift,
  updateShift,
  deleteShift,
}
