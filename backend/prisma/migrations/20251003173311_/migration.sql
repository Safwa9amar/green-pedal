/*
  Warnings:

  - Added the required column `photo` to the `Bike` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bike` ADD COLUMN `photo` VARCHAR(191) NOT NULL,
    MODIFY `currentLocationLat` DOUBLE NULL,
    MODIFY `currentLocationLng` DOUBLE NULL;
