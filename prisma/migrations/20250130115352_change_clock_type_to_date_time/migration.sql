/*
  Warnings:

  - The `clockOut` column on the `Attendance` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `clockIn` on the `Attendance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "clockIn",
ADD COLUMN     "clockIn" TIMESTAMP(3) NOT NULL,
DROP COLUMN "clockOut",
ADD COLUMN     "clockOut" TIMESTAMP(3);
