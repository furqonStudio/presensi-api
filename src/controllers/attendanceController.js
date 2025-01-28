const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Haversine formula to calculate distance between two coordinates (in meters)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000 // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180
  const phi2 = (lat2 * Math.PI) / 180
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in meters
  return distance
}

const isSameDay = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}

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

// Create an attendance (presensi) and validate location
const createAttendance = async (req, res) => {
  const { employeeId, officeId, clockIn, status, latitude, longitude } =
    req.body

  // Validate required fields
  if (
    !employeeId ||
    !officeId ||
    !clockIn ||
    !status ||
    latitude === undefined ||
    longitude === undefined
  ) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    // Get the office coordinates from the database
    const office = await prisma.office.findUnique({
      where: { id: officeId },
      select: { latitude: true, longitude: true },
    })

    if (!office) {
      return res.status(404).json({ error: 'Office not found' })
    }

    // Calculate distance between employee's location and office location
    const distance = haversineDistance(
      latitude,
      longitude,
      office.latitude,
      office.longitude
    )

    // Check if the distance is within 10 meters
    if (distance > 10) {
      return res.status(400).json({
        error: 'You must be within 10 meters of the office to clock in',
      })
    }

    // If the location is valid, create the attendance record
    const newAttendance = await prisma.attendance.create({
      data: {
        employeeId,
        officeId,
        clockIn: new Date(clockIn),
        status,
        latitude,
        longitude,
      },
    })

    res.status(201).json(newAttendance)
  } catch (error) {
    res.status(500).json({ error: error.message })
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

const updateClockOut = async (req, res) => {
  const { id } = req.params
  const { clockOut } = req.body

  // Validasi input
  if (!clockOut) {
    return res.status(400).json({ error: 'clockOut is required' })
  }

  try {
    // Ambil data attendance berdasarkan ID
    const attendance = await prisma.attendance.findUnique({
      where: { id: parseInt(id, 10) },
      select: { clockIn: true },
    })

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance not found' })
    }

    // Periksa apakah clockOut berada di hari yang sama dengan clockIn
    const clockInDate = new Date(attendance.clockIn)
    const clockOutDate = new Date(clockOut)

    if (!isSameDay(clockInDate, clockOutDate)) {
      return res
        .status(400)
        .json({ error: 'clockOut must be on the same day as clockIn' })
    }

    // Update attendance dengan clockOut
    const updatedAttendance = await prisma.attendance.update({
      where: { id: parseInt(id, 10) },
      data: {
        clockOut: new Date(clockOut),
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
  updateClockOut,
}
