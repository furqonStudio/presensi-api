const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: {
        id: 'asc',
      },
    })
    res.json(employees)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch employees' })
  }
}

// Get employee by ID
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

    const employeeCount = await prisma.employee.count()
    const id = `EMP${String(employeeCount + 1).padStart(4, '0')}`

    const newEmployee = await prisma.employee.create({
      data: {
        id,
        name,
        position,
        contact,
        officeId,
      },
    })

    res.status(201).json(newEmployee)
  } catch (error) {
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
      where: { id: Number(id) },
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
      where: { id: Number(id) },
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
