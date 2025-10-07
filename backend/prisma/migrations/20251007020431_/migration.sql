/*
  Warnings:

  - You are about to alter the column `type` on the `BalanceTransaction` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to drop the `Recharge` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `BalanceTransaction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bikeStationId]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `method` to the `BalanceTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentId` to the `BalanceTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `BalanceTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Recharge` DROP FOREIGN KEY `Recharge_userId_fkey`;

-- AlterTable
ALTER TABLE `BalanceTransaction` ADD COLUMN `method` VARCHAR(191) NOT NULL,
    ADD COLUMN `paymentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    MODIFY `type` ENUM('RECHARGE', 'DEDUCTION') NOT NULL;

-- AlterTable
ALTER TABLE `Bike` ADD COLUMN `batteryTime` VARCHAR(191) NULL,
    ADD COLUMN `maxDistance` VARCHAR(191) NULL,
    ADD COLUMN `maxLoad` VARCHAR(191) NULL,
    ADD COLUMN `maxSpeed` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `BikeStation` ADD COLUMN `photoUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `File` ADD COLUMN `bikeStationId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Recharge`;

-- CreateTable
CREATE TABLE `BikeSpecs` (
    `id` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `bikeID` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `BalanceTransaction_paymentId_key` ON `BalanceTransaction`(`paymentId`);

-- CreateIndex
CREATE UNIQUE INDEX `File_bikeStationId_key` ON `File`(`bikeStationId`);

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_bikeStationId_fkey` FOREIGN KEY (`bikeStationId`) REFERENCES `BikeStation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BikeSpecs` ADD CONSTRAINT `BikeSpecs_bikeID_fkey` FOREIGN KEY (`bikeID`) REFERENCES `Bike`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
