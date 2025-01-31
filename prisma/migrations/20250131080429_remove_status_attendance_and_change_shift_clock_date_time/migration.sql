/*
  Warnings:

  - You are about to drop the column `status` on the `Attendance` table. All the data in the column will be lost.
  - Changed the type of `clockIn` on the `Shift` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `clockOut` to the `Shift` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "clockIn",
ADD COLUMN     "clockIn" TIMESTAMP(3) NOT NULL,
DROP COLUMN "clockOut",
ADD COLUMN     "clockOut" TIMESTAMP(3) NOT NULL;
