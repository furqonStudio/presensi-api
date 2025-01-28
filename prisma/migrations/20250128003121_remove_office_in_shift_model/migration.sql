/*
  Warnings:

  - You are about to drop the column `officeId` on the `Shift` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_officeId_fkey";

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "officeId";
