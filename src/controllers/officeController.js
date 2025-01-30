const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

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

const createOffice = async (req, res) => {
  try {
    const { name, address, description, latitude, longitude } = req.body
    const newOffice = await prisma.office.create({
      data: {
        name,
        address,
        description,
        latitude,
        longitude,
      },
    })
    res.status(201).json(newOffice)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create office' })
  }
}

const updateOffice = async (req, res) => {
  try {
    const { id } = req.params
    const { name, address, description, latitude, longitude } = req.body
    const updatedOffice = await prisma.office.update({
      where: { id: Number(id) },
      data: {
        name,
        address,
        description,
        latitude,
        longitude,
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
