-- DropForeignKey
ALTER TABLE `Bike` DROP FOREIGN KEY `Bike_stationId_fkey`;

-- AlterTable
ALTER TABLE `Bike` MODIFY `stationId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Bike` ADD CONSTRAINT `Bike_stationId_fkey` FOREIGN KEY (`stationId`) REFERENCES `BikeStation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
