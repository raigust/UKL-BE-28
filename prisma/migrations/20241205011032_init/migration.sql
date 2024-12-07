-- AlterTable
ALTER TABLE `inventory` MODIFY `quantity` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `pinjam` ADD COLUMN `quantity` INTEGER NULL DEFAULT 0,
    MODIFY `pinjamDate` DATE NOT NULL,
    MODIFY `kembalikanDate` DATE NOT NULL;
