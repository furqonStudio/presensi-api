const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Menambahkan User
  // const user = await prisma.user.create({
  //   data: {
  //     username: 'admin',
  //     password: 'admin123',
  //   },
  // })

  // console.log(`User created: ${user.username}`)

  // Menambahkan Office
  const office = await prisma.office.create({
    data: {
      address: 'Jl. Raya No. 123, Jakarta',
      description: 'Kantor Pusat',
    },
  })

  console.log(`Office created: ${office.address}`)

  // Menambahkan Employee
  const employee = await prisma.employee.create({
    data: {
      uniqueCode: 'EMP001',
      name: 'John Doe',
      position: 'Software Engineer',
      contact: '08123456789',
      officeId: office.id,
    },
  })

  console.log(`Employee created: ${employee.name}`)

  // Menambahkan Shift
  const shift = await prisma.shift.create({
    data: {
      officeId: office.id,
      clockIn: new Date('2025-01-28T08:00:00Z'),
      clockOut: new Date('2025-01-28T17:00:00Z'),
    },
  })

  console.log(`Shift created: ${shift.clockIn} - ${shift.clockOut}`)

  // Menambahkan Attendance
  const attendance = await prisma.attendance.create({
    data: {
      employeeId: employee.id,
      officeId: office.id,
      clockIn: new Date('2025-01-28T08:00:00Z'),
      clockOut: new Date('2025-01-28T17:00:00Z'),
      status: 'Present',
    },
  })

  console.log(`Attendance created: ${attendance.status}`)
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
