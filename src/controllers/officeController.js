const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Ambil semua karyawan
const getOffices = async (req, res) => {
  try {
    const offices = await prisma.office.findMany({
      orderBy: {
        id: 'asc',
      },
    })
    res.json(offices)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch offices' })
  }
}

// Ambil karyawan berdasarkan ID
const getOfficeById = async (req, res) => {
  try {
    const { id } = req.params
    const office = await prisma.office.findUnique({
      where: { id: Number(id) },
    })

    if (!office) {
      return res.status(404).json({ error: 'Office not found' })
    }

    res.json(office)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch office' })
  }
}

// Tambah karyawan baru
const createOffice = async (req, res) => {
  try {
    const { address, description } = req.body
    const newOffice = await prisma.office.create({
      data: {
        address,
        description,
      },
    })
    res.status(201).json(newOffice)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create office' })
  }
}

// Perbarui data karyawan
const updateOffice = async (req, res) => {
  try {
    const { id } = req.params
    const { address, description, shifts, employees, attendances } = req.body
    const updatedOffice = await prisma.office.update({
      where: { id: Number(id) },
      data: {
        address,
        description,
        shifts,
        employees,
        attendances,
        updatedAt: new Date(),
      },
    })

    if (!updatedOffice) {
      return res.status(404).json({ error: 'Office not found' })
    }

    res.json(updatedOffice)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update office' })
  }
}

// Hapus karyawan
const deleteOffice = async (req, res) => {
  try {
    const { id } = req.params
    const deletedOffice = await prisma.office.delete({
      where: { id: Number(id) },
    })

    if (!deletedOffice) {
      return res.status(404).json({ error: 'Office not found' })
    }

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete office' })
  }
}

module.exports = {
  getOffices,
  getOfficeById,
  createOffice,
  updateOffice,
  deleteOffice,
}
