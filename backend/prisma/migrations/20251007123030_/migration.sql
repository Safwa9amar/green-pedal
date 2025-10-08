/*
  Warnings:

  - Made the column `icon` on table `BikeSpecs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `BikeSpecs` MODIFY `icon` VARCHAR(191) NOT NULL DEFAULT 'speedometer';
