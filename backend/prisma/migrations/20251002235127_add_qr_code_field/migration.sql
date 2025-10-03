/*
  Warnings:

  - Added the required column `qrCode` to the `Bike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bike` ADD COLUMN `batteryLevel` VARCHAR(191) NULL,
    ADD COLUMN `qrCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `stationName` VARCHAR(191) NULL;
