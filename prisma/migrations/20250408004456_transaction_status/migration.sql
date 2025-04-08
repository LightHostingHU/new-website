/*
  Warnings:

  - You are about to alter the column `deletion_date` on the `cdn` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expire` on the `cdn` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expire` on the `coupons` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `token_expire` on the `resetpassword` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `buy_date` on the `service` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expire_date` on the `service` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `billingoId` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to alter the column `invoiceDate` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[invoiceNumber]` on the table `Transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `Transactions` table without a default value. This is not possible if the table is not empty.

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
ALTER TABLE `transactions` ADD COLUMN `status` VARCHAR(255) NOT NULL,
    MODIFY `billingoId` INTEGER NOT NULL,
    MODIFY `invoiceDate` DATETIME NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Transactions_invoiceNumber_key` ON `Transactions`(`invoiceNumber`);
