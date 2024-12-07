/*
  Warnings:

  - You are about to drop the column `status` on the `pinjam` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pinjam` DROP COLUMN `status`,
    ADD COLUMN `actualReturnDate` DATETIME(3) NULL;
