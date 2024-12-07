/*
  Warnings:

  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `transactions`;

-- CreateTable
CREATE TABLE `User` (
    `iduser` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`iduser`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `idinven` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,

    PRIMARY KEY (`idinven`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pinjam` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `inventoryId` INTEGER NOT NULL,
    `pinjamDate` DATETIME(3) NOT NULL,
    `kembalikanDate` DATETIME(3) NOT NULL,
    `actualReturnDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pinjam` ADD CONSTRAINT `Pinjam_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`iduser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pinjam` ADD CONSTRAINT `Pinjam_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`idinven`) ON DELETE RESTRICT ON UPDATE CASCADE;
