/*
  Warnings:

  - The primary key for the `BalanceTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Bike` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BikeLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BikeStation` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `Bike` DROP FOREIGN KEY `Bike_stationId_fkey`;

-- DropForeignKey
ALTER TABLE `BikeLocation` DROP FOREIGN KEY `BikeLocation_bikeId_fkey`;

-- DropForeignKey
ALTER TABLE `Rental` DROP FOREIGN KEY `Rental_bikeId_fkey`;

-- AlterTable
ALTER TABLE `BalanceTransaction` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Bike` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `stationId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `BikeLocation` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `bikeId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `BikeStation` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Rental` MODIFY `bikeId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Bike` ADD CONSTRAINT `Bike_stationId_fkey` FOREIGN KEY (`stationId`) REFERENCES `BikeStation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BikeLocation` ADD CONSTRAINT `BikeLocation_bikeId_fkey` FOREIGN KEY (`bikeId`) REFERENCES `Bike`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_bikeId_fkey` FOREIGN KEY (`bikeId`) REFERENCES `Bike`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
