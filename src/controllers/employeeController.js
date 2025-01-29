const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany()
    res.json(employees)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch employees' })
  }
}

// Get employee by uniqueCode
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await prisma.employee.findUnique({
      where: { id: id }, // Menggunakan id yang bertipe String
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.json(employee)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch employee' })
  }
}

// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const { name, position, contact, officeId } = req.body

    if (!name || !contact || !position || !officeId) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    // Ambil tanggal sekarang
    const now = new Date()
    const day = String(now.getDate()).padStart(2, '0') // 2 digit hari
    const month = String(now.getMonth() + 1).padStart(2, '0') // 2 digit bulan (getMonth mulai dari 0)
    const year = now.getFullYear() // 4 digit tahun

    // Format tanggal: DDMMYYYY
    const today = `${day}${month}${year}`

    // Hitung jumlah karyawan yang dibuat hari ini
    const employeeCount = await prisma.employee.count({
      where: {
        createdAt: {
          gte: new Date(now.setHours(0, 0, 0, 0)), // Awal hari
          lt: new Date(now.setHours(23, 59, 59, 999)), // Akhir hari
        },
      },
    })

    // Nomor urut (misal: 0001, 0002, dst.)
    const sequence = String(employeeCount + 1).padStart(4, '0')

    // ID unik: KDDMMYYYYXXXX
    const employeeId = `K${today}${sequence}`

    const newEmployee = await prisma.employee.create({
      data: {
        id: employeeId,
        name,
        position,
        contact,
        officeId,
      },
    })

    res.status(201).json(newEmployee)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create employee' })
  }
}

// Update employee data
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const { name, contact, position, officeId } = req.body

    // Validate input
    if (!name || !contact || !position || !officeId) {
      return res.status(400).json({ error: 'All fields are required' })
    }

    const updatedEmployee = await prisma.employee.update({
      where: { id: id }, // Menggunakan id (uniqueCode) untuk pencarian
      data: {
        name,
        contact,
        position,
        officeId, // Assuming officeId is a required field
        updatedAt: new Date(),
      },
    })

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.json(updatedEmployee)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to update employee' })
  }
}

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const deletedEmployee = await prisma.employee.delete({
      where: { id: id }, // Menggunakan id (uniqueCode) untuk pencarian
    })

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to delete employee' })
  }
}

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
}
