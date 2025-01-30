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

// Validate if the clockIn time is later than 08:00 WIB
const isLate = (clockIn) => {
  const clockInTime = new Date(clockIn)
  const lateTime = new Date()
  lateTime.setHours(8, 0, 0, 0) // Set the time to 08:00:00

  return clockInTime > lateTime
}

// Get all attendances
const getAllAttendances = async (req, res) => {
  try {
    const attendances = await prisma.attendance.findMany({
      // include: {
      //   employee: true,
      //   office: true,
      // },
    })
    res.status(200).json(attendances)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Create an attendance (presensi) and validate location
const createAttendance = async (req, res) => {
  const { employeeId, latitude, longitude } = req.body

  if (!employeeId || latitude === undefined || longitude === undefined) {
    return res
      .status(400)
      .json({ error: 'Employee ID and location are required' })
  }

  try {
    // Cek apakah karyawan sudah clock-in hari ini
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        clockIn: {
          gte: today,
        },
      },
    })

    if (existingAttendance) {
      return res
        .status(400)
        .json({ error: 'You have already clocked in today' })
    }

    // Ambil semua kantor dari database
    const offices = await prisma.office.findMany({
      select: { id: true, latitude: true, longitude: true },
    })

    if (!offices.length) {
      return res.status(404).json({ error: 'No office locations found' })
    }

    // Cari kantor dalam radius tertentu (misal 30 meter)
    let nearestOffice = null
    let minDistance = Infinity
    const radius = 30 // 30 meter

    for (const office of offices) {
      const distance = haversineDistance(
        latitude,
        longitude,
        office.latitude,
        office.longitude
      )
      if (distance <= radius && distance < minDistance) {
        nearestOffice = office
        minDistance = distance
      }
    }

    if (!nearestOffice) {
      return res.status(400).json({
        error: 'You must be within 30 meters of an office to clock in',
      })
    }

    const clockInTime = new Date()
    const isEmployeeLate = isLate(clockInTime)

    // Simpan presensi dengan `officeId` dari kantor terdekat
    const newAttendance = await prisma.attendance.create({
      data: {
        employeeId,
        officeId: nearestOffice.id, // Gunakan kantor terdekat
        clockIn: clockInTime,
        status: isEmployeeLate ? 'terlambat' : 'hadir',
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
// const updateAttendance = async (req, res) => {
//   const { id } = req.params
//   const { clockOut, status } = req.body

//   try {
//     const updatedAttendance = await prisma.attendance.update({
//       where: { id: parseInt(id, 10) },
//       data: {
//         clockOut: clockOut ? new Date(clockOut) : undefined,
//         status,
//       },
//     })
//     res.status(200).json(updatedAttendance)
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// }

const updateClockOut = async (req, res) => {
  const { employeeId, latitude, longitude } = req.body

  if (!employeeId || latitude === undefined || longitude === undefined) {
    return res
      .status(400)
      .json({ error: 'Employee ID and location are required' })
  }

  try {
    // Cari absensi hari ini yang sudah memiliki clockIn tetapi belum clockOut
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const attendance = await prisma.attendance.findFirst({
      where: {
        employeeId,
        clockIn: {
          gte: today,
        },
        clockOut: null,
      },
      orderBy: { clockIn: 'desc' },
    })

    if (!attendance) {
      return res
        .status(404)
        .json({ error: 'No clock-in record found for today' })
    }

    const clockOutTime = new Date()

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { clockOut: clockOutTime },
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
  // updateAttendance,
  deleteAttendance,
  updateClockOut,
}
