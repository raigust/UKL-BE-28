/*
  Warnings:

  - You are about to alter the column `category` on the `inventory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `inventory` MODIFY `category` ENUM('elektronik', 'nonElektronik') NOT NULL;
