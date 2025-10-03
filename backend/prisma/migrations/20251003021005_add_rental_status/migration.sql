/*
  Warnings:

  - You are about to alter the column `status` on the `Rental` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Rental` MODIFY `status` ENUM('ACTIVE', 'COMPLETED') NOT NULL DEFAULT 'ACTIVE';
