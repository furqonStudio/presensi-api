const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create Offices
  const office1 = await prisma.office.create({
    data: {
      address: 'Jl. Sudirman No.1',
      description: 'Main Office',
      latitude: -6.2,
      longitude: 106.816666,
    },
  })

  const office2 = await prisma.office.create({
    data: {
      address: 'Jl. Thamrin No.2',
      description: 'Branch Office',
      latitude: -6.17511,
      longitude: 106.865036,
    },
  })

  // Create Users
  const user1 = await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin123', // Note: Use hashed passwords in production
    },
  })

  const user2 = await prisma.user.create({
    data: {
      username: 'employee',
      password: 'password123', // Note: Use hashed passwords in production
    },
  })

  // Create Employees
  const employee1 = await prisma.employee.create({
    data: {
      id: 'EMP001',
      name: 'John Doe',
      position: 'Manager',
      contact: '081234567890',
      officeId: office1.id,
    },
  })

  const employee2 = await prisma.employee.create({
    data: {
      id: 'EMP002',
      name: 'Jane Smith',
      position: 'Staff',
      contact: '081987654321',
      officeId: office2.id,
    },
  })

  // Create Shifts
  const shift1 = await prisma.shift.create({
    data: {
      name: 'Morning Shift',
      clockIn: new Date('2025-01-01T08:00:00Z'),
      clockOut: new Date('2025-01-01T16:00:00Z'),
    },
  })

  const shift2 = await prisma.shift.create({
    data: {
      name: 'Evening Shift',
      clockIn: new Date('2025-01-01T16:00:00Z'),
      clockOut: new Date('2025-01-01T00:00:00Z'),
    },
  })

  // Create Attendance
  await prisma.attendance.create({
    data: {
      employeeId: employee1.id,
      officeId: office1.id,
      clockIn: new Date('2025-01-01T08:30:00Z'),
      status: 'On Time',
      latitude: -6.2,
      longitude: 106.816666,
    },
  })

  await prisma.attendance.create({
    data: {
      employeeId: employee2.id,
      officeId: office2.id,
      clockIn: new Date('2025-01-01T16:15:00Z'),
      clockOut: new Date('2025-01-01T23:45:00Z'),
      status: 'Late',
      latitude: -6.17511,
      longitude: 106.865036,
    },
  })

  console.log('Seeding completed.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
