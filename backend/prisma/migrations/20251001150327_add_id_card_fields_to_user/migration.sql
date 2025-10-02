/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `BalanceTransaction` DROP FOREIGN KEY `BalanceTransaction_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Rental` DROP FOREIGN KEY `Rental_userId_fkey`;

-- DropIndex
DROP INDEX `BalanceTransaction_userId_fkey` ON `BalanceTransaction`;

-- DropIndex
DROP INDEX `Rental_userId_fkey` ON `Rental`;

-- AlterTable
ALTER TABLE `BalanceTransaction` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Rental` MODIFY `userId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    ADD COLUMN `photo` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `File` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `mimeType` ENUM('IMAGE_JPEG', 'IMAGE_PNG', 'IMAGE_GIF', 'IMAGE_WEBP', 'IMAGE_SVG', 'APPLICATION_PDF', 'APPLICATION_DOC', 'APPLICATION_DOCX', 'APPLICATION_XLS', 'APPLICATION_XLSX', 'APPLICATION_PPT', 'APPLICATION_PPTX', 'TEXT_PLAIN', 'TEXT_HTML', 'AUDIO_MP3', 'AUDIO_WAV', 'AUDIO_OGG', 'VIDEO_MP4', 'VIDEO_WEBM', 'VIDEO_MOV') NOT NULL,
    `size` INTEGER NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `path` VARCHAR(191) NULL,
    `extension` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` VARCHAR(191) NULL,

    UNIQUE INDEX `File_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `File` ADD CONSTRAINT `File_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rental` ADD CONSTRAINT `Rental_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BalanceTransaction` ADD CONSTRAINT `BalanceTransaction_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
