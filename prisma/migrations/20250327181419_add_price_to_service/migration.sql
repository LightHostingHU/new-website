/*
  Warnings:

  - You are about to alter the column `deletion_date` on the `cdn` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expire` on the `cdn` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expire` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `token_expire` on the `resetpassword` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `buy_date` on the `service` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expire_date` on the `service` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

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
ALTER TABLE `user` ADD COLUMN `resetToken` VARCHAR(191) NULL,
    ADD COLUMN `resetTokenExpires` DATETIME(3) NULL;
