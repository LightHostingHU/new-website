/*
  Warnings:

  - You are about to alter the column `deletion_date` on the `cdn` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expire` on the `cdn` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expire` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `token_expire` on the `resetpassword` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `buy_date` on the `service` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expire_date` on the `service` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `verified` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cdn` MODIFY `deletion_date` DATETIME NOT NULL,
    MODIFY `expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `coupons` MODIFY `expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `resetpassword` MODIFY `token_expire` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `service` MODIFY `buy_date` DATETIME NOT NULL,
    MODIFY `expire_date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `verified`,
    MODIFY `discord` LONGTEXT NULL,
    MODIFY `discordData` LONGTEXT NULL;

-- CreateTable
CREATE TABLE `Account` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` INTEGER NULL,
    `refresh_token` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
