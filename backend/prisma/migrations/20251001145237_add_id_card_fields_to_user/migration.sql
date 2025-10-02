-- AlterTable
ALTER TABLE `User` ADD COLUMN `idCardPhotoUrl` VARCHAR(191) NULL,
    ADD COLUMN `idCardVerified` BOOLEAN NOT NULL DEFAULT false;
