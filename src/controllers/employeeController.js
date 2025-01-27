const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Ambil semua karyawan
const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        id: 'asc',
      },
    })
    res.json(employees)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' })
  }
}

// Ambil karyawan berdasarkan ID
const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params
    const employee = await prisma.employee.findUnique({
      where: { id: Number(id) },
    })

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.json(employee)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' })
  }
}

// Tambah karyawan baru
const createEmployee = async (req, res) => {
  try {
    const { name, contact, position } = req.body
    const newEmployee = await prisma.employee.create({
      data: {
        name,
        contact,
        position,
      },
    })
    res.status(201).json(newEmployee)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' })
  }
}

// Perbarui data karyawan
const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, phone, position } = req.body
    const updatedEmployee = await prisma.employee.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
        phone,
        position,
        updatedAt: new Date(),
      },
    })

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.json(updatedEmployee)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' })
  }
}

// Hapus karyawan
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const deletedEmployee = await prisma.employee.delete({
      where: { id: Number(id) },
    })

    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' })
    }

    res.status(204).send()
  } catch (error) {
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
