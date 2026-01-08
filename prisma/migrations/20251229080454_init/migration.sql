-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `googleOAuth` VARCHAR(191) NULL,
    `role` ENUM('user', 'doctor') NOT NULL DEFAULT 'user',
    `isPatient` BOOLEAN NOT NULL DEFAULT false,
    `profilePic` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `dob` DATETIME(3) NULL,
    `interests` VARCHAR(191) NULL,
    `disease` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_mobile_key`(`mobile`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_googleOAuth_key`(`googleOAuth`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
