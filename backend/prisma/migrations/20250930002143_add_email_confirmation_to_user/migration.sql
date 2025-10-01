-- AlterTable
ALTER TABLE `User` ADD COLUMN `confirmationCode` VARCHAR(191) NULL,
    ADD COLUMN `confirmationCodeExpires` DATETIME(3) NULL,
    ADD COLUMN `emailConfirmed` BOOLEAN NOT NULL DEFAULT false;
